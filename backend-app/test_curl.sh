#!/bin/bash

# Test script for WooCommerce Forecasting API using curl
# Make sure the backend is running on http://localhost:3001

echo "🚀 Testing WooCommerce Forecasting API"
echo "======================================"

BASE_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}🔍 Testing: $description${NC}"
    echo "   $method $BASE_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 400 ]; then
        echo -e "   ${GREEN}✅ Success! (Status: $status_code)${NC}"
        echo "   Response: $response_body"
    else
        echo -e "   ${RED}❌ Error! (Status: $status_code)${NC}"
        echo "   Error: $response_body"
    fi
}

# Test 1: Health check
test_endpoint "GET" "/" "" "Health Check"

# Test 2: Register new user
register_data='{"email":"test@example.com","password":"test123","name":"Test User"}'
test_endpoint "POST" "/api/auth/register" "$register_data" "User Registration"

# Test 3: Login with admin
login_data='{"email":"admin@example.com","password":"admin123"}'
test_endpoint "POST" "/api/auth/login" "$login_data" "Admin Login"

# Test 4: Get dashboard data (unauthorized - should fail)
test_endpoint "GET" "/api/dashboard/1" "" "Dashboard Data (Unauthorized - Should Fail)"

echo -e "\n${GREEN}🎉 Basic API tests completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Start the frontend: cd ../frontend-app && npm run dev"
echo "2. Navigate to http://localhost:3000"
echo "3. Login with admin@example.com / admin123"
echo "4. Test the full application"

echo -e "\n${YELLOW}To test authenticated endpoints manually:${NC}"
echo "1. Get token from login response above"
echo "2. Use: curl -H 'Authorization: Bearer YOUR_TOKEN' $BASE_URL/api/dashboard/1" 