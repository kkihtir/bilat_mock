import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ActionItemsClientPage from "./action-items-client-page"

export const metadata: Metadata = {
  title: "Action Items | Staff Portal",
  description: "Add action items to your report",
}

export default function ActionItemsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 6: Add action items to your report</p>
        </div>
        <ActionItemsClientPage />
      </div>
    </DashboardLayout>
  )
}

