import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockProfiles, mockCountries } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown, Trash2, X } from "lucide-react"
import ProfileForm from "@/components/profiles/profile-form"
import DeleteProfileDialog from "@/components/profiles/delete-profile-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  const profile = mockProfiles.find((p) => p.id === params.id) as Profile | undefined
  return {
    title: profile ? `Edit ${profile.fullName} | Staff Portal` : "Edit Profile | Staff Portal",
    description: profile ? `Edit profile details for ${profile.fullName}` : "Edit profile details",
  }
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const profile = mockProfiles.find((p) => p.id === params.id) as Profile | undefined
  const country = profile ? mockCountries.find((c) => c.code === profile.country) : null

  if (!profile || !country) {
    notFound()
  }

  const countrySubPages = [
    { name: "Overview", href: `/dashboard/countries/${profile.country}` },
    { name: "Action Items", href: `/dashboard/countries/${profile.country}/action-items` },
    { name: "Profiles", href: `/dashboard/countries/${profile.country}/profiles` },
    { name: "Agreements", href: `/dashboard/countries/${profile.country}/agreements` },
    { name: "Reports", href: `/dashboard/countries/${profile.country}/reports` },
    { name: "Talking Points", href: `/dashboard/countries/${profile.country}/talking-points` },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 mr-2" 
            asChild
          >
            <Link href={`/dashboard/countries/${profile.country}/profiles`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Link href="/dashboard/countries" className="hover:text-primary">Countries</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/dashboard/countries/${profile.country}`} className="hover:text-primary">
            {country.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-2 py-1 -ml-2 hover:bg-transparent hover:text-primary flex items-center gap-1">
                Profiles
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {countrySubPages.map((page) => (
                <DropdownMenuItem key={page.href} asChild>
                  <Link href={page.href} className="flex items-center">
                    {page.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-transparent hover:text-primary">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {mockCountries.map((c) => (
                <DropdownMenuItem key={c.code} asChild>
                  <Link href={`/dashboard/countries/${c.code}/profiles`} className="flex items-center">
                    <img
                      src={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                      alt={`${c.name} flag`}
                      className="h-4 w-6 mr-2 rounded-sm object-cover"
                    />
                    {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground">{profile.fullName}</span>
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${profile.country.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Profile Details</h1>
                <p className="mt-1 text-gray-600">Edit profile details for {profile.fullName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/profiles/${params.id}`}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ProfileForm 
          initialData={profile}
          countryCode={profile.country}
        />
      </div>
    </DashboardLayout>
  )
} 