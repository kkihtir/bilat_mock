"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, BarChart3, PieChart } from "lucide-react"
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { mockCountries } from "@/lib/mock-data"

// Mock data for action items - this would come from your actual data source
const mockActionItems = [
  {
    id: "1",
    country: "us",
    profile: "Trade Mission",
    date: "2024-02-15",
    source: "Bilateral Meeting",
    theme: "Trade",
    industry: "Technology",
    actionItem: "Establish joint working group on technology standards",
    updates: "Initial contacts made with US Trade Representative",
    entities: "Ministry of Commerce",
    entitiesOther: "US Department of Commerce",
    status: "in_progress",
    owner: "John Smith",
    dueDate: "2024-06-30",
  },
  {
    id: "2",
    country: "jp",
    profile: "Investment Forum",
    date: "2024-01-20",
    source: "Conference",
    theme: "Investment",
    industry: "Manufacturing",
    actionItem: "Facilitate investment in automotive manufacturing",
    updates: "",
    entities: "Investment Authority",
    entitiesOther: "Japan External Trade Organization",
    status: "not_started",
    owner: "Sarah Johnson",
    dueDate: "2024-07-15",
  },
  {
    id: "3",
    country: "gb",
    profile: "Education Summit",
    date: "2024-03-05",
    source: "Summit",
    theme: "Human Capital",
    industry: "Education",
    actionItem: "Establish student exchange program with UK universities",
    updates: "MOU drafted and under review",
    entities: "Ministry of Education",
    entitiesOther: "British Council",
    status: "in_progress",
    owner: "Michael Brown",
    dueDate: "2024-05-30",
  },
  {
    id: "4",
    country: "de",
    profile: "Technology Conference",
    date: "2024-02-28",
    source: "Conference",
    theme: "Knowledge Sharing",
    industry: "Renewable Energy",
    actionItem: "Collaborate on renewable energy research projects",
    updates: "Initial research proposal completed",
    entities: "Research Institute",
    entitiesOther: "German Energy Agency",
    status: "done",
    dueDate: "2024-04-15",
    owner: "Emily Davis",
  },
  {
    id: "5",
    country: "us",
    profile: "Trade Delegation",
    date: "2024-01-10",
    source: "Delegation Visit",
    theme: "Trade",
    industry: "Agriculture",
    actionItem: "Increase agricultural exports to China",
    updates: "",
    entities: "Ministry of Agriculture",
    entitiesOther: "China Chamber of Commerce",
    status: "not_started",
    dueDate: "2024-08-01",
    owner: "Robert Wilson",
  },
  {
    id: "6",
    country: "fr",
    profile: "Cultural Exchange",
    date: "2024-03-12",
    source: "Bilateral Meeting",
    theme: "Other",
    industry: "Tourism",
    actionItem: "Develop joint tourism promotion campaign",
    updates: "Campaign concept approved",
    entities: "Tourism Board",
    entitiesOther: "Atout France",
    status: "in_progress",
    dueDate: "2024-06-15",
    owner: "Jennifer Lee",
  },
  {
    id: "7",
    country: "us",
    profile: "Tech Summit",
    date: "2024-02-05",
    source: "Summit",
    theme: "Investment",
    industry: "Technology",
    actionItem: "Attract IT companies to establish local offices",
    updates: "Three companies expressed interest",
    entities: "Investment Authority",
    entitiesOther: "NASSCOM",
    status: "in_progress",
    dueDate: "2024-07-30",
    owner: "David Chen",
  },
  {
    id: "8",
    country: "us",
    profile: "Trade Mission",
    date: "2024-01-25",
    source: "Trade Mission",
    theme: "Trade",
    industry: "Manufacturing",
    actionItem: "Reduce tariffs on manufactured goods",
    updates: "Negotiations ongoing",
    entities: "Ministry of Commerce",
    entitiesOther: "Brazilian Ministry of Economy",
    status: "in_progress",
    dueDate: "2024-09-15",
    owner: "Maria Rodriguez",
  },
  {
    id: "9",
    country: "au",
    profile: "Education Forum",
    date: "2024-03-18",
    source: "Forum",
    theme: "Human Capital",
    industry: "Education",
    actionItem: "Develop joint research initiatives with Australian universities",
    updates: "",
    entities: "Ministry of Education",
    entitiesOther: "Universities Australia",
    status: "not_started",
    dueDate: "2024-08-30",
    owner: "James Wilson",
  },
  {
    id: "10",
    country: "us",
    profile: "Investment Conference",
    date: "2024-02-10",
    source: "Conference",
    theme: "Investment",
    industry: "Energy",
    actionItem: "Secure investment in energy infrastructure",
    updates: "Initial proposal presented",
    entities: "Energy Ministry",
    entitiesOther: "Invest in Canada",
    status: "done",
    dueDate: "2024-03-30",
    owner: "Lisa Thompson",
  },
  {
    id: "11",
    country: "us",
    profile: "Research Collaboration",
    date: "2024-03-22",
    source: "Conference",
    theme: "Knowledge Sharing",
    industry: "Healthcare",
    actionItem: "Establish joint research program on medical technologies",
    updates: "Initial discussions completed",
    entities: "Health Ministry",
    entitiesOther: "US Health Department",
    status: "not_started",
    dueDate: "2024-07-15",
    owner: "Thomas Johnson",
  },
  {
    id: "12",
    country: "us",
    profile: "Education Exchange",
    date: "2024-02-18",
    source: "Bilateral Meeting",
    theme: "Human Capital",
    industry: "Education",
    actionItem: "Create scholarship program for student exchanges",
    updates: "Framework document drafted",
    entities: "Education Ministry",
    entitiesOther: "US Department of Education",
    status: "in_progress",
    dueDate: "2024-06-30",
    owner: "Amanda Williams",
  },
]

// Define colors for status and themes
const STATUS_COLORS = {
  not_started: "#CBD5E1", // gray
  in_progress: "#3B82F6", // blue
  done: "#22C55E", // green
}

const THEME_COLORS = {
  Trade: "#3B82F6", // blue
  Investment: "#22C55E", // green
  "Human Capital": "#A855F7", // purple
  "Knowledge Sharing": "#F59E0B", // amber
  Other: "#6B7280", // gray
}

interface CountrySummaryProps {
  countryCode: string
}

export default function CountrySummary({ countryCode }: CountrySummaryProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")

  // Filter action items for this country
  const countryActionItems = useMemo(() => {
    return mockActionItems.filter((item) => item.country === countryCode)
  }, [countryCode])

  // Get country name
  const countryName = useMemo(() => {
    const country = mockCountries.find((c) => c.code === countryCode)
    return country ? country.name : countryCode
  }, [countryCode])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      not_started: 0,
      in_progress: 0,
      done: 0,
    }

    countryActionItems.forEach((item) => {
      counts[item.status as keyof typeof counts]++
    })

    return [
      { name: "Not Started", value: counts.not_started, color: STATUS_COLORS.not_started },
      { name: "In Progress", value: counts.in_progress, color: STATUS_COLORS.in_progress },
      { name: "Done", value: counts.done, color: STATUS_COLORS.done },
    ]
  }, [countryActionItems])

  // Calculate theme breakdown
  const themeBreakdown = useMemo(() => {
    const themes = new Set(countryActionItems.map((item) => item.theme))
    const result: any[] = []

    themes.forEach((theme) => {
      const themeItems = countryActionItems.filter((item) => item.theme === theme)
      const notStarted = themeItems.filter((item) => item.status === "not_started").length
      const inProgress = themeItems.filter((item) => item.status === "in_progress").length
      const done = themeItems.filter((item) => item.status === "done").length

      result.push({
        theme,
        "Not Started": notStarted,
        "In Progress": inProgress,
        Done: done,
        total: themeItems.length,
      })
    })

    // Sort by total count descending
    return result.sort((a, b) => b.total - a.total)
  }, [countryActionItems])

  // Group action items by theme
  const actionItemsByTheme = useMemo(() => {
    const grouped: Record<string, typeof countryActionItems> = {}

    countryActionItems.forEach((item) => {
      if (!grouped[item.theme]) {
        grouped[item.theme] = []
      }
      grouped[item.theme].push(item)
    })

    return grouped
  }, [countryActionItems])

  // Get status badge
  const getStatusBadge = (status: string) => {
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

  // Get theme badge
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

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (countryActionItems.length === 0) return 0
    const doneCount = countryActionItems.filter((item) => item.status === "done").length
    return Math.round((doneCount / countryActionItems.length) * 100)
  }, [countryActionItems])

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <div className="border rounded-md p-1">
          <Button
            variant={chartType === "pie" ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType("pie")}
            className="px-2"
          >
            <PieChart className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType("bar")}
            className="px-2"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{countryActionItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Started</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold">{statusCounts[0].value}</div>
            <div className="ml-2 text-sm text-muted-foreground">
              ({Math.round((statusCounts[0].value / countryActionItems.length) * 100) || 0}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold">{statusCounts[1].value}</div>
            <div className="ml-2 text-sm text-muted-foreground">
              ({Math.round((statusCounts[1].value / countryActionItems.length) * 100) || 0}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-3xl font-bold">{statusCounts[2].value}</div>
            <div className="ml-2 text-sm text-muted-foreground">({completionPercentage}%)</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Count">
                      {statusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Theme Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="theme" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Not Started" stackId="a" fill={STATUS_COLORS.not_started} />
                  <Bar dataKey="In Progress" stackId="a" fill={STATUS_COLORS.in_progress} />
                  <Bar dataKey="Done" stackId="a" fill={STATUS_COLORS.done} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items by Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items by Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(actionItemsByTheme)[0] || "none"}>
            <TabsList className="mb-4 flex-wrap">
              {Object.keys(actionItemsByTheme).map((theme) => (
                <TabsTrigger key={theme} value={theme}>
                  {theme} ({actionItemsByTheme[theme].length})
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(actionItemsByTheme).map((theme) => (
              <TabsContent key={theme} value={theme}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action Item</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionItemsByTheme[theme].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.actionItem}</TableCell>
                          <TableCell>{item.industry}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.owner}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}

            {Object.keys(actionItemsByTheme).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No action items found for this country</div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

