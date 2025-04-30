import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { mockCountries } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, ChevronDown, FileSignature, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const generateMetadata = ({ params }: { params: { code: string } }): Metadata => {
  const country = mockCountries.find((c) => c.code === params.code)
  return {
    title: country ? `${country.name} Agreements | Staff Portal` : "Country Agreements | Staff Portal",
    description: country ? `View all agreements for ${country.name}` : "View country agreements",
  }
}

export default function CountryAgreementsPage({ params }: { params: { code: string } }) {
  const country = mockCountries.find((c) => c.code === params.code)
  const countryAgreements = mockAgreements.filter((agreement) => agreement.country === params.code)

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
                  <Link href={`/dashboard/countries/${c.code}/agreements`} className="flex items-center">
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
            <h1 className="text-3xl font-bold">{country.name} Agreements</h1>
            <p className="mt-1 text-gray-600">All agreements for {country.name}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/dashboard/countries/${params.code}/agreements/new`}>
              <Plus className="mr-2 h-4 w-4" /> Add New Agreement
            </Link>
          </Button>
        </div>

        {countryAgreements.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Bilateral Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countryAgreements.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">{agreement.name}</TableCell>
                      <TableCell>{agreement.type}</TableCell>
                      <TableCell>
                        <Badge variant={agreement.status === "active" ? "default" : "secondary"}>
                          {agreement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{agreement.startDate}</TableCell>
                      <TableCell>{agreement.endDate}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/countries/${params.code}/agreements/${agreement.id}`}>
                            <FileSignature className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <FileSignature className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No agreements found</h3>
              <p className="mt-2 text-sm text-muted-foreground">No agreements have been added for {country.name} yet.</p>
              <Button className="mt-4" asChild>
                <Link href={`/dashboard/countries/${params.code}/agreements/new`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Agreement
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 