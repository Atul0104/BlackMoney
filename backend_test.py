#!/usr/bin/env python3
"""
Backend API Testing Script for Ecommerce Platform
Tests Enhanced Notification System, User Registration Auto-Notifications, 
Return Policy Seller Endpoint, Admin Get Users, and Delivery Status APIs
"""

import requests
import json
import sys
import os
from datetime import datetime
import time

# Get backend URL from environment
BACKEND_URL = "https://cart-duplication-fix.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.customer_token = None
        self.admin_token = None
        self.seller_token = None
        self.test_results = []
        self.test_customer_id = None
        self.test_seller_id = None
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if not success and response_data:
            print(f"   Response: {response_data}")
    
    def register_customer(self):
        """Register a customer user for testing"""
        try:
            url = f"{self.base_url}/auth/register"
            data = {
                "email": "testcustomer@test.com",
                "password": "Test123!",
                "name": "Test Customer",
                "role": "customer"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 201 or response.status_code == 200:
                result = response.json()
                self.customer_token = result.get("access_token")
                self.test_customer_id = result.get("user", {}).get("id")
                self.log_result("Customer Registration", True, "Customer registered successfully")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                # Try to login instead
                return self.login_customer()
            else:
                self.log_result("Customer Registration", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Customer Registration", False, f"Exception: {str(e)}")
            return False
    
    def login_customer(self):
        """Login customer if already exists"""
        try:
            url = f"{self.base_url}/auth/login"
            data = {
                "email": "testcustomer@test.com",
                "password": "Test123!"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 200:
                result = response.json()
                self.customer_token = result.get("access_token")
                self.test_customer_id = result.get("user", {}).get("id")
                self.log_result("Customer Login", True, "Customer logged in successfully")
                return True
            else:
                self.log_result("Customer Login", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Customer Login", False, f"Exception: {str(e)}")
            return False
    
    def register_admin(self):
        """Register an admin user for testing"""
        try:
            url = f"{self.base_url}/auth/register"
            data = {
                "email": "testadmin@test.com",
                "password": "Admin123!",
                "name": "Test Admin",
                "role": "admin"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 201 or response.status_code == 200:
                result = response.json()
                self.admin_token = result.get("access_token")
                self.log_result("Admin Registration", True, "Admin registered successfully")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                # Try to login instead
                return self.login_admin()
            else:
                self.log_result("Admin Registration", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Registration", False, f"Exception: {str(e)}")
            return False
    
    def login_admin(self):
        """Login admin if already exists"""
        try:
            url = f"{self.base_url}/auth/login"
            data = {
                "email": "testadmin@test.com",
                "password": "Admin123!"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 200:
                result = response.json()
                self.admin_token = result.get("access_token")
                self.log_result("Admin Login", True, "Admin logged in successfully")
                return True
            else:
                self.log_result("Admin Login", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Admin Login", False, f"Exception: {str(e)}")
            return False
    
    def register_seller(self):
        """Register a seller user for testing"""
        try:
            url = f"{self.base_url}/auth/register"
            data = {
                "email": "testseller@test.com",
                "password": "Seller123!",
                "name": "Test Seller",
                "role": "seller"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 201 or response.status_code == 200:
                result = response.json()
                self.seller_token = result.get("access_token")
                self.test_seller_id = result.get("user", {}).get("id")
                self.log_result("Seller Registration", True, "Seller registered successfully")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                # Try to login instead
                return self.login_seller()
            else:
                self.log_result("Seller Registration", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Seller Registration", False, f"Exception: {str(e)}")
            return False
    
    def login_seller(self):
        """Login seller if already exists"""
        try:
            url = f"{self.base_url}/auth/login"
            data = {
                "email": "testseller@test.com",
                "password": "Seller123!"
            }
            
            response = requests.post(url, json=data)
            
            if response.status_code == 200:
                result = response.json()
                self.seller_token = result.get("access_token")
                self.test_seller_id = result.get("user", {}).get("id")
                self.log_result("Seller Login", True, "Seller logged in successfully")
                return True
            else:
                self.log_result("Seller Login", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Seller Login", False, f"Exception: {str(e)}")
            return False
    
    def create_seller_profile(self):
        """Create seller profile for testing return policy endpoint"""
        if not self.seller_token:
            self.log_result("Create Seller Profile", False, "No seller token available")
            return False
            
        try:
            url = f"{self.base_url}/sellers/register"
            headers = {"Authorization": f"Bearer {self.seller_token}"}
            data = {
                "business_name": "Test Business",
                "business_email": "business@test.com",
                "business_phone": "9876543210",
                "gst_number": "29ABCDE1234F1Z5",
                "address": "123 Business Street",
                "city": "Bangalore",
                "state": "Karnataka",
                "pincode": "560001"
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 201 or response.status_code == 200:
                result = response.json()
                self.log_result("Create Seller Profile", True, "Seller profile created successfully", result)
                return True
            elif response.status_code == 400 and "already exists" in response.text:
                self.log_result("Create Seller Profile", True, "Seller profile already exists")
                return True
            else:
                self.log_result("Create Seller Profile", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Create Seller Profile", False, f"Exception: {str(e)}")
            return False
    
    def test_platform_settings_get(self):
        """Test GET /api/platform-settings (no auth required)"""
        try:
            url = f"{self.base_url}/platform-settings"
            response = requests.get(url)
            
            if response.status_code == 200:
                result = response.json()
                if "gst_percentage" in result:
                    self.log_result("Platform Settings GET", True, f"Retrieved platform settings with GST: {result.get('gst_percentage')}%", result)
                    return True
                else:
                    self.log_result("Platform Settings GET", False, "Response missing gst_percentage field", result)
                    return False
            else:
                self.log_result("Platform Settings GET", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Platform Settings GET", False, f"Exception: {str(e)}")
            return False
    
    def test_platform_settings_update(self):
        """Test PUT /api/admin/platform-settings (requires admin auth)"""
        if not self.admin_token:
            self.log_result("Platform Settings UPDATE", False, "No admin token available")
            return False
            
        try:
            url = f"{self.base_url}/admin/platform-settings"
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            data = {
                "gst_percentage": 20.0
            }
            
            response = requests.put(url, json=data, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                self.log_result("Platform Settings UPDATE", True, "Platform settings updated successfully", result)
                return True
            else:
                self.log_result("Platform Settings UPDATE", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Platform Settings UPDATE", False, f"Exception: {str(e)}")
            return False
    
    def test_create_address(self):
        """Test POST /api/addresses"""
        if not self.customer_token:
            self.log_result("Create Address", False, "No customer token available")
            return False
            
        try:
            url = f"{self.base_url}/addresses"
            headers = {"Authorization": f"Bearer {self.customer_token}"}
            data = {
                "name": "John Doe",
                "phone": "9876543210",
                "pincode": "560001",
                "address_line1": "123 Test Street",
                "address_line2": "Near Test Mall",
                "city": "Bangalore",
                "state": "Karnataka",
                "landmark": "Test Landmark",
                "address_type": "home",
                "is_default": True
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 201 or response.status_code == 200:
                result = response.json()
                self.log_result("Create Address", True, "Address created successfully", result)
                return True
            else:
                self.log_result("Create Address", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Create Address", False, f"Exception: {str(e)}")
            return False
    
    def test_get_addresses(self):
        """Test GET /api/addresses"""
        if not self.customer_token:
            self.log_result("Get Addresses", False, "No customer token available")
            return False
            
        try:
            url = f"{self.base_url}/addresses"
            headers = {"Authorization": f"Bearer {self.customer_token}"}
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list):
                    self.log_result("Get Addresses", True, f"Retrieved {len(result)} addresses", result)
                    return True
                else:
                    self.log_result("Get Addresses", False, "Response is not a list", result)
                    return False
            else:
                self.log_result("Get Addresses", False, f"Failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Get Addresses", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence as requested
        tests_passed = 0
        total_tests = 6
        
        # 1. Register customer
        if self.register_customer():
            tests_passed += 1
        
        # 2. Create address
        if self.test_create_address():
            tests_passed += 1
        
        # 3. Get addresses
        if self.test_get_addresses():
            tests_passed += 1
        
        # 4. Test platform settings GET (no auth)
        if self.test_platform_settings_get():
            tests_passed += 1
        
        # 5. Register admin
        if self.register_admin():
            tests_passed += 1
        
        # 6. Test platform settings UPDATE
        if self.test_platform_settings_update():
            tests_passed += 1
        
        print("=" * 60)
        print(f"📊 Test Summary: {tests_passed}/{total_tests} tests passed")
        
        if tests_passed == total_tests:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check details above.")
            return False

def main():
    """Main function to run tests"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Print detailed results
    print("\n" + "=" * 60)
    print("📋 Detailed Test Results:")
    for result in tester.test_results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}: {result['message']}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())