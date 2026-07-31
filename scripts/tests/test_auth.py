"""
Test script for authentication system
Tests signup, login, and protected endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5002"

def print_response(title, response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))

def test_signup():
    """Test user signup"""
    print("\n🔹 Testing Signup...")
    
    data = {
        "first_name": "Test",
        "last_name": "Faculty",
        "email": "test.faculty@example.com",
        "department": "Computer Science",
        "employee_id": "FAC001",
        "password": "password123",
        "confirm_password": "password123",
        "role": "faculty"
    }
    
    response = requests.post(f"{BASE_URL}/api/signup", json=data)
    print_response("Signup Response", response)
    
    if response.status_code == 201:
        return response.json().get('token')
    return None

def test_login():
    """Test user login"""
    print("\n🔹 Testing Login...")
    
    data = {
        "email": "test.faculty@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/api/login", json=data)
    print_response("Login Response", response)
    
    if response.status_code == 200:
        return response.json().get('token')
    return None

def test_get_current_user(token):
    """Test getting current user info"""
    print("\n🔹 Testing Get Current User (Protected Endpoint)...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(f"{BASE_URL}/api/me", headers=headers)
    print_response("Current User Response", response)

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🔹 Testing Invalid Login...")
    
    data = {
        "email": "wrong@example.com",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/api/login", json=data)
    print_response("Invalid Login Response", response)

def test_duplicate_signup():
    """Test signup with existing email"""
    print("\n🔹 Testing Duplicate Signup...")
    
    data = {
        "first_name": "Another",
        "last_name": "User",
        "email": "test.faculty@example.com",  # Same email as before
        "password": "password123",
        "confirm_password": "password123",
        "role": "faculty"
    }
    
    response = requests.post(f"{BASE_URL}/api/signup", json=data)
    print_response("Duplicate Signup Response", response)

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🚀 AUTHENTICATION SYSTEM TEST")
    print("="*60)
    print(f"Testing backend at: {BASE_URL}")
    
    try:
        # Test health check
        print("\n🔹 Testing Health Check...")
        response = requests.get(f"{BASE_URL}/api/health")
        print_response("Health Check", response)
        
        # Test signup
        token = test_signup()
        
        # Test duplicate signup
        test_duplicate_signup()
        
        # Test login
        if not token:
            token = test_login()
        
        # Test invalid login
        test_invalid_login()
        
        # Test protected endpoint
        if token:
            test_get_current_user(token)
        else:
            print("\n❌ No token available. Skipping protected endpoint test.")
        
        print("\n" + "="*60)
        print("✅ ALL TESTS COMPLETED")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend server")
        print("Make sure the backend is running on http://localhost:5002")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

if __name__ == "__main__":
    main()
