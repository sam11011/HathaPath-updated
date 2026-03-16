from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ.get("JWT_SECRET", "hatha-path-secret-key-2024")
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()


class AdminLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    token: str
    username: str


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    whatsapp: str = "+91 9876543210"
    instagram: str = "hatha_path"
    email: str = "contact@hathapath.com"
    location: str = "Pune, Maharashtra, India"
    location_detail: str = ""
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Workshop(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    dates: str
    image: str = ""
    is_active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WorkshopCreate(BaseModel):
    title: str
    dates: str
    image: str = ""
    is_active: bool = True
    order: int = 0


class WorkshopUpdate(BaseModel):
    title: Optional[str] = None
    dates: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class Analytics(BaseModel):
    total_visits: int
    total_downloads: int
    total_contacts: int
    visits_today: int
    visits_this_week: int
    visits_this_month: int


def create_token(username: str):
    payload = {
        "username": username,
        "exp": datetime.now(timezone.utc).timestamp() + 86400,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["username"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/")
async def root():
    return {"message": "Hatha Path API"}


@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(data: AdminLogin):
    admin = await db.admins.find_one({"username": data.username}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(data.password.encode("utf-8"), admin["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(data.username)
    return TokenResponse(token=token, username=data.username)


@api_router.post("/admin/setup")
async def setup_admin():
    existing = await db.admins.find_one({"username": "admin"}, {"_id": 0})
    if existing:
        return {"message": "Admin already exists"}

    hashed = bcrypt.hashpw("admin123".encode("utf-8"), bcrypt.gensalt())
    await db.admins.insert_one(
        {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "password": hashed.decode("utf-8"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return {"message": "Admin created", "username": "admin", "password": "admin123"}


@api_router.get("/workshops", response_model=List[Workshop])
async def get_workshops():
    workshops = (
        await db.workshops.find({"is_active": True}, {"_id": 0})
        .sort("order", 1)
        .to_list(100)
    )
    return workshops


@api_router.post("/workshops", response_model=Workshop)
async def create_workshop(data: WorkshopCreate, username: str = Depends(verify_token)):
    workshop = Workshop(**data.model_dump())
    doc = workshop.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.workshops.insert_one(doc)
    return workshop


@api_router.post("/analytics/visit")
async def track_visit():
    visit = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    await db.visits.insert_one(visit)
    return {"success": True}


@api_router.get("/analytics", response_model=Analytics)
async def get_analytics(username: str = Depends(verify_token)):
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    week_ago = (now - timedelta(days=7)).isoformat()
    month_ago = (now - timedelta(days=30)).isoformat()

    total_visits = await db.visits.count_documents({})
    total_downloads = await db.brochure_downloads.count_documents({})
    total_contacts = await db.contact_submissions.count_documents({})

    visits_today = await db.visits.count_documents({"date": today})
    visits_this_week = await db.visits.count_documents({"timestamp": {"$gte": week_ago}})
    visits_this_month = await db.visits.count_documents({"timestamp": {"$gte": month_ago}})

    return Analytics(
        total_visits=total_visits,
        total_downloads=total_downloads,
        total_contacts=total_contacts,
        visits_today=visits_today,
        visits_this_week=visits_this_week,
        visits_this_month=visits_this_month,
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()