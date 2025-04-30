"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCountries } from "@/lib/mock-data"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  User,
  List,
  LayoutGrid,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
}

interface ReportsListProps {
  reports?: Report[]
  onNewReport?: () => void
  onEditReport?: (id: string) => void
}

export default function ReportsList({ reports: propReports, onNewReport, onEditReport }: ReportsListProps = {}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")

  // Mock data for reports
  const [reports, setReports] = useState<Report[]>(
    propReports || [
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
      },
    ],
  )

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
    if (onNewReport) {
      onNewReport()
    } else {
      router.push("/dashboard/reports/create")
    }
  }

  const handleEditReport = (id: string) => {
    if (onEditReport) {
      onEditReport(id)
    } else {
      router.push(`/dashboard/reports/edit/${id}`)
    }
  }

  const filteredReports = reports.filter((report) => {
    // Filter by tab
    if (activeTab === "pending" && report.approvalStatus !== "pending") return false
    if (activeTab === "approved" && report.approvalStatus !== "approved") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        report.title.toLowerCase().includes(query) ||
        getCountryName(report.country).toLowerCase().includes(query) ||
        report.createdBy.name.toLowerCase().includes(query) ||
        report.approvedBy?.name.toLowerCase().includes(query) ||
        false
      )
    }

    return true
  })

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 inline-flex w-auto mx-auto">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 inline-flex w-auto mx-auto">Pending Approval</Badge>
      case "rejected":
        return <Badge className="bg-red-500 inline-flex w-auto mx-auto">Rejected</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex space-x-2">
          <div className="border rounded-md p-1 dark:border-gray-700">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="px-2"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleNewReport}>
            <Plus className="mr-2 h-4 w-4" /> New Report
          </Button>
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <Input
              placeholder="Search reports..."
              className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {viewMode === "card" ? (
        filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
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
                    {report.approvalStatus === "approved" && report.approvedBy && (
                      <div className="text-sm flex items-center dark:text-gray-200">
                        <span className="font-medium mr-1">Approved by:</span>{" "}
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> {report.approvedBy.name}
                      </div>
                    )}
                    {report.approvalStatus === "pending" && (
                      <div className="text-sm flex items-center dark:text-gray-200">
                        <span className="font-medium mr-1">Status:</span>{" "}
                        <Clock className="h-3 w-3 mr-1 text-yellow-500" /> Awaiting approval
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
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6 text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground dark:text-gray-400" />
              <h3 className="mt-4 text-lg font-medium dark:text-white">No reports found</h3>
              <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
                {searchQuery
                  ? "No reports match your search criteria."
                  : activeTab === "pending"
                    ? "No reports pending approval."
                    : activeTab === "approved"
                      ? "No approved reports."
                      : "Get started by creating a new report."}
              </p>
              <Button className="mt-4" onClick={handleNewReport}>
                <Plus className="mr-2 h-4 w-4" /> New Report
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="dark:text-gray-200">Title</TableHead>
                    <TableHead className="dark:text-gray-200">Country</TableHead>
                    <TableHead className="dark:text-gray-200">Type</TableHead>
                    <TableHead className="dark:text-gray-200">Date</TableHead>
                    <TableHead className="dark:text-gray-200">Status</TableHead>
                    <TableHead className="dark:text-gray-200">Created By</TableHead>
                    <TableHead className="dark:text-gray-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="font-medium dark:text-gray-200 dark:border-gray-700">
                          {report.title}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {renderCountryWithFlag(report.country)}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {report.type === "meeting" ? "Meeting" : "Informative"}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {report.date || "N/A"}
                        </TableCell>
                        <TableCell className="dark:border-gray-700 text-center">
                          {getApprovalBadge(report.approvalStatus)}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {report.createdBy.name}
                        </TableCell>
                        <TableCell className="dark:border-gray-700">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditReport(report.id)}
                              className="dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="dark:text-gray-300 dark:hover:bg-gray-700"
                            ></Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="dark:text-gray-300 dark:hover:bg-gray-700 text-destructive dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 dark:text-gray-300 dark:border-gray-700">
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
      )}
    </div>
  )
}

