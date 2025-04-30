import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CountryTalkingPoints from "@/components/talking-points/country-talking-points"
import { mockCountries } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `${country.name} Talking Points | Staff Portal` : "Country Talking Points | Staff Portal",
    description: country ? `Talking points for ${country.name}` : "Country talking points",
  }
}

export default function CountryTalkingPointsPage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)

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
                Talking Points
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
                  <Link href={`/dashboard/countries/${c.code}/talking-points`} className="flex items-center">
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

        <CountryTalkingPoints countryCode={params.code} countryName={country.name} />
      </div>
    </DashboardLayout>
  )
}

