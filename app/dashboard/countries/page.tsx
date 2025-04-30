import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountrySelector from "@/components/countries/country-selector"

export const metadata: Metadata = {
  title: "Countries | Staff Portal",
  description: "View and manage country information",
}

export default function CountrySelectorPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Countries</h1>
          <p className="mt-2 text-gray-600">View and manage country information</p>
        </div>
        <CountrySelector />
      </div>
    </DashboardLayout>
  )
}

