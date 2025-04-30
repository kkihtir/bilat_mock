import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockCountries } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditAgreementForm } from "@/components/agreements/edit-agreement-form"

interface Agreement {
  id: string
  name: string
  country: string
  type: string
  status: string
  startDate?: string
  endDate?: string
  description?: string
  latestUpdate: string
  updatedAt: string
  keyPoints?: string[]
  attachments?: Array<{
    url: string
    name: string
  }>
}

export const generateMetadata = ({ params }: { params: { code: string; id: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  const agreement = mockAgreements.find((a) => a.id === params.id) as Agreement
  return {
    title: agreement ? `Edit ${agreement.name} | ${country?.name} Agreements` : "Edit Agreement | Staff Portal",
    description: agreement ? `Edit details of ${agreement.name}` : "Edit agreement details",
  }
}

export default function EditAgreementPage({ params }: { params: { code: string; id: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)
  const agreement = mockAgreements.find((a) => a.id === params.id && a.country === params.code) as Agreement

  if (!country || !agreement) {
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
            <Link href={`/dashboard/countries/${params.code}/agreements/${params.id}`}>
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
                Agreements
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
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/dashboard/countries/${params.code}/agreements/${params.id}`} className="hover:text-primary">
            {agreement.name}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-transparent hover:text-primary">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {mockCountries.map((c) => (
                <DropdownMenuItem key={c.code} asChild>
                  <Link href={`/dashboard/countries/${c.code}/agreements/${params.id}/edit`} className="flex items-center">
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
          <span className="text-foreground">Edit</span>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${params.code.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">Edit Agreement</h1>
            <p className="mt-1 text-gray-600">Edit details for {agreement.name}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agreement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <EditAgreementForm 
              agreement={agreement}
              country={country}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 