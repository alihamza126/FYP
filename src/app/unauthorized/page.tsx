import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        You don't have permission to access this page. This area is restricted to administrators only.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="px-4 py-2 bg-secondary2 text-white hover:bg-gray-300 rounded-md transition-colors">
          Return Home
        </Link>
        <Link href="/login" className="px-4 py-2 bg-purple text-white hover:bg-blue-600 rounded-md transition-colors">
          Login as Admin
        </Link>
      </div>
    </div>
  )
}
