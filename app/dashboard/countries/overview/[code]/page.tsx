import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountryOverview from "@/components/countries/country-overview"
import { mockCountries } from "@/lib/mock-data"

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `${country.name} Overview | Staff Portal` : "Country Overview | Staff Portal",
    description: country ? `Comprehensive overview of ${country.name}` : "Country overview and information",
  }
}

export default function CountryOverviewPage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)

  if (!country) {
    notFound()
  }

  return (
    <DashboardLayout>
      <CountryOverview countryCode={params.code} />
    </DashboardLayout>
  )
}

