import Link from "next/link";

export default function Home() {
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
            href="/dashboard"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
          >
            Access Dashboard
          </Link>

          <Link
            href="/api/test-db"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors block"
          >
            Test Database
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Built with Next.js, Drizzle ORM & PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
}
