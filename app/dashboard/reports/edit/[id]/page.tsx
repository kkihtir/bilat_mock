import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ReportCreator from "@/components/reports/report-creator"

export const metadata: Metadata = {
  title: "Edit Report | Staff Portal",
  description: "Edit an existing VIP report",
}

export default function EditReportPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Report</h1>
          <p className="mt-2 text-gray-600">Edit an existing report for VIPs</p>
        </div>
        <ReportCreator reportId={params.id} />
      </div>
    </DashboardLayout>
  )
}

