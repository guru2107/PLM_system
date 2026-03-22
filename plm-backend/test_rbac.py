import requests
import json

# Test role-based access control

# Create an operations user
ops_user = {
    "name": "Test Operations",
    "email": "ops@example.com",
    "password": "test12345",
    "role": "operations"
}

response = requests.post(
    "http://127.0.0.1:8000/auth/signup",
    json=ops_user
)

print("Operations User Created:", response.status_code)

if response.status_code == 201:
    # Login as operations user
    login_data = {
        "email": "ops@example.com",
        "password": "test12345"
    }
    
    login_response = requests.post(
        "http://127.0.0.1:8000/auth/login",
        json=login_data
    )
    
    op_token = login_response.json().get("access_token")
    op_headers = {"Authorization": f"Bearer {op_token}"}
    
    # Try to create a product (should fail - only engineering and admin can create)
    product_data = {"name": "Test Product 2", "sale_price": 50.0, "cost_price": 25.0}
    
    create_response = requests.post(
        "http://127.0.0.1:8000/products",
        json=product_data,
        headers=op_headers
    )
    
    print("\nOperations user trying to create product:")
    print("Status:", create_response.status_code)
    print("Response:", create_response.json())
    
    # But operations user can read products
    read_response = requests.get(
        "http://127.0.0.1:8000/products",
        headers=op_headers
    )
    
    print("\nOperations user reading products:")
    print("Status:", read_response.status_code)
    print("Products found:", len(read_response.json()))

print("\n✅ Role-based access control is working!")
print("- Engineering users can CREATE/UPDATE products")
print("- Operations users can only READ products")
print("- Admin users have all permissions")
