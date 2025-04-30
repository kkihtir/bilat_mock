"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Download,
  Trash2,
  User,
  MoreVertical,
  Calendar,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react"
import { mockCountries } from "@/lib/mock-data"

interface Report {
  id: string
  title: string
  country: string
  date: string | null
  type: string
  createdAt: string
  createdBy: {
    id: string
    name: string
  }
  approvalStatus: "pending" | "approved" | "rejected"
  approvedBy?: {
    id: string
    name: string
  }
  description?: string
  tags?: string[]
}

export default function ReportsListView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")

  // Mock data for reports
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "US-Japan Trade Meeting",
      country: "jp",
      date: "2025-03-10",
      type: "meeting",
      createdAt: "2025-03-05",
      createdBy: {
        id: "user1",
        name: "John Smith",
      },
      approvalStatus: "approved",
      approvedBy: {
        id: "user2",
        name: "Sarah Johnson",
      },
      description: "Comprehensive report on trade negotiations between Japan and the United States",
      tags: ["Trade", "Bilateral", "Technology"],
    },
    {
      id: "2",
      title: "Germany Economic Overview",
      country: "de",
      date: null,
      type: "informative",
      createdAt: "2025-02-28",
      createdBy: {
        id: "user3",
        name: "Michael Brown",
      },
      approvalStatus: "pending",
      description: "Analysis of Germany's economic indicators and future outlook",
      tags: ["Economy", "Europe", "Manufacturing"],
    },
    {
      id: "3",
      title: "UK Diplomatic Relations",
      country: "gb",
      date: "2025-04-15",
      type: "meeting",
      createdAt: "2025-02-20",
      createdBy: {
        id: "user1",
        name: "John Smith",
      },
      approvalStatus: "approved",
      approvedBy: {
        id: "user4",
        name: "Emily Davis",
      },
      description: "Report on diplomatic relations with the United Kingdom",
      tags: ["Diplomacy", "Europe", "Post-Brexit"],
    },
    {
      id: "4",
      title: "China Trade Analysis",
      country: "cn",
      date: null,
      type: "informative",
      createdAt: "2025-03-12",
      createdBy: {
        id: "user3",
        name: "Michael Brown",
      },
      approvalStatus: "pending",
      description: "Comprehensive analysis of trade relations with China",
      tags: ["Trade", "Asia", "Manufacturing"],
    },
    {
      id: "5",
      title: "India Investment Opportunities",
      country: "in",
      date: "2025-05-20",
      type: "meeting",
      createdAt: "2025-03-15",
      createdBy: {
        id: "user2",
        name: "Sarah Johnson",
      },
      approvalStatus: "rejected",
      description: "Overview of investment opportunities in India's growing economy",
      tags: ["Investment", "Asia", "Technology"],
    },
    {
      id: "6",
      title: "Brazil Agricultural Cooperation",
      country: "br",
      date: "2025-04-10",
      type: "meeting",
      createdAt: "2025-03-18",
      createdBy: {
        id: "user5",
        name: "David Wilson",
      },
      approvalStatus: "approved",
      approvedBy: {
        id: "user2",
        name: "Sarah Johnson",
      },
      description: "Report on agricultural cooperation initiatives with Brazil",
      tags: ["Agriculture", "South America", "Trade"],
    },
    {
      id: "7",
      title: "France Cultural Exchange Program",
      country: "fr",
      date: "2025-06-15",
      type: "informative",
      createdAt: "2025-03-20",
      createdBy: {
        id: "user4",
        name: "Emily Davis",
      },
      approvalStatus: "pending",
      description: "Overview of cultural exchange programs with France",
      tags: ["Culture", "Europe", "Education"],
    },
    {
      id: "8",
      title: "Australia Energy Partnership",
      country: "au",
      date: null,
      type: "informative",
      createdAt: "2025-03-22",
      createdBy: {
        id: "user1",
        name: "John Smith",
      },
      approvalStatus: "approved",
      approvedBy: {
        id: "user3",
        name: "Michael Brown",
      },
      description: "Analysis of energy partnership opportunities with Australia",
      tags: ["Energy", "Oceania", "Renewable"],
    },
    {
      id: "9",
      title: "South Africa Mining Cooperation",
      country: "za",
      date: "2025-05-05",
      type: "meeting",
      createdAt: "2025-03-25",
      createdBy: {
        id: "user5",
        name: "David Wilson",
      },
      approvalStatus: "pending",
      description: "Report on mining cooperation initiatives with South Africa",
      tags: ["Mining", "Africa", "Resources"],
    },
    {
      id: "10",
      title: "Canada Technology Summit",
      country: "ca",
      date: "2025-04-25",
      type: "meeting",
      createdAt: "2025-03-28",
      createdBy: {
        id: "user2",
        name: "Sarah Johnson",
      },
      approvalStatus: "approved",
      approvedBy: {
        id: "user4",
        name: "Emily Davis",
      },
      description: "Summary of technology summit with Canadian partners",
      tags: ["Technology", "North America", "Innovation"],
    },
  ])

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  const renderCountryWithFlag = (code: string) => {
    return (
      <div className="flex items-center">
        <img
          src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
          alt={`${getCountryName(code)} flag`}
          className="h-4 w-6 mr-2 rounded-sm object-cover"
        />
        <span>{getCountryName(code)}</span>
      </div>
    )
  }

  const handleNewReport = () => {
    router.push("/dashboard/reports/create")
  }

  const handleEditReport = (id: string) => {
    router.push(`/dashboard/reports/edit/${id}`)
  }

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((report) => report.id !== id))
  }

  const filteredReports = reports.filter((report) => {
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        report.title.toLowerCase().includes(query) ||
        getCountryName(report.country).toLowerCase().includes(query) ||
        report.createdBy.name.toLowerCase().includes(query) ||
        report.approvedBy?.name.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        false

      if (!matchesSearch) return false
    }

    // Apply country filter
    if (countryFilter && countryFilter !== "all" && report.country !== countryFilter) {
      return false
    }

    // Apply type filter
    if (typeFilter && typeFilter !== "all" && report.type !== typeFilter) {
      return false
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all" && report.approvalStatus !== statusFilter) {
      return false
    }

    return true
  })

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 dark:bg-green-600 inline-flex w-auto">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 dark:bg-yellow-600 inline-flex w-auto">Pending Approval</Badge>
      case "rejected":
        return <Badge className="bg-red-500 dark:bg-red-600 inline-flex w-auto">Rejected</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                className="md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="border rounded-md p-1 dark:border-gray-700">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-2"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                  className="px-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleNewReport} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> New Report
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Country</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all">All Countries</SelectItem>
                    {mockCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <img
                            src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                            alt={country.name}
                            className="h-4 w-6 mr-2 rounded-sm object-cover"
                          />
                          {country.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {viewMode === "list" ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-700">
                  <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableHead className="w-[180px] dark:text-gray-200">Country</TableHead>
                    <TableHead className="min-w-[300px] dark:text-gray-200">Title</TableHead>
                    <TableHead className="w-[120px] dark:text-gray-200">Type</TableHead>
                    <TableHead className="w-[120px] dark:text-gray-200">Date</TableHead>
                    <TableHead className="w-[120px] dark:text-gray-200">Status</TableHead>
                    <TableHead className="w-[150px] dark:text-gray-200">Created By</TableHead>
                    <TableHead className="w-[120px] dark:text-gray-200">Created At</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow
                        key={report.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {renderCountryWithFlag(report.country)}
                        </TableCell>
                        <TableCell className="font-medium dark:text-gray-200 dark:border-gray-700">
                          <div>
                            <div>{report.title}</div>
                            {report.description && (
                              <div className="text-sm text-muted-foreground dark:text-gray-400 truncate max-w-md">
                                {report.description}
                              </div>
                            )}
                            {report.tags && report.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs flex justify-center items-center dark:border-gray-600 dark:text-gray-300"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <Badge
                            variant="outline"
                            className="flex justify-center items-center dark:border-gray-600 dark:text-gray-300"
                          >
                            {report.type === "meeting" ? "Meeting" : "Informative"}
                          </Badge>
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {report.date ? (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground dark:text-gray-400" />
                              {report.date}
                            </div>
                          ) : (
                            <span className="text-muted-foreground dark:text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="dark:border-gray-700 text-center">
                          {getApprovalBadge(report.approvalStatus)}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1 text-muted-foreground dark:text-gray-400" />
                            {report.createdBy.name}
                          </div>
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">{report.createdAt}</TableCell>
                        <TableCell className="dark:border-gray-700">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                              <DropdownMenuItem
                                onClick={() => handleEditReport(report.id)}
                                className="dark:text-gray-200 dark:hover:bg-gray-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-700">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive dark:text-red-400 dark:hover:bg-gray-700"
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 dark:text-gray-300 dark:border-gray-700">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground dark:text-gray-400 mb-2" />
                          <p className="text-muted-foreground dark:text-gray-400">No reports found</p>
                          <Button className="mt-4" onClick={handleNewReport}>
                            <Plus className="mr-2 h-4 w-4" /> Create New Report
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
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
                    <div className="text-sm dark:text-gray-200">
                      <span className="font-medium">Country:</span> {renderCountryWithFlag(report.country)}
                    </div>
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
                    {report.description && (
                      <div className="text-sm dark:text-gray-300 mt-2">
                        <p className="line-clamp-2">{report.description}</p>
                      </div>
                    )}
                    {report.tags && report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {report.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs flex justify-center items-center dark:border-gray-600 dark:text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReport(report.id)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <Edit className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <Download className="mr-1 h-3 w-3" /> Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive dark:bg-gray-700 dark:border-gray-600 dark:text-red-400"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6 text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground dark:text-gray-400" />
                <h3 className="mt-4 text-lg font-medium dark:text-white">No reports found</h3>
                <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
                  {searchQuery ? "No reports match your search criteria." : "Get started by creating a new report."}
                </p>
                <Button className="mt-4" onClick={handleNewReport}>
                  <Plus className="mr-2 h-4 w-4" /> New Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

