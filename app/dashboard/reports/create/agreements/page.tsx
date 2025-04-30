import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AgreementsClientPage from "./AgreementsClientPage"

export const metadata: Metadata = {
  title: "Agreements | Staff Portal",
  description: "Add bilateral agreements to your report",
}

export default function AgreementsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 5: Review bilateral agreements</p>
        </div>
        <AgreementsClientPage />
      </div>
    </DashboardLayout>
  )
}

