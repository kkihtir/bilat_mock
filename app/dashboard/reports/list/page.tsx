import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ReportsListView from "@/components/reports/reports-list-view"

export const metadata: Metadata = {
  title: "Reports List | Staff Portal",
  description: "View all reports in a list format",
}

export default function ReportsListPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports List</h1>
          <p className="mt-2 text-gray-600">View and manage all reports in a list format</p>
        </div>
        <ReportsListView />
      </div>
    </DashboardLayout>
  )
}

