import requests
import sys
from datetime import datetime

class HathaPathAPITester:
    def __init__(self, base_url="https://hatha-path.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed")
                try:
                    response_data = response.json() if response.content else {}
                except:
                    response_data = {}
                return True, response_data
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text}")
                except:
                    print("   Response: Unable to decode")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root"""
        return self.run_test("API Root", "GET", "", 200)

    def test_admin_setup(self):
        """Test admin setup"""
        success, response = self.run_test(
            "Admin Setup",
            "POST",
            "admin/setup",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_verify(self):
        """Test admin token verification"""
        if not self.token:
            print("❌ No token available for admin verify test")
            return False
        return self.run_test("Admin Token Verify", "GET", "admin/verify", 200)

    def test_get_settings(self):
        """Test getting site settings"""
        return self.run_test("Get Site Settings", "GET", "settings", 200)

    def test_update_settings(self):
        """Test updating site settings"""
        if not self.token:
            print("❌ No token available for settings update test")
            return False
        
        update_data = {
            "whatsapp": "+91 9876543210",
            "instagram": "hatha_path_test",
            "location": "Test Location"
        }
        return self.run_test(
            "Update Site Settings",
            "PUT",
            "settings",
            200,
            data=update_data
        )

    def test_create_program(self):
        """Test creating a program"""
        if not self.token:
            print("❌ No token available for program creation test")
            return False
        
        program_data = {
            "title": "Test Yoga Program",
            "description": "Test program description",
            "date": "March 15-20, 2026",
            "location": "Test Location",
            "is_active": True
        }
        success, response = self.run_test(
            "Create Program",
            "POST",
            "programs",
            200,
            data=program_data
        )
        if success and 'id' in response:
            self.program_id = response['id']
            print(f"   Program created with ID: {self.program_id}")
        return success

    def test_get_programs(self):
        """Test getting all programs"""
        return self.run_test("Get All Programs", "GET", "programs", 200)

    def test_get_active_programs(self):
        """Test getting active programs"""
        return self.run_test("Get Active Programs", "GET", "programs/active", 200)

    def test_update_program(self):
        """Test updating a program"""
        if not self.token or not hasattr(self, 'program_id'):
            print("❌ No token or program ID available for program update test")
            return False
        
        update_data = {
            "title": "Updated Test Yoga Program",
            "description": "Updated description"
        }
        return self.run_test(
            "Update Program",
            "PUT",
            f"programs/{self.program_id}",
            200,
            data=update_data
        )

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "message": "This is a test message from backend testing"
        }
        return self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data
        )

    def test_brochure_download(self):
        """Test brochure download recording"""
        download_data = {
            "name": "Test User",
            "email": "test@example.com"
        }
        return self.run_test(
            "Brochure Download",
            "POST",
            "brochure/download",
            200,
            data=download_data
        )

    def test_get_contact_submissions(self):
        """Test getting contact submissions (admin only)"""
        if not self.token:
            print("❌ No token available for contact submissions test")
            return False
        return self.run_test("Get Contact Submissions", "GET", "contact/submissions", 200)

    def test_get_brochure_downloads(self):
        """Test getting brochure downloads (admin only)"""
        if not self.token:
            print("❌ No token available for brochure downloads test")
            return False
        return self.run_test("Get Brochure Downloads", "GET", "brochure/downloads", 200)

    def test_delete_program(self):
        """Test deleting a program"""
        if not self.token or not hasattr(self, 'program_id'):
            print("❌ No token or program ID available for program deletion test")
            return False
        
        return self.run_test(
            "Delete Program",
            "DELETE",
            f"programs/{self.program_id}",
            200
        )

def main():
    print("🚀 Starting Hatha Path API Testing...")
    print("=" * 60)
    
    tester = HathaPathAPITester()
    
    # Test sequence
    test_sequence = [
        ("API Root", tester.test_root_endpoint),
        ("Admin Setup", tester.test_admin_setup),
        ("Admin Login", tester.test_admin_login),
        ("Admin Token Verify", tester.test_admin_verify),
        ("Get Site Settings", tester.test_get_settings),
        ("Update Settings", tester.test_update_settings),
        ("Contact Form", tester.test_contact_submission),
        ("Brochure Download", tester.test_brochure_download),
        ("Create Program", tester.test_create_program),
        ("Get All Programs", tester.test_get_programs),
        ("Get Active Programs", tester.test_get_active_programs),
        ("Update Program", tester.test_update_program),
        ("Get Contact Submissions", tester.test_get_contact_submissions),
        ("Get Brochure Downloads", tester.test_get_brochure_downloads),
        ("Delete Program", tester.test_delete_program),
    ]
    
    # Run tests
    for test_name, test_func in test_sequence:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Backend API Testing Results:")
    print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"   Success rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())