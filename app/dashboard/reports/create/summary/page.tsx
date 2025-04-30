import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SummaryClientPage from "./SummaryClientPage"

export const metadata: Metadata = {
  title: "Report Summary | Staff Portal",
  description: "Review and finalize your report",
}

export default function SummaryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 8: Review and finalize your report</p>
        </div>
        <SummaryClientPage />
      </div>
    </DashboardLayout>
  )
}

