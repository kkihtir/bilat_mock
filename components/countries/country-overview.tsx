"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  User,
  FileText,
  FileSignature,
  CheckSquare,
  Globe,
  BarChart2,
  Calendar,
  Edit,
  Download,
  Plus,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  History,
  ChevronDown,
} from "lucide-react"
import { mockCountries, mockProfiles } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"
import { mockActionItems } from "@/lib/mock-action-items"
import { mockReports } from "@/lib/mock-reports"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CountryOverviewProps {
  countryCode: string
}

export default function CountryOverview({ countryCode }: CountryOverviewProps) {
  // Get country details
  const country = mockCountries.find((c) => c.code === countryCode)

  // Filter data for this country
  const countryProfiles = mockProfiles.filter((profile) => profile.country === countryCode)
  const countryAgreements = mockAgreements.filter((agreement) => agreement.country === countryCode)
  const countryActionItems = mockActionItems.filter((item) => item.country === countryCode)
  const countryReports = mockReports.filter((report) => report.country === countryCode)

  // Calculate statistics
  const completedActionItems = countryActionItems.filter((item) => item.status === "done").length
  const inProgressActionItems = countryActionItems.filter((item) => item.status === "in_progress").length
  const notStartedActionItems = countryActionItems.filter((item) => item.status === "not_started").length

  const completionPercentage =
    countryActionItems.length > 0 ? Math.round((completedActionItems / countryActionItems.length) * 100) : 0

  const activeAgreements = countryAgreements.filter(
    (agreement) => agreement.status === "in_progress" || agreement.status === "planned",
  ).length

  const approvedReports = countryReports.filter((report) => report.approvalStatus === "approved").length

  if (!country) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-10">
          <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Country not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">The requested country could not be found.</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/countries">Back to Countries</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

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

  // Get status badge for action items
  const getActionStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return (
          <Badge variant="outline" className="bg-gray-100 flex justify-center items-center">
            Not Started
          </Badge>
        )
      case "in_progress":
        return <Badge className="bg-blue-500 flex justify-center items-center">In Progress</Badge>
      case "done":
        return <Badge className="bg-green-500 flex justify-center items-center">Done</Badge>
      default:
        return null
    }
  }

  // Get theme badge for action items
  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case "Trade":
        return <Badge className="bg-blue-500 flex justify-center items-center">{theme}</Badge>
      case "Investment":
        return <Badge className="bg-green-500 flex justify-center items-center">{theme}</Badge>
      case "Human Capital":
        return <Badge className="bg-purple-500 flex justify-center items-center">{theme}</Badge>
      case "Knowledge Sharing":
        return <Badge className="bg-amber-500 flex justify-center items-center">{theme}</Badge>
      default:
        return <Badge className="bg-gray-500 flex justify-center items-center">{theme}</Badge>
    }
  }

  // Get approval badge for reports
  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 flex justify-center items-center">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 flex justify-center items-center">Pending Approval</Badge>
      case "rejected":
        return <Badge className="bg-red-500 flex justify-center items-center">Rejected</Badge>
      default:
        return null
    }
  }

  // Get status icon for agreements
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "planned":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <History className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 mr-2" 
          asChild
        >
          <Link href="/dashboard/countries">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Link href="/dashboard/countries" className="hover:text-primary">Countries</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/dashboard/countries/${countryCode}`} className="hover:text-primary">
          {country.name}
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
                <Link href={`/dashboard/countries/${c.code}`} className="flex items-center">
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-16 w-24 rounded-sm object-cover shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold">{country.name}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Globe className="h-4 w-4 mr-1" />
              <span>{country.region}</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{country.capital}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/countries/${countryCode}/action-items`}>
              <BarChart2 className="mr-2 h-4 w-4" /> Action Items Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/reports/create">
              <FileText className="mr-2 h-4 w-4" /> Create New Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <User className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{countryProfiles.length}</div>
              <p className="text-sm text-muted-foreground">Profiles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <FileSignature className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{countryAgreements.length}</div>
              <p className="text-sm text-muted-foreground">Agreements</p>
              {activeAgreements > 0 && <Badge className="mt-1 bg-blue-500">{activeAgreements} Active</Badge>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <CheckSquare className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{countryActionItems.length}</div>
              <p className="text-sm text-muted-foreground">Action Items</p>
              <div className="w-full mt-2">
                <Progress value={completionPercentage} className="h-2" />
                <div className="flex justify-between text-xs mt-1">
                  <span>{completionPercentage}% Complete</span>
                  <span>
                    {completedActionItems}/{countryActionItems.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-3xl font-bold">{countryReports.length}</div>
              <p className="text-sm text-muted-foreground">Reports</p>
              {approvedReports > 0 && <Badge className="mt-1 bg-green-500">{approvedReports} Approved</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <User className="mr-2 h-5 w-5" /> Profiles
          </h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/countries/${countryCode}/profiles`}>
                <User className="mr-2 h-4 w-4" /> View All Profiles
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/countries/${countryCode}/profiles/new`}>
                <Plus className="mr-2 h-4 w-4" /> Add Profile
              </Link>
            </Button>
          </div>
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
                <Link href={`/dashboard/countries/${countryCode}/profiles`}>
                  <Plus className="mr-2 h-4 w-4" /> Add Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {countryProfiles.length > 3 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/countries/${countryCode}/profiles`}>
                View All Profiles <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Bilateral Agreements Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FileSignature className="mr-2 h-5 w-5" /> Bilateral Agreements
          </h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/countries/${countryCode}/agreements`}>
                <FileSignature className="mr-2 h-4 w-4" /> View All Agreements
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/countries/${countryCode}/agreements/new`}>
                <Plus className="mr-2 h-4 w-4" /> Add Agreement
              </Link>
            </Button>
          </div>
        </div>

        {countryAgreements.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countryAgreements.slice(0, 4).map((agreement) => (
                <Card key={agreement.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg flex items-center">
                        {getStatusIcon(agreement.status)}
                        <span className="ml-2">{agreement.name}</span>
                      </CardTitle>
                      {getStatusBadge(agreement.status)}
                    </div>
                    <CardDescription>
                      {agreement.type && (
                        <Badge variant="outline" className="mr-2">
                          {agreement.type}
                        </Badge>
                      )}
                      {agreement.startDate && <span className="text-sm">Start: {agreement.startDate}</span>}
                      {agreement.startDate && agreement.endDate && <span className="mx-1">•</span>}
                      {agreement.endDate && <span className="text-sm">End: {agreement.endDate}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-medium">Latest Update</h4>
                        <p className="text-sm mt-1">{agreement.latestUpdate}</p>
                        <div className="text-xs text-muted-foreground mt-1">Updated on {agreement.updatedAt}</div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/dashboard/agreements">
                            <FileSignature className="mr-2 h-4 w-4" /> Manage
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {countryAgreements.length > 4 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/agreements">
                    View All Agreements <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <FileSignature className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No agreements found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No bilateral agreements have been added for {country.name} yet.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/agreements">
                  <Plus className="mr-2 h-4 w-4" /> Add Agreement
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Action Items Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <CheckSquare className="mr-2 h-5 w-5" /> Action Items
          </h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/countries/${countryCode}/action-items`}>
                <CheckSquare className="mr-2 h-4 w-4" /> View All Action Items
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/countries/${countryCode}/action-items/new`}>
                <Plus className="mr-2 h-4 w-4" /> Add Action Item
              </Link>
            </Button>
          </div>
        </div>

        {countryActionItems.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action Item</TableHead>
                        <TableHead>Theme</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countryActionItems.slice(0, 5).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.actionItem}</TableCell>
                          <TableCell>{getThemeBadge(item.theme)}</TableCell>
                          <TableCell>{getActionStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Action Items Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Completed</span>
                      </div>
                      <span className="font-medium">{completedActionItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>In Progress</span>
                      </div>
                      <span className="font-medium">{inProgressActionItems}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                        <span>Not Started</span>
                      </div>
                      <span className="font-medium">{notStartedActionItems}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">{countryActionItems.length}</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm mb-1">Completion Rate: {completionPercentage}%</div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {countryActionItems.length > 5 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/action-items">
                    View All Action Items <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No action items found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No action items have been added for {country.name} yet.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/action-items">
                  <Plus className="mr-2 h-4 w-4" /> Add Action Item
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Reports Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Reports
          </h2>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/countries/${countryCode}/reports`}>
                <FileText className="mr-2 h-4 w-4" /> View All Reports
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/countries/${countryCode}/reports/create`}>
                <Plus className="mr-2 h-4 w-4" /> Create New Report
              </Link>
            </Button>
          </div>
        </div>

        {countryReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryReports.slice(0, 6).map((report) => (
              <Card
                key={report.id}
                className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center dark:text-white text-base">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      {report.title}
                    </CardTitle>
                    {getApprovalBadge(report.approvalStatus)}
                  </div>
                  <CardDescription>
                    {report.date && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.date}
                      </div>
                    )}
                    <div className="flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {report.createdBy.name}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {report.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                    )}
                    {report.tags && report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {report.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs flex justify-center items-center">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <Link href={`/dashboard/reports/edit/${report.id}`}>
                          <Edit className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No reports found</h3>
              <p className="mt-2 text-sm text-muted-foreground">No reports have been created for {country.name} yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/reports/create">
                  <Plus className="mr-2 h-4 w-4" /> Create New Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {countryReports.length > 6 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/reports">
                View All Reports <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

