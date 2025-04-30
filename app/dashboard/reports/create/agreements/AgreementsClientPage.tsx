"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, FileText } from "lucide-react"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"
import { mockCountries } from "@/lib/mock-data"
import { mockAgreements } from "@/lib/mock-agreements"

export default function AgreementsClientPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("")
  const [agreements, setAgreements] = useState<any[]>([])

  // Load existing data if available
  useEffect(() => {
    const reportData = localStorage.getItem("reportData")
    if (reportData) {
      const parsedData = JSON.parse(reportData)
      setSelectedCountry(parsedData.selectedCountry || "")

      // Load agreements for this country
      if (parsedData.selectedCountry) {
        const countryAgreements = getCountryAgreements(parsedData.selectedCountry)
        setAgreements(countryAgreements)
      }
    }
  }, [])

  const handleNext = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      agreements,
      step: "action-items",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to next step
    router.push("/dashboard/reports/create/action-items")
  }

  const handlePrevious = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      agreements,
      step: "news-events",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to previous step
    router.push("/dashboard/reports/create/news-events")
  }

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  // Get country-specific agreements
  const getCountryAgreements = (countryCode: string) => {
    return mockAgreements.filter((agreement) => agreement.country === countryCode)
  }

  // Get status badge
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
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="agreements" />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Bilateral Agreements with {selectedCountry ? getCountryName(selectedCountry) : ""}
        </h2>
      </div>

      {!selectedCountry ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Please select a country first in the Report Info tab.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {agreements.length > 0 ? (
            <div className="space-y-6">
              {agreements.map((agreement) => (
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
                            {agreement.updates.slice(1).map((update: any) => (
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bilateral agreements found with {getCountryName(selectedCountry)}.</p>
                <p className="text-sm mt-2">You can add agreements in the Agreements section.</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <a href="/dashboard/agreements" target="_blank" rel="noreferrer">
                    Manage Agreements
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

