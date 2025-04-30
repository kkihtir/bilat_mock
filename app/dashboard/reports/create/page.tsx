import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CreateReportClient from "./create-report-client"

export const metadata: Metadata = {
  title: "Create Report | Staff Portal",
  description: "Create a new VIP report",
}

export default function CreateReportPage() {
  return (
    <DashboardLayout>
      <CreateReportClient />
    </DashboardLayout>
  )
}

