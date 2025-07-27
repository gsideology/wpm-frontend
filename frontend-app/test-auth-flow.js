// Test Authentication Flow and Data Loading
// Run this in browser console at http://localhost:3000

console.log("🧪 Testing Authentication Flow and Data Loading...");

// Test 1: Check if user is logged in
function checkAuthStatus() {
  console.log("\n🔍 Test 1: Authentication Status");
  const token = localStorage.getItem("auth_token");
  console.log("   Stored token:", token ? "Present" : "Missing");
  console.log("   Current URL:", window.location.href);

  if (token) {
    console.log("   ✅ User appears to be logged in");
    return true;
  } else {
    console.log("   ❌ User not logged in");
    return false;
  }
}

// Test 2: Manual login test
async function testManualLogin() {
  console.log("\n🔍 Test 2: Manual Login Test");

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "admin123",
      }),
    });

    const data = await response.json();
    console.log("   Login response:", data);

    if (data.success && data.data?.access_token) {
      console.log("   ✅ Login successful");
      localStorage.setItem("auth_token", data.data.access_token);
      console.log("   ✅ Token saved to localStorage");
      return data.data.access_token;
    } else {
      console.log("   ❌ Login failed:", data.error);
      return null;
    }
  } catch (error) {
    console.log("   ❌ Login error:", error.message);
    return null;
  }
}

// Test 3: Test dashboard data with token
async function testDashboardData(token) {
  console.log("\n🔍 Test 3: Dashboard Data Test");

  if (!token) {
    console.log("   ❌ No token available");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3001/api/dashboard/summary/1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("   Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Dashboard data received:", data);

      if (data.success && data.data) {
        console.log("   📊 Total Products:", data.data.total_products);
        console.log("   📊 Total Sales:", data.data.total_forecasted_sales);
        console.log("   📊 Organization ID:", data.data.organization_id);
        return data.data;
      } else {
        console.log("   ❌ Data structure issue:", data);
        return null;
      }
    } else {
      console.log("   ❌ Dashboard request failed:", response.status);
      return null;
    }
  } catch (error) {
    console.log("   ❌ Dashboard error:", error.message);
    return null;
  }
}

// Test 4: Check React Query cache
function checkReactQueryCache() {
  console.log("\n🔍 Test 4: React Query Cache");

  // Try to access React Query cache
  if (window.__REACT_QUERY_CACHE__) {
    console.log("   ✅ React Query cache found");
    const queries = window.__REACT_QUERY_CACHE__.getAll();
    console.log("   📊 Number of queries:", queries.length);

    queries.forEach((query, key) => {
      console.log(`   🔍 Query ${key}:`, {
        data: query.state.data,
        error: query.state.error,
        isLoading: query.state.isLoading,
      });
    });
  } else {
    console.log("   ❌ React Query cache not accessible");
  }
}

// Test 5: Check dashboard component state
function checkDashboardState() {
  console.log("\n🔍 Test 5: Dashboard Component State");

  // Look for dashboard elements
  const dashboardCards = document.querySelectorAll('[class*="bg-[#0b1739]"]');
  console.log("   📊 Dashboard cards found:", dashboardCards.length);

  dashboardCards.forEach((card, index) => {
    const text = card.textContent;
    console.log(
      `   📊 Card ${index + 1}:`,
      text.trim().substring(0, 50) + "..."
    );
  });

  // Look for loading states
  const loadingElements = document.querySelectorAll('[class*="animate-spin"]');
  console.log("   🔄 Loading elements found:", loadingElements.length);

  // Look for error messages
  const errorElements = document.querySelectorAll('[class*="text-red"]');
  console.log("   ❌ Error elements found:", errorElements.length);
}

// Test 6: Force refresh dashboard data
async function forceRefreshDashboard() {
  console.log("\n🔍 Test 6: Force Refresh Dashboard");

  // Try to trigger a manual refresh
  const refreshButton = document.querySelector(
    'button:contains("Aggiorna Dati")'
  );
  if (refreshButton) {
    console.log("   🔄 Found refresh button, clicking...");
    refreshButton.click();
  } else {
    console.log("   ❌ Refresh button not found");
  }

  // Wait a bit and check again
  setTimeout(() => {
    console.log("   ⏰ Checking dashboard state after refresh...");
    checkDashboardState();
  }, 2000);
}

// Run all tests
async function runAuthTests() {
  console.log("🚀 Starting Authentication and Data Tests...\n");

  // Check current auth status
  const isLoggedIn = checkAuthStatus();

  // If not logged in, try to login
  let token = null;
  if (!isLoggedIn) {
    token = await testManualLogin();
  } else {
    token = localStorage.getItem("auth_token");
  }

  // Test dashboard data
  const dashboardData = await testDashboardData(token);

  // Check React Query cache
  checkReactQueryCache();

  // Check dashboard component state
  checkDashboardState();

  // Force refresh if needed
  if (!dashboardData) {
    await forceRefreshDashboard();
  }

  console.log("\n🎉 Authentication and Data Tests Complete!");

  if (dashboardData) {
    console.log("\n✅ SUCCESS: Dashboard data is loading correctly!");
    console.log("   The issue might be in the React component rendering.");
  } else {
    console.log("\n❌ ISSUE: Dashboard data is not loading.");
    console.log("   Check the backend server and authentication.");
  }

  console.log("\n🔧 Next Steps:");
  console.log("1. Check browser console for any errors");
  console.log("2. Verify backend is running on port 3001");
  console.log("3. Check network tab for failed requests");
  console.log("4. Try logging out and logging back in");
}

// Run tests
runAuthTests();
