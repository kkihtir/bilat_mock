"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { mockCountries } from "@/lib/mock-data"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"

export default function ReportInfoContent() {
  const router = useRouter()
  const [reportType, setReportType] = useState("meeting")
  const [meetingName, setMeetingName] = useState("")
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined)
  const [selectedCountry, setSelectedCountry] = useState("")

  // Load existing data if available
  useEffect(() => {
    const reportData = localStorage.getItem("reportData")
    if (reportData) {
      const parsedData = JSON.parse(reportData)
      setReportType(parsedData.reportType || "meeting")
      setMeetingName(parsedData.meetingName || "")
      setMeetingDate(parsedData.meetingDate ? new Date(parsedData.meetingDate) : undefined)
      setSelectedCountry(parsedData.selectedCountry || "")
    }
  }, [])

  const handleNext = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      reportType,
      meetingName,
      meetingDate: meetingDate ? meetingDate.toISOString() : null,
      selectedCountry,
      step: "profiles",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to next step
    router.push("/dashboard/reports/create/profiles")
  }

  const handleCancel = () => {
    router.push("/dashboard/reports")
  }

  // Function to render country with flag
  const renderCountryWithFlag = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    const countryName = country ? country.name : code

    return (
      <div className="flex items-center">
        <img
          src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
          alt={`${countryName} flag`}
          className="h-4 w-6 mr-2 rounded-sm object-cover"
        />
        <span>{countryName}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="report-info" />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <RadioGroup value={reportType} onValueChange={setReportType} className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="meeting" id="meeting" />
                  <Label htmlFor="meeting">Meeting Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="informative" id="informative" />
                  <Label htmlFor="informative">Informative Report</Label>
                </div>
              </RadioGroup>
            </div>

            {reportType === "meeting" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meeting-name">Meeting Name</Label>
                  <Input
                    id="meeting-name"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    placeholder="Enter meeting name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="meeting-date">Meeting Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !meetingDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {meetingDate ? format(meetingDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={meetingDate} onSelect={setMeetingDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="country">Select Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country" className="mt-1">
                  <SelectValue placeholder="Select a country">
                    {selectedCountry && renderCountryWithFlag(selectedCountry)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {renderCountryWithFlag(country.code)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleNext} disabled={!selectedCountry}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

