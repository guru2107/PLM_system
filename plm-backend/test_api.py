import requests
import json

# Test signup
signup_data = {
    "name": "Test Engineer",
    "email": "engineer@example.com",
    "password": "test12345",
    "role": "engineering"
}

response = requests.post(
    "http://127.0.0.1:8000/auth/signup",
    json=signup_data
)

print("Signup Response:", response.status_code)
print(json.dumps(response.json(), indent=2))

if response.status_code == 201:
    # Test login
    login_data = {
        "email": "engineer@example.com",
        "password": "test12345"
    }
    
    login_response = requests.post(
        "http://127.0.0.1:8000/auth/login",
        json=login_data
    )
    
    print("\nLogin Response:", login_response.status_code)
    login_result = login_response.json()
    print(json.dumps(login_result, indent=2))
    
    if login_response.status_code == 200:
        token = login_result.get("access_token")
        
        # Test products endpoint with token
        headers = {"Authorization": f"Bearer {token}"}
        
        products_response = requests.get(
            "http://127.0.0.1:8000/products",
            headers=headers
        )
        
        print("\nProducts API Response:", products_response.status_code)
        print(json.dumps(products_response.json(), indent=2))
        
        # Test creating a product
        product_data = {
            "name": "Test Product",
            "sale_price": 100.0,
            "cost_price": 50.0
        }
        
        create_response = requests.post(
            "http://127.0.0.1:8000/products",
            json=product_data,
            headers=headers
        )
        
        print("\nCreate Product Response:", create_response.status_code)
        print(json.dumps(create_response.json(), indent=2))
