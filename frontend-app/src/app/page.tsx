"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WPM Frontend
          </h1>
          <p className="text-gray-600">
            Woocommerce Performance Management Application
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors block"
          >
            Access Dashboard
          </Link>

          <Link
            href="/api/test-db"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors block"
          >
            Test Database
          </Link>

          <Link
            href="/api/test-backend"
            className="w-full bg-green-100 text-green-700 py-3 px-6 rounded-lg font-medium hover:bg-green-200 transition-colors block"
          >
            Test Backend API
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Built with Next.js, Drizzle ORM & PostgreSQL
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Backend:{" "}
            <a href="https://github.com/gsideology/wpm" className="underline">
              gsideology/wpm
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
