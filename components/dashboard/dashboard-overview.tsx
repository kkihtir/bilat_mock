import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Globe, Database, CheckSquare, FileSignature, User } from "lucide-react"

export default function DashboardOverview() {
  const sections = [
    {
      title: "Report Generation",
      description: "Create reports for VIPs about upcoming meetings or informative briefings",
      icon: <FileText className="h-12 w-12 text-primary" />,
      href: "/dashboard/reports",
      stats: "12 reports this month",
      trend: "+24% from last month",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Country Profiles",
      description: "Manage country data and individual profiles for VIP meetings",
      icon: <User className="h-12 w-12 text-primary" />,
      href: "/dashboard/countries",
      stats: "42 active profiles",
      trend: "+8 new profiles",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Countries",
      description: "Browse and view comprehensive country information and statistics",
      icon: <Globe className="h-12 w-12 text-primary" />,
      href: "/dashboard/countries/selector",
      stats: "195 countries",
      trend: "Global coverage",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Data Sources",
      description: "Manage and upload data sources for reports and country profiles",
      icon: <Database className="h-12 w-12 text-primary" />,
      href: "/dashboard/data-sources",
      stats: "24 sources",
      trend: "Updated daily",
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Action Items",
      description: "Track and manage action items for countries and meetings",
      icon: <CheckSquare className="h-12 w-12 text-primary" />,
      href: "/dashboard/action-items",
      stats: "18 pending items",
      trend: "6 completed this week",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Bilateral Agreements",
      description: "Manage bilateral agreements between countries and regions",
      icon: <FileSignature className="h-12 w-12 text-primary" />,
      href: "/dashboard/agreements",
      stats: "32 active agreements",
      trend: "4 pending approval",
      color: "from-cyan-500 to-blue-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Welcome to the Staff Portal</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Select a section below to get started with your tasks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-lg"
          >
            <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
            <CardHeader className="pb-2">
              <CardTitle className="dark:text-white">{section.title}</CardTitle>
              <CardDescription className="dark:text-gray-300">{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 transition-transform duration-200 hover:scale-110">
                  {section.icon}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium dark:text-gray-200">{section.stats}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{section.trend}</p>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href={section.href}>Go to {section.title}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

