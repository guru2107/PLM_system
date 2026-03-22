#!/usr/bin/env python3
"""
Test script for PLM API with API Key authentication
"""
import requests

# Configuration
API_BASE_URL = "http://localhost:8000"
API_KEY = "10.190.117.97"  # Your IP address as API key

# Headers with API key
headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

def test_health():
    """Test health endpoint (no auth required)"""
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Health check failed: {e}")

def test_users():
    """Test users endpoint with API key"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/users", headers=headers)
        print(f"Users API: {response.status_code}")
        if response.status_code == 200:
            users = response.json()
            print(f"Found {len(users)} users")
            for user in users[:2]:  # Show first 2 users
                print(f"  - {user['name']} ({user['email']}) - {user['role']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Users API failed: {e}")

def test_products():
    """Test products endpoint with API key"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/products", headers=headers)
        print(f"Products API: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Found {len(products)} products")
            for product in products[:2]:  # Show first 2 products
                print(f"  - {product['name']} - ${product['sale_price']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Products API failed: {e}")

def test_without_api_key():
    """Test what happens without API key"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/users")
        print(f"Without API Key: {response.status_code}")
        print(f"Error: {response.json()}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing PLM API with API Key Authentication")
    print("=" * 50)

    print("\n1. Health Check (no auth required):")
    test_health()

    print("\n2. Users API (with API key):")
    test_users()

    print("\n3. Products API (with API key):")
    test_products()

    print("\n4. Testing without API key:")
    test_without_api_key()

    print("\n" + "=" * 50)
    print("✅ API Key authentication configured!")
    print(f"📋 API Key: {API_KEY}")
    print("🔗 API URL: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")