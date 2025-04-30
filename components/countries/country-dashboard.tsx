"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  User,
  FileText,
  FileSignature,
  CheckSquare,
  Globe,
  BarChart2,
  ExternalLink,
  Edit,
  Download,
  Plus,
  MessageSquare,
} from "lucide-react"
import { mockCountries, mockProfiles } from "@/lib/mock-data"

// Import the mock data from other components
// These would typically be imported from a central data store or fetched from an API
import { mockAgreements } from "@/lib/mock-agreements"
import { mockActionItems } from "@/lib/mock-action-items"
import { mockReports } from "@/lib/mock-reports"
import CountryTalkingPoints from "@/components/talking-points/country-talking-points"

interface CountryDashboardProps {
  countryCode: string
}

export default function CountryDashboard({ countryCode }: CountryDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Get country details
  const country = mockCountries.find((c) => c.code === countryCode)

  // Filter data for this country
  const countryProfiles = mockProfiles.filter((profile) => profile.country === countryCode)
  const countryAgreements = mockAgreements.filter((agreement) => agreement.country === countryCode)
  const countryActionItems = mockActionItems.filter((item) => item.country === countryCode)
  const countryReports = mockReports.filter((report) => report.country === countryCode)

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
            alt={`${country.name} flag`}
            className="h-8 w-12 rounded-sm object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{country.name}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Comprehensive country information</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/countries">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="action-items">Action Items</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="talking-points">
            <MessageSquare className="h-4 w-4 mr-2" />
            Talking Points
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Country Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Region:</span>{" "}
                    <span className="text-sm">{country.region}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Capital:</span>{" "}
                    <span className="text-sm">{country.capital}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold">{countryProfiles.length}</div>
                    <div className="text-sm text-muted-foreground">Profiles</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold">{countryAgreements.length}</div>
                    <div className="text-sm text-muted-foreground">Agreements</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold">{countryActionItems.length}</div>
                    <div className="text-sm text-muted-foreground">Action Items</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-md">
                    <div className="text-2xl font-bold">{countryReports.length}</div>
                    <div className="text-sm text-muted-foreground">Reports</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/dashboard/action-items/country/${countryCode}`}>
                      <BarChart2 className="mr-2 h-4 w-4" />
                      View Action Items Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/reports/create">
                      <FileText className="mr-2 h-4 w-4" />
                      Create New Report
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard/news">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Latest News
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Agreements</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="#agreements" onClick={() => setActiveTab("agreements")}>
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {countryAgreements.length > 0 ? (
                  <div className="space-y-4">
                    {countryAgreements.slice(0, 3).map((agreement) => (
                      <div key={agreement.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{agreement.name}</div>
                          <div className="text-sm text-muted-foreground">Updated: {agreement.updatedAt}</div>
                        </div>
                        <div>{getStatusBadge(agreement.status)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No agreements found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Action Items</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="#action-items" onClick={() => setActiveTab("action-items")}>
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {countryActionItems.length > 0 ? (
                  <div className="space-y-4">
                    {countryActionItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{item.actionItem}</div>
                          <div className="text-sm text-muted-foreground">Due: {item.dueDate}</div>
                        </div>
                        <div>{getActionStatusBadge(item.status)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No action items found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profiles Tab */}
        <TabsContent value="profiles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Country Profiles</h2>
            <Button asChild>
              <Link href="/dashboard/countries">
                <Plus className="mr-2 h-4 w-4" /> Add Profile
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
                              src={profile.imageUrl || "/placeholder.svg"}
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
                        <Link href={`/dashboard/countries?profile=${profile.id}`}>
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
                <p className="mt-2 text-sm text-muted-foreground">
                  No profiles have been added for {country.name} yet.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/countries">
                    <Plus className="mr-2 h-4 w-4" /> Add Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Agreements Tab */}
        <TabsContent value="agreements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bilateral Agreements</h2>
            <Button asChild>
              <Link href="/dashboard/agreements">
                <Plus className="mr-2 h-4 w-4" /> Add Agreement
              </Link>
            </Button>
          </div>

          {countryAgreements.length > 0 ? (
            <div className="space-y-6">
              {countryAgreements.map((agreement) => (
                <Card
                  key={agreement.id}
                  className="overflow-hidden hover:shadow-md transition-shadow dark:hover:bg-gray-800/70"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">{agreement.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(agreement.status)}
                            {agreement.type && <Badge variant="outline">{agreement.type}</Badge>}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {agreement.startDate && <div>Start: {agreement.startDate}</div>}
                          {agreement.endDate && <div>End: {agreement.endDate}</div>}
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Latest Update</h4>
                          <span className="text-xs text-muted-foreground">Updated on {agreement.updatedAt}</span>
                        </div>
                        <p className="p-3 bg-muted/30 rounded-md">{agreement.latestUpdate}</p>
                      </div>

                      {agreement.updates && agreement.updates.length > 1 && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Previous Updates</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {agreement.updates.slice(1).map((update) => (
                              <div key={update.id} className="p-2 bg-muted/20 rounded-md">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm">{update.text}</p>
                                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                    {update.date}
                                  </div>
                                </div>
                                {update.author && (
                                  <p className="text-xs text-muted-foreground mt-1">by {update.author}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-3 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/dashboard/agreements">
                            <FileSignature className="mr-2 h-4 w-4" /> Manage Agreement
                          </Link>
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
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="action-items" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Action Items</h2>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/action-items/country/${countryCode}`}>
                  <BarChart2 className="mr-2 h-4 w-4" /> View Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/action-items">
                  <Plus className="mr-2 h-4 w-4" /> Add Action Item
                </Link>
              </Button>
            </div>
          </div>

          {countryActionItems.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action Item</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countryActionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.actionItem}</TableCell>
                        <TableCell>{getThemeBadge(item.theme)}</TableCell>
                        <TableCell>{item.industry}</TableCell>
                        <TableCell>{getActionStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.owner}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reports</h2>
            <Button asChild>
              <Link href="/dashboard/reports/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Report
              </Link>
            </Button>
          </div>

          {countryReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countryReports.map((report) => (
                <Card
                  key={report.id}
                  className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-lg"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center dark:text-white">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        {report.title}
                      </CardTitle>
                      {getApprovalBadge(report.approvalStatus)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {report.date && (
                        <div className="text-sm dark:text-gray-200">
                          <span className="font-medium">Date:</span> {report.date}
                        </div>
                      )}
                      <div className="text-sm dark:text-gray-200">
                        <span className="font-medium">Type:</span>{" "}
                        {report.type === "meeting" ? "Meeting Report" : "Informative Report"}
                      </div>
                      <div className="text-sm flex items-center dark:text-gray-200">
                        <span className="font-medium mr-1">Created by:</span> <User className="h-3 w-3 mr-1" />{" "}
                        {report.createdBy.name}
                      </div>
                      <div className="text-sm dark:text-gray-200">
                        <span className="font-medium">Created:</span> {report.createdAt}
                      </div>
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
                <p className="mt-2 text-sm text-muted-foreground">
                  No reports have been created for {country.name} yet.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/reports/create">
                    <Plus className="mr-2 h-4 w-4" /> Create New Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="talking-points" className="mt-6">
          <CountryTalkingPoints countryCode={country.code} countryName={country.name} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

