import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockCountries } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProfileForm from "@/components/profiles/profile-form"

// Define the Profile interface
interface Profile {
  id: string
  fullName: string
  position: string
  type: "ambassador" | "non-ambassador"
  education: string
  overview: string
  imageUrl: string
  country: string
}

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `Add Profile for ${country.name} | Staff Portal` : "Add Country Profile | Staff Portal",
    description: country ? `Add a new profile for ${country.name}` : "Add a new country profile",
  }
}

export default function NewProfilePage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)

  if (!country) {
    notFound()
  }

  // Create an empty profile with the country code
  const emptyProfile: Profile = {
    id: `new-${Date.now()}`,
    fullName: "",
    position: "",
    type: "ambassador",
    education: "",
    overview: "",
    imageUrl: "",
    country: params.code,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={`/dashboard/countries/${params.code}/profiles`}>
              <ArrowLeft className="h-4 w-4" /> Back to Profiles
            </Link>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${params.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">Add New Profile</h1>
            <p className="mt-1 text-gray-600">Create a new profile for {country.name}</p>
          </div>
        </div>

        <ProfileForm initialData={emptyProfile} countryCode={params.code} />
      </div>
    </DashboardLayout>
  )
} 