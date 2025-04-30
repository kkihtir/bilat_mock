"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import { format } from "date-fns"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"
import { mockCountries } from "@/lib/mock-data"

export default function SummaryContent() {
  const router = useRouter()
  const [reportData, setReportData] = useState<any>({})
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // Load existing data
  useEffect(() => {
    const storedData = localStorage.getItem("reportData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setReportData(parsedData)
    }
  }, [])

  const handleGenerateReport = () => {
    setIsGeneratingReport(true)

    // Simulate report generation
    setTimeout(() => {
      // In a real app, we would save the report to the database

      // Clear the report data from localStorage
      localStorage.removeItem("reportData")

      // Navigate to reports list
      router.push("/dashboard/reports/list")

      setIsGeneratingReport(false)
    }, 2000)
  }

  const handlePrevious = () => {
    // Navigate to previous step
    router.push("/dashboard/reports/create/talking-points")
  }

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge className="bg-gray-500">Not Started</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="summary" />

      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Report Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {reportData.reportType === "meeting" ? "Meeting Report" : "Informative Report"}
                    </span>
                  </div>
                  {reportData.reportType === "meeting" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meeting Name:</span>
                        <span className="font-medium">{reportData.meetingName || "Untitled Meeting"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meeting Date:</span>
                        <span className="font-medium">
                          {reportData.meetingDate ? format(new Date(reportData.meetingDate), "PPP") : "Not set"}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">
                      {reportData.selectedCountry ? getCountryName(reportData.selectedCountry) : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Profiles</h3>
                <div className="mt-2">
                  {reportData.selectedProfiles && reportData.selectedProfiles.length > 0 ? (
                    <ul className="space-y-1">
                      {reportData.selectedProfiles.map((profile: any) => (
                        <li key={profile.id} className="flex justify-between">
                          <span>{profile.fullName || "Unnamed Profile"}</span>
                          <span className="text-muted-foreground">{profile.position || "No position"}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No profiles added</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium">Bilateral Agreements</h3>
              <div className="mt-2">
                {reportData.agreements && reportData.agreements.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between font-medium text-sm">
                      <span>Agreement</span>
                      <span>Status</span>
                    </div>
                    <ul className="space-y-2 border rounded-md divide-y">
                      {reportData.agreements.map((agreement: any) => (
                        <li key={agreement.id} className="flex justify-between items-center p-2">
                          <span className="truncate max-w-[200px]">{agreement.name}</span>
                          <div className="flex items-center gap-2">{getStatusBadge(agreement.status)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No agreements found</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Country Overview</h3>
                <div className="mt-2">
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>Economic Indicators</span>
                      <span className="text-muted-foreground">
                        {reportData.countryOverview?.economicIndicators ? "Completed" : "Not completed"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Country Perception</span>
                      <span className="text-muted-foreground">
                        {reportData.countryOverview?.countryPerception ? "Completed" : "Not completed"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Trade Sectors</span>
                      <span className="text-muted-foreground">
                        {reportData.countryOverview?.tradeSectors ? "Completed" : "Not completed"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Trade with USA</span>
                      <span className="text-muted-foreground">
                        {reportData.countryOverview?.tradeWithUSA ? "Completed" : "Not completed"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">News & Events</h3>
                <div className="mt-2">
                  <span className="text-muted-foreground">{reportData.newsEvents ? "Completed" : "Not completed"}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Action Items</h3>
                <div className="mt-2">
                  {reportData.actionItems && reportData.actionItems.length > 0 ? (
                    <ul className="space-y-1">
                      {reportData.actionItems.map((item: any) => (
                        <li key={item.id} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{item.title}</span>
                          {getStatusBadge(item.status)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No action items added</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Talking Points</h3>
                <div className="mt-2">
                  {reportData.talkingPoints && reportData.talkingPoints.length > 0 ? (
                    <ul className="space-y-1">
                      {reportData.talkingPoints.map((tp: any) => (
                        <li key={tp.id} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{tp.title}</span>
                          <Badge variant="outline">{tp.category}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No talking points added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport || !reportData.selectedCountry}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGeneratingReport ? "Generating..." : "Generate Final Report"} <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

