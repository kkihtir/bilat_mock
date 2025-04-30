import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import NewsEventsClientPage from "./NewsEventsClientPage"

export const metadata: Metadata = {
  title: "News & Events | Staff Portal",
  description: "Add news and events to your report",
}

export default function NewsEventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 4: Add news and events information</p>
        </div>
        <NewsEventsClientPage />
      </div>
    </DashboardLayout>
  )
}

