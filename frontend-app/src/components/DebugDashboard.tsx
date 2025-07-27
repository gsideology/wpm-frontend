"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

export default function DebugDashboard() {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);

  const runDebugTests = async () => {
    setIsLoading(true);
    const info: Record<string, unknown> = {};

    // Test 1: Check authentication
    info.auth = {
      isAuthenticated: apiService.isAuthenticated(),
      token: localStorage.getItem("auth_token") ? "Present" : "Missing",
    };

    // Test 2: Manual API call
    try {
      const response = await apiService.getDashboardSummary(1);
      info.apiCall = {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      info.apiCall = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Test 3: Direct fetch call
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        "http://localhost:3001/api/dashboard/summary/1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      info.directFetch = {
        status: response.status,
        success: data.success,
        data: data.data,
        error: data.error,
      };
    } catch (error) {
      info.directFetch = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    runDebugTests();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Debug Dashboard</h2>

      <button
        onClick={runDebugTests}
        disabled={isLoading}
        className="bg-blue-600 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {isLoading ? "Testing..." : "Run Debug Tests"}
      </button>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-green-400">
            Authentication Status:
          </h3>
          <pre className="bg-gray-800 p-2 rounded text-sm">
            {JSON.stringify(debugInfo.auth, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-blue-400">API Service Call:</h3>
          <pre className="bg-gray-800 p-2 rounded text-sm">
            {JSON.stringify(debugInfo.apiCall, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-yellow-400">Direct Fetch Call:</h3>
          <pre className="bg-gray-800 p-2 rounded text-sm">
            {JSON.stringify(debugInfo.directFetch, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-purple-400">Summary:</h3>
          <div className="bg-gray-800 p-2 rounded text-sm">
            {(debugInfo.auth as any)?.isAuthenticated ? (
              <span className="text-green-400">✅ User is authenticated</span>
            ) : (
              <span className="text-red-400">❌ User is not authenticated</span>
            )}
            <br />
            {(debugInfo.apiCall as any)?.success ? (
              <span className="text-green-400">✅ API call successful</span>
            ) : (
              <span className="text-red-400">
                ❌ API call failed: {(debugInfo.apiCall as any)?.error}
              </span>
            )}
            <br />
            {(debugInfo.directFetch as any)?.success ? (
              <span className="text-green-400">✅ Direct fetch successful</span>
            ) : (
              <span className="text-red-400">
                ❌ Direct fetch failed: {(debugInfo.directFetch as any)?.error}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
