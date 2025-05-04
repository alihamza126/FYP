"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <Link
            href="/admin"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Categories
          </Link>
          <Link
            href="/admin/brands"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Brands
          </Link>
          <Link
            href="/admin/trafficView"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Traffic View
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
