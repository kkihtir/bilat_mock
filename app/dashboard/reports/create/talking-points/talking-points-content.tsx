"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"
import { mockCountries } from "@/lib/mock-data"

export default function TalkingPointsContent() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("")
  const [talkingPoints, setTalkingPoints] = useState<any[]>([])
  const [newTalkingPoint, setNewTalkingPoint] = useState({
    title: "",
    context: "",
    discussionPoints: "",
    category: "economic",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // Load existing data if available
  useEffect(() => {
    const reportData = localStorage.getItem("reportData")
    if (reportData) {
      const parsedData = JSON.parse(reportData)
      setSelectedCountry(parsedData.selectedCountry || "")
      setTalkingPoints(parsedData.talkingPoints || [])
    }
  }, [])

  const generateWithAI = () => {
    setIsGenerating(true)

    // Simulate AI generation with a timeout
    setTimeout(() => {
      setNewTalkingPoint({
        ...newTalkingPoint,
        discussionPoints:
          "• Discuss potential collaboration in key sectors\n• Explore opportunities for investment and trade expansion\n• Address regulatory challenges and propose solutions",
      })
      setIsGenerating(false)
    }, 2000)
  }

  const handleNext = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      talkingPoints,
      step: "summary",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to next step
    router.push("/dashboard/reports/create/summary")
  }

  const handlePrevious = () => {
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      talkingPoints,
      step: "action-items",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to previous step
    router.push("/dashboard/reports/create/action-items")
  }

  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  const addTalkingPoint = () => {
    if (newTalkingPoint.title && newTalkingPoint.context) {
      setTalkingPoints([...talkingPoints, { ...newTalkingPoint, id: Date.now().toString() }])
      setNewTalkingPoint({
        title: "",
        context: "",
        discussionPoints: "",
        category: "economic",
      })
    }
  }

  return (
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="talking-points" />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Talking Points for {selectedCountry ? getCountryName(selectedCountry) : ""}
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
          {talkingPoints.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Added Talking Points</h3>
              {talkingPoints.map((tp, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div>
                      <h4 className="font-medium">{tp.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tp.context}</p>
                      <div className="mt-3">
                        <Badge variant="outline">{tp.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Create Talking Point</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="talking-point-title">Title</Label>
                <Input
                  id="talking-point-title"
                  value={newTalkingPoint.title}
                  onChange={(e) => setNewTalkingPoint({ ...newTalkingPoint, title: e.target.value })}
                  placeholder="Enter talking point title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="talking-point-context">Context</Label>
                <Textarea
                  id="talking-point-context"
                  value={newTalkingPoint.context}
                  onChange={(e) => setNewTalkingPoint({ ...newTalkingPoint, context: e.target.value })}
                  placeholder="Enter context for this talking point"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="talking-point-discussion">Discussion Points</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateWithAI}
                    disabled={isGenerating || !newTalkingPoint.title || !newTalkingPoint.context}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <Textarea
                  id="talking-point-discussion"
                  value={newTalkingPoint.discussionPoints}
                  onChange={(e) => setNewTalkingPoint({ ...newTalkingPoint, discussionPoints: e.target.value })}
                  placeholder="Enter discussion points or generate with AI"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="talking-point-category">Category</Label>
                <Select
                  value={newTalkingPoint.category}
                  onValueChange={(value) => setNewTalkingPoint({ ...newTalkingPoint, category: value })}
                >
                  <SelectTrigger id="talking-point-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economic">Economic</SelectItem>
                    <SelectItem value="political">Political</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={addTalkingPoint}
                disabled={!newTalkingPoint.title || !newTalkingPoint.context}
              >
                Add Talking Point
              </Button>
            </CardContent>
          </Card>
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

