import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountryManager from "@/components/countries/country-manager"

export const metadata: Metadata = {
  title: "Country Profiles | Staff Portal",
  description: "Manage country profiles for VIP meetings",
}

export default function ProfilesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Country Profiles</h1>
          <p className="mt-2 text-gray-600">Manage country data and individual profiles for VIP meetings</p>
        </div>
        <CountryManager />
      </div>
    </DashboardLayout>
  )
} 