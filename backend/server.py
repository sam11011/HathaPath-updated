from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'hatha-path-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# ============ Models ============

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
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
    location_detail: str = "Isha Yoga Center, Coimbatore"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteSettingsUpdate(BaseModel):
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    location_detail: Optional[str] = None

class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    location: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgramCreate(BaseModel):
    title: str
    description: str
    date: str
    location: str
    is_active: bool = True

class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class BrochureDownload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[str] = None
    downloaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BrochureDownloadCreate(BaseModel):
    name: str
    email: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    message: str

# ============ Auth Helpers ============

def create_token(username: str) -> str:
    payload = {
        "username": username,
        "exp": datetime.now(timezone.utc).timestamp() + 86400  # 24 hours
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["username"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ Routes ============

@api_router.get("/")
async def root():
    return {"message": "Hatha Path API"}

# Admin Auth
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(data: AdminLogin):
    admin = await db.admins.find_one({"username": data.username}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(data.password.encode('utf-8'), admin['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(data.username)
    return TokenResponse(token=token, username=data.username)

@api_router.post("/admin/setup")
async def setup_admin():
    """Setup default admin - call once"""
    existing = await db.admins.find_one({"username": "admin"}, {"_id": 0})
    if existing:
        return {"message": "Admin already exists"}
    
    hashed = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
    await db.admins.insert_one({
        "id": str(uuid.uuid4()),
        "username": "admin",
        "password": hashed.decode('utf-8'),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Admin created", "username": "admin", "password": "admin123"}

@api_router.get("/admin/verify")
async def verify_admin(username: str = Depends(verify_token)):
    return {"valid": True, "username": username}

# Site Settings
@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        # Create default settings
        default_settings = SiteSettings()
        doc = default_settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.settings.insert_one(doc)
        return default_settings
    
    if isinstance(settings.get('updated_at'), str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    return SiteSettings(**settings)

@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(data: SiteSettingsUpdate, username: str = Depends(verify_token)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.settings.update_one({}, {"$set": update_data}, upsert=True)
    return await get_settings()

# Programs
@api_router.get("/programs", response_model=List[Program])
async def get_programs():
    programs = await db.programs.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for program in programs:
        if isinstance(program.get('created_at'), str):
            program['created_at'] = datetime.fromisoformat(program['created_at'])
    return programs

@api_router.get("/programs/active", response_model=List[Program])
async def get_active_programs():
    programs = await db.programs.find({"is_active": True}, {"_id": 0}).sort("date", 1).to_list(100)
    for program in programs:
        if isinstance(program.get('created_at'), str):
            program['created_at'] = datetime.fromisoformat(program['created_at'])
    return programs

@api_router.post("/programs", response_model=Program)
async def create_program(data: ProgramCreate, username: str = Depends(verify_token)):
    program = Program(**data.model_dump())
    doc = program.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.programs.insert_one(doc)
    return program

@api_router.put("/programs/{program_id}", response_model=Program)
async def update_program(program_id: str, data: ProgramUpdate, username: str = Depends(verify_token)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.programs.update_one({"id": program_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    
    program = await db.programs.find_one({"id": program_id}, {"_id": 0})
    if isinstance(program.get('created_at'), str):
        program['created_at'] = datetime.fromisoformat(program['created_at'])
    return Program(**program)

@api_router.delete("/programs/{program_id}")
async def delete_program(program_id: str, username: str = Depends(verify_token)):
    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Program not found")
    return {"message": "Program deleted"}

# Brochure Downloads
@api_router.post("/brochure/download", response_model=BrochureDownload)
async def record_brochure_download(data: BrochureDownloadCreate):
    download = BrochureDownload(**data.model_dump())
    doc = download.model_dump()
    doc['downloaded_at'] = doc['downloaded_at'].isoformat()
    await db.brochure_downloads.insert_one(doc)
    return download

@api_router.get("/brochure/downloads", response_model=List[BrochureDownload])
async def get_brochure_downloads(username: str = Depends(verify_token)):
    downloads = await db.brochure_downloads.find({}, {"_id": 0}).sort("downloaded_at", -1).to_list(1000)
    for d in downloads:
        if isinstance(d.get('downloaded_at'), str):
            d['downloaded_at'] = datetime.fromisoformat(d['downloaded_at'])
    return downloads

# Contact Form
@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact(data: ContactSubmissionCreate):
    submission = ContactSubmission(**data.model_dump())
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return submission

@api_router.get("/contact/submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(username: str = Depends(verify_token)):
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for s in submissions:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return submissions

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
