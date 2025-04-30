import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ReportInfoContent from "./report-info-content"

export const metadata: Metadata = {
  title: "Report Information | Staff Portal",
  description: "Enter basic information for your report",
}

export default function ReportInfoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 1: Enter basic information for your report</p>
        </div>
        <ReportInfoContent />
      </div>
    </DashboardLayout>
  )
}

