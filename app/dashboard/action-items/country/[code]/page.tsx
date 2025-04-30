import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountrySummary from "@/components/action-items/country-summary"
import { mockCountries } from "@/lib/mock-data"

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `${country.name} Action Items | Staff Portal` : "Country Action Items | Staff Portal",
    description: country ? `View action items summary for ${country.name}` : "View country action items summary",
  }
}

export default function CountryActionItemsPage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)

  if (!country) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${params.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{country.name} Action Items</h1>
            <p className="mt-1 text-gray-600">Summary and status of all action items for {country.name}</p>
          </div>
        </div>
        <CountrySummary countryCode={params.code} />
      </div>
    </DashboardLayout>
  )
}

