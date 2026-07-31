"""
Simple test script to verify backend is working
Run this after starting the server: python test_backend.py
"""

import requests
import sys

BASE_URL = "http://localhost:5002"

print("=" * 60)
print("Testing Feedback Analyzer Backend")
print("=" * 60)
print()

# Test 1: Health Check
print("Test 1: Health Check Endpoint")
print(f"  URL: {BASE_URL}/api/health")
try:
    response = requests.get(f"{BASE_URL}/api/health", timeout=5)
    if response.status_code == 200:
        print("  ✓ PASSED - Server is running")
        print(f"  Response: {response.json()}")
    else:
        print(f"  ✗ FAILED - Status code: {response.status_code}")
        sys.exit(1)
except requests.exceptions.ConnectionError:
    print("  ✗ FAILED - Cannot connect to server")
    print("  Make sure the backend server is running:")
    print("    cd backend")
    print("    python app.py")
    sys.exit(1)
except Exception as e:
    print(f"  ✗ FAILED - Error: {e}")
    sys.exit(1)

print()
print("=" * 60)
print("All tests passed! Backend is working correctly.")
print("=" * 60)
print()
print("You can now:")
print("1. Open http://localhost:4010 in your browser")
print("2. Sign in to Faculty Dashboard")
print("3. Go to 'Analyze Feedback' tab")
print("4. Upload a CSV file")
print()