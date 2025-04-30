import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfilesClientPage from "./profiles-client-page"

export const metadata: Metadata = {
  title: "Report Profiles | Staff Portal",
  description: "Add profiles to your report",
}

export default function ProfilesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 2: Add profiles to your report</p>
        </div>
        <ProfilesClientPage />
      </div>
    </DashboardLayout>
  )
}

