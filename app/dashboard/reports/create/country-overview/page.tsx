import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountryOverviewClientPage from "./country-overview-client-page"

export const metadata: Metadata = {
  title: "Country Overview | Staff Portal",
  description: "Add country overview information to your report",
}

export default function CountryOverviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="mt-2 text-gray-600">Step 3: Add country overview information</p>
        </div>
        <CountryOverviewClientPage />
      </div>
    </DashboardLayout>
  )
}

