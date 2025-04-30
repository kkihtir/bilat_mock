import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockCountries } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown, FileSignature, Calendar, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Attachment {
  url: string
  name: string
}

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
  attachments?: Attachment[]
}

export const generateMetadata = ({ params }: { params: { code: string; id: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  const agreement = mockAgreements.find((a) => a.id === params.id) as Agreement
  return {
    title: agreement ? `${agreement.name} | ${country?.name} Agreements` : "Agreement Details | Staff Portal",
    description: agreement ? `View details of ${agreement.name}` : "View agreement details",
  }
}

export default function AgreementDetailsPage({ params }: { params: { code: string; id: string } }) {
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

  // Get status badge for agreements
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "planned":
        return <Badge className="bg-amber-500">Planned</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "expired":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Expired
          </Badge>
        )
      default:
        return null
    }
  }

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
            <Link href={`/dashboard/countries/${params.code}/agreements`}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-transparent hover:text-primary">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {mockCountries.map((c) => (
                <DropdownMenuItem key={c.code} asChild>
                  <Link href={`/dashboard/countries/${c.code}/agreements/${params.id}`} className="flex items-center">
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
          <span className="text-foreground">{agreement.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://flagcdn.com/${params.code.toLowerCase()}.svg`}
              alt={`${country.name} flag`}
              className="h-8 w-12 rounded-sm object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{agreement.name}</h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <FileSignature className="h-4 w-4 mr-1" />
                <span>{agreement.type}</span>
                <span className="mx-2">•</span>
                {getStatusBadge(agreement.status)}
              </div>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/countries/${params.code}/agreements/${agreement.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Agreement
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agreement Details</CardTitle>
            <CardDescription>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {agreement.startDate} - {agreement.endDate}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Latest Update</h3>
              <p className="text-sm text-muted-foreground">{agreement.latestUpdate}</p>
              <p className="text-xs text-muted-foreground mt-1">Updated on {agreement.updatedAt}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{agreement.description || "No description provided."}</p>
            </div>

            {agreement.keyPoints && agreement.keyPoints.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {agreement.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">{point}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {agreement.attachments && agreement.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {agreement.attachments.map((attachment: Attachment, index: number) => (
                      <Button key={index} variant="outline" className="w-full justify-start" asChild>
                        <Link href={attachment.url}>
                          <FileSignature className="mr-2 h-4 w-4" />
                          {attachment.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 