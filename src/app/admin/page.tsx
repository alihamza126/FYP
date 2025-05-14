import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentProducts } from "@/components/admin/recent-products"
import { SalesSummary } from "@/components/admin/sales-summary"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProducts />
        <SalesSummary />
      </div>
    </div>
  )
}
