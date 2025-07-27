#!/usr/bin/env python3
"""
Test script for the WooCommerce Forecasting API
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:3001"

def test_endpoint(method, endpoint, data=None, headers=None, description=""):
    """Test an API endpoint and print results"""
    url = f"{BASE_URL}{endpoint}"
    
    print(f"\n🔍 Testing: {description}")
    print(f"   {method} {url}")
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code < 400:
            print("   ✅ Success!")
            try:
                result = response.json()
                print(f"   Response: {json.dumps(result, indent=2)}")
            except:
                print(f"   Response: {response.text}")
        else:
            print("   ❌ Error!")
            print(f"   Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection Error: Make sure the backend server is running on port 3001")
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    return response if 'response' in locals() else None

def main():
    print("🚀 Starting API Tests for WooCommerce Forecasting System")
    print("=" * 60)
    
    # Test 1: Health check (if available)
    test_endpoint("GET", "/", description="Health Check")
    
    # Test 2: Register a new user
    register_data = {
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User"
    }
    register_response = test_endpoint("POST", "/api/auth/register", 
                                    data=register_data, 
                                    description="User Registration")
    
    # Test 3: Login with default admin user
    login_data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    login_response = test_endpoint("POST", "/api/auth/login", 
                                 data=login_data, 
                                 description="Admin Login")
    
    # Extract token from login response
    token = None
    if login_response and login_response.status_code == 200:
        try:
            result = login_response.json()
            if result.get("success") and result.get("data", {}).get("access_token"):
                token = result["data"]["access_token"]
                print(f"\n🔑 Token extracted: {token[:20]}...")
        except:
            pass
    
    # Set up headers with authentication
    auth_headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    # Test 4: Get dashboard data (requires authentication)
    test_endpoint("GET", "/api/dashboard/1", 
                 headers=auth_headers, 
                 description="Dashboard Data (Authenticated)")
    
    # Test 5: Get dashboard summary
    test_endpoint("GET", "/api/dashboard/summary/1", 
                 headers=auth_headers, 
                 description="Dashboard Summary")
    
    # Test 6: Get organizations
    test_endpoint("GET", "/api/organizations", 
                 headers=auth_headers, 
                 description="Get Organizations")
    
    # Test 7: Get specific organization
    test_endpoint("GET", "/api/organizations/1", 
                 headers=auth_headers, 
                 description="Get Organization by ID")
    
    # Test 8: Get sales forecasts
    test_endpoint("GET", "/api/sales-forecasts/1", 
                 headers=auth_headers, 
                 description="Get Sales Forecasts")
    
    # Test 9: Create sales forecast
    forecast_data = {
        "product_id": 1,
        "forecasted_sales": 150.0,
        "organization_id": 1
    }
    test_endpoint("POST", "/api/sales-forecasts", 
                 data=forecast_data, 
                 headers=auth_headers, 
                 description="Create Sales Forecast")
    
    # Test 10: Update sales forecast
    update_data = {
        "product_id": 1,
        "forecasted_sales": 200.0,
        "organization_id": 1
    }
    test_endpoint("PUT", "/api/sales-forecasts/1", 
                 data=update_data, 
                 headers=auth_headers, 
                 description="Update Sales Forecast")
    
    # Test 11: Sync WooCommerce data
    test_endpoint("POST", "/api/woocommerce/sync/1", 
                 headers=auth_headers, 
                 description="Sync WooCommerce Data")
    
    # Test 12: Get WooCommerce products
    test_endpoint("GET", "/api/woocommerce/products/1", 
                 headers=auth_headers, 
                 description="Get WooCommerce Products")
    
    # Test 13: Get WooCommerce orders
    test_endpoint("GET", "/api/woocommerce/orders/1", 
                 headers=auth_headers, 
                 description="Get WooCommerce Orders")
    
    # Test 14: Delete sales forecast
    test_endpoint("DELETE", "/api/sales-forecasts/1", 
                 headers=auth_headers, 
                 description="Delete Sales Forecast")
    
    # Test 15: Test unauthorized access (should fail)
    test_endpoint("GET", "/api/dashboard/1", 
                 description="Dashboard Data (Unauthorized - Should Fail)")
    
    print("\n" + "=" * 60)
    print("🎉 API Testing Complete!")
    print("\n📋 Summary:")
    print("- Authentication endpoints should work")
    print("- Protected endpoints should work with valid token")
    print("- Unauthorized access should be rejected")
    print("- All CRUD operations should function")
    print("\n🔧 Next Steps:")
    print("1. Start the frontend: cd frontend-app && npm run dev")
    print("2. Navigate to http://localhost:3000")
    print("3. Login with admin@example.com / admin123")
    print("4. Test the full application")

if __name__ == "__main__":
    main() 