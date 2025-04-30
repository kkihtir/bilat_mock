"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Plus, Edit, Trash2, Copy, Sparkles, Search } from "lucide-react"
import { mockTalkingPoints, type TalkingPoint } from "@/lib/mock-talking-points"
import { mockCountries } from "@/lib/mock-data"

export default function TalkingPointsManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTalkingPoint, setSelectedTalkingPoint] = useState<TalkingPoint | null>(null)
  const [countryFilter, setCountryFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique categories for filter
  const categories = Array.from(new Set(mockTalkingPoints.map((tp) => tp.category)))

  // Filter talking points
  const filteredTalkingPoints = mockTalkingPoints.filter((tp) => {
    const matchesCountry = countryFilter === "all" || tp.country === countryFilter
    const matchesCategory = categoryFilter === "all" || tp.category === categoryFilter
    const matchesSearch =
      searchQuery === "" ||
      tp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.discussionPoints.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCountry && matchesCategory && matchesSearch
  })

  const handleEditTalkingPoint = (talkingPoint: TalkingPoint) => {
    setSelectedTalkingPoint(talkingPoint)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTalkingPoint = (talkingPoint: TalkingPoint) => {
    setSelectedTalkingPoint(talkingPoint)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateTalkingPoint = () => {
    setIsCreateDialogOpen(false)
    // In a real app, this would save the new talking point
  }

  const handleSaveEditedTalkingPoint = () => {
    setIsEditDialogOpen(false)
    // In a real app, this would update the talking point
  }

  const handleConfirmDelete = () => {
    setIsDeleteDialogOpen(false)
    // In a real app, this would delete the talking point
  }

  const generateDiscussionPoints = () => {
    // In a real app, this would call an AI service to generate discussion points
    return [
      "Discuss potential areas of collaboration in key sectors",
      "Explore opportunities for increased trade and investment",
      "Address challenges in the bilateral relationship and propose solutions",
    ]
  }

  // Get country name from code
  const getCountryName = (code: string) => {
    const country = mockCountries.find((c) => c.code === code)
    return country ? country.name : code
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search talking points..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {mockCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Talking Points
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Talking Points</DialogTitle>
                <DialogDescription>Add talking points that can be used in reports and briefings.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g., Exploring Cooperation in Energy Sector" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="US">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue="Energy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Trade">Trade</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Defense">Defense</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="context">Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Provide background information and context for these talking points"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="discussionPoints">Discussion Points</Label>
                    <Button variant="outline" size="sm" onClick={() => generateDiscussionPoints()}>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="discussionPoints"
                    placeholder="Enter discussion points, one per line"
                    className="min-h-[150px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTalkingPoint}>Save Talking Points</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredTalkingPoints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTalkingPoints.map((talkingPoint) => (
            <Card key={talkingPoint.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{talkingPoint.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {talkingPoint.category}
                      </Badge>
                      <Badge variant="secondary" className="mr-2">
                        {getCountryName(talkingPoint.country)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Updated: {talkingPoint.updatedAt}</span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTalkingPoint(talkingPoint)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTalkingPoint(talkingPoint)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Context</h4>
                    <div className="bg-muted/30 p-3 rounded-md text-sm whitespace-pre-line">{talkingPoint.context}</div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Discussion Points</h4>
                    <ul className="space-y-2">
                      {talkingPoint.discussionPoints.map((point, index) => (
                        <li key={index} className="bg-muted/30 p-3 rounded-md text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" asChild className="mr-2">
                      <Link href={`/dashboard/countries/${talkingPoint.country}`}>View Country</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/reports/create?talkingPoint=${talkingPoint.id}`}>Use in Report</Link>
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
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No talking points found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "No talking points match your search criteria."
                : "No talking points match your current filters."}
            </p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Talking Points
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Talking Points</DialogTitle>
            <DialogDescription>Update talking points details.</DialogDescription>
          </DialogHeader>
          {selectedTalkingPoint && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={selectedTalkingPoint.title} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Select defaultValue={selectedTalkingPoint.country}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={selectedTalkingPoint.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Energy">Energy</SelectItem>
                      <SelectItem value="Trade">Trade</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Defense">Defense</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-context">Context</Label>
                <Textarea id="edit-context" defaultValue={selectedTalkingPoint.context} className="min-h-[100px]" />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-discussionPoints">Discussion Points</Label>
                  <Button variant="outline" size="sm" onClick={() => generateDiscussionPoints()}>
                    <Sparkles className="mr-2 h-4 w-4" /> Regenerate with AI
                  </Button>
                </div>
                <Textarea
                  id="edit-discussionPoints"
                  defaultValue={selectedTalkingPoint.discussionPoints.join("\n")}
                  className="min-h-[150px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedTalkingPoint}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these talking points? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

