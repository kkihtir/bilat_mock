import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockCountries, mockProfiles } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown, User, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `${country.name} Profiles | Staff Portal` : "Country Profiles | Staff Portal",
    description: country ? `View all profiles for ${country.name}` : "View country profiles",
  }
}

export default function CountryProfilesPage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)
  const countryProfiles = mockProfiles.filter((profile) => profile.country === params.code)

  if (!country) {
    notFound()
  }

  const countrySubPages = [
    { name: "Overview", href: `/dashboard/countries/${params.code}` },
    { name: "Action Items", href: `/dashboard/countries/${params.code}/action-items` },
    { name: "Profiles", href: `/dashboard/countries/${params.code}/profiles` },
    { name: "Agreements", href: `/dashboard/countries/${params.code}/agreements` },
    { name: "Reports", href: `/dashboard/countries/${params.code}/reports` },
    { name: "Talking Points", href: `/dashboard/countries/${params.code}/talking-points` },
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
            <Link href={`/dashboard/countries/${params.code}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Link href="/dashboard/countries" className="hover:text-primary">Countries</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/dashboard/countries/${params.code}`} className="hover:text-primary">
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
        </div>

        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${params.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{country.name} Profiles</h1>
            <p className="mt-1 text-gray-600">All profiles for {country.name}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/dashboard/countries/${params.code}/profiles/new`}>
              <Plus className="mr-2 h-4 w-4" /> Add New Profile
            </Link>
          </Button>
        </div>

        {countryProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex p-4">
                    <div className="flex-shrink-0 mr-4">
                      {profile.imageUrl ? (
                        <div className="h-20 w-20 rounded-full overflow-hidden">
                          <img
                            src={profile.imageUrl}
                            alt={profile.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{profile.fullName}</h4>
                      <p className="text-sm text-muted-foreground">{profile.position}</p>
                      <Badge className="mt-1" variant={profile.type === "ambassador" ? "default" : "secondary"}>
                        {profile.type === "ambassador" ? "Ambassador" : "Non-Ambassador"}
                      </Badge>

                      {profile.education && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Education:</span> {profile.education}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t p-3 bg-muted/10 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/profiles/${profile.id}`}>
                        <User className="mr-2 h-4 w-4" /> View Full Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No profiles found</h3>
              <p className="mt-2 text-sm text-muted-foreground">No profiles have been added for {country.name} yet.</p>
              <Button className="mt-4" asChild>
                <Link href={`/dashboard/countries/${params.code}/profiles/new`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 