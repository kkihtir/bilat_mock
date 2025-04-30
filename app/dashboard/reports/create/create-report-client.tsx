"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateReportClient() {
  const router = useRouter()

  // Initialize report data in localStorage when the page loads
  useEffect(() => {
    // Check if we're starting a new report
    if (!localStorage.getItem("reportData")) {
      const initialReportData = {
        reportType: "meeting",
        meetingName: "",
        meetingDate: null,
        selectedCountry: "",
        selectedProfiles: [],
        countryOverview: {
          economicIndicators: "",
          countryPerception: "",
          tradeSectors: "",
          tradeWithUSA: "",
        },
        newsEvents: "",
        actionItems: [],
        talkingPoints: [],
        step: "report-info",
      }
      localStorage.setItem("reportData", JSON.stringify(initialReportData))
    }
  }, [])

  const startNewReport = () => {
    // Clear any existing report data
    const initialReportData = {
      reportType: "meeting",
      meetingName: "",
      meetingDate: null,
      selectedCountry: "",
      selectedProfiles: [],
      countryOverview: {
        economicIndicators: "",
        countryPerception: "",
        tradeSectors: "",
        tradeWithUSA: "",
      },
      newsEvents: "",
      actionItems: [],
      talkingPoints: [],
      step: "report-info",
    }
    localStorage.setItem("reportData", JSON.stringify(initialReportData))

    // Navigate to the first step
    router.push("/dashboard/reports/create/report-info")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Report</h1>
        <p className="mt-2 text-gray-600">
          Create a detailed report for VIPs about upcoming meetings or informative briefings
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Create a new report by following a step-by-step process. You'll be able to add country information,
            profiles, agreements, action items, and talking points.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Meeting Report</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a report for a specific meeting with details about attendees, agenda items, and follow-up
                  actions.
                </p>
                <Button onClick={startNewReport} className="w-full">
                  Create Meeting Report <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Informative Report</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create an informative report with country analysis, economic data, and bilateral relations
                  information.
                </p>
                <Button onClick={startNewReport} className="w-full">
                  Create Informative Report <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

