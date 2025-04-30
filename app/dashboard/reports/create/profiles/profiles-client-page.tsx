"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, User, ArrowRight, ArrowLeft, Check, Filter, Pencil, Trash2, X, Sparkles } from "lucide-react"
import { mockProfiles, mockCountries } from "@/lib/mock-data"
import { searchImageWithOpenAI, generateEducationWithAI, generateOverviewWithAI } from "@/lib/ai-services"
import ReportProgressIndicator from "@/components/reports/report-progress-indicator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

export default function ProfilesClientPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]) // Just store IDs
  const [availableProfiles, setAvailableProfiles] = useState<any[]>([])
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load existing data if available
  useEffect(() => {
    const reportData = localStorage.getItem("reportData")
    if (reportData) {
      const parsedData = JSON.parse(reportData)
      setSelectedCountry(parsedData.selectedCountry || "")
      
      // Convert to array of IDs if we have an array of objects
      if (parsedData.selectedProfiles && Array.isArray(parsedData.selectedProfiles)) {
        if (typeof parsedData.selectedProfiles[0] === 'object') {
          setSelectedProfiles(parsedData.selectedProfiles.map((p: any) => p.id))
        } else {
          setSelectedProfiles(parsedData.selectedProfiles || [])
        }
      }
    }
  }, [])

  // Update available profiles when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryProfiles = mockProfiles.filter((profile) => profile.country === selectedCountry)
      setAvailableProfiles(countryProfiles)
    } else {
      setAvailableProfiles([])
    }
  }, [selectedCountry])

  const toggleProfileSelection = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    )
  }

  const getCountryName = (code: string) => {
    const country = mockCountries.find(c => c.code === code)
    return country ? country.name : code.toUpperCase()
  }

  const handleNext = () => {
    // Convert IDs to full profile objects for compatibility with existing code
    const selectedProfileObjects = availableProfiles.filter(p => selectedProfiles.includes(p.id))
    
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      selectedProfiles: selectedProfileObjects,
      step: "country-overview",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to next step
    router.push("/dashboard/reports/create/country-overview")
  }

  const handlePrevious = () => {
    // Convert IDs to full profile objects for compatibility with existing code
    const selectedProfileObjects = availableProfiles.filter(p => selectedProfiles.includes(p.id))
    
    // Save current data
    const reportData = JSON.parse(localStorage.getItem("reportData") || "{}")
    const updatedData = {
      ...reportData,
      selectedProfiles: selectedProfileObjects,
      step: "report-info",
    }
    localStorage.setItem("reportData", JSON.stringify(updatedData))

    // Navigate to previous step
    router.push("/dashboard/reports/create/report-info")
  }

  const handleAddProfile = () => {
    // Create empty profile template
    const newProfile = {
      id: `new-${Date.now()}`,
      fullName: "",
      position: "",
      type: "ambassador",
      education: "",
      overview: "",
      imageUrl: "",
      country: selectedCountry,
    }
    
    setEditingProfile(newProfile)
    setIsEditDialogOpen(true)
  }

  const handleEditProfile = (profile: any) => {
    setEditingProfile({...profile})
    setIsEditDialogOpen(true)
  }

  const handleSaveProfile = () => {
    if (editingProfile) {
      // Check if this is a new profile
      const isNewProfile = editingProfile.id.startsWith('new-')
      
      // Update availableProfiles
      if (isNewProfile) {
        setAvailableProfiles([...availableProfiles, editingProfile])
        // Auto-select the new profile
        setSelectedProfiles([...selectedProfiles, editingProfile.id])
      } else {
        setAvailableProfiles(
          availableProfiles.map(p => p.id === editingProfile.id ? editingProfile : p)
        )
      }
      
      setIsEditDialogOpen(false)
      setEditingProfile(null)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingProfile) {
      const imageUrl = URL.createObjectURL(file)
      setEditingProfile({ ...editingProfile, imageUrl })
    }
  }

  // Generate profile data with AI
  const generateProfileWithAI = async (section?: 'education' | 'overview' | 'image' | 'all') => {
    setIsGenerating(true)
    
    try {
      // Update profile based on the section being generated
      if (section === 'education' || section === 'all') {
        const educationText = generateEducationWithAI(editingProfile.fullName);
        setEditingProfile((prev: any) => ({ ...prev, education: educationText }))
      }
      
      if (section === 'overview' || section === 'all') {
        const isAmbassador = editingProfile.type === 'ambassador';
        const overviewText = generateOverviewWithAI(editingProfile.fullName, isAmbassador);
        setEditingProfile((prev: any) => ({ ...prev, overview: overviewText }))
      }
      
      if (section === 'image' || section === 'all') {
        // Use OpenAI to find a suitable image based on profile information
        const country = getCountryName(editingProfile.country);
        const searchQuery = `${editingProfile.fullName || 'diplomat'}, ${editingProfile.position || 'political figure'}, ${country}`;
        
        const imageUrl = await searchImageWithOpenAI(searchQuery);
        if (imageUrl) {
          setEditingProfile((prev: any) => ({ ...prev, imageUrl }))
        }
      }
    } catch (error) {
      console.error("Error generating profile data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredProfiles = filterType 
    ? availableProfiles.filter(profile => profile.type === filterType)
    : availableProfiles

  return (
    <div className="space-y-6">
      <ReportProgressIndicator currentStep="profiles" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Select Profiles for {getCountryName(selectedCountry)}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the profiles to include in your report
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={filterType === null ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setFilterType(null)}
          >
            All
          </Button>
          <Button 
            variant={filterType === "ambassador" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setFilterType("ambassador")}
          >
            Ambassadors
          </Button>
          <Button 
            variant={filterType === "non-ambassador" ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setFilterType("non-ambassador")}
          >
            Non-Ambassadors
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleAddProfile}>
          <Plus className="mr-2 h-4 w-4" /> Add Profile
        </Button>
      </div>

      {!selectedCountry ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Please select a country first in the Report Info tab.</p>
          </CardContent>
        </Card>
      ) : availableProfiles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>No profiles available for this country. Click "Add Profile" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <ScrollArea className="h-[420px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {filteredProfiles.map((profile) => (
                  <div 
                    key={profile.id}
                    className={`flex items-center p-3 rounded-md border ${
                      selectedProfiles.includes(profile.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div 
                      className="flex-grow flex items-center cursor-pointer"
                      onClick={() => toggleProfileSelection(profile.id)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          {profile.imageUrl ? (
                            <img
                              src={profile.imageUrl}
                              alt={profile.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{profile.fullName}</h3>
                            <p className="text-xs text-muted-foreground">{profile.position}</p>
                          </div>
                          <Badge variant={profile.type === "ambassador" ? "default" : "secondary"} className="ml-2 text-xs">
                            {profile.type === "ambassador" ? "Ambassador" : "Non-Ambassador"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`h-5 w-5 rounded-full border ${
                                selectedProfiles.includes(profile.id) 
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-input'
                              } flex items-center justify-center`}>
                                {selectedProfiles.includes(profile.id) && <Check className="h-3 w-3" />}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {selectedProfiles.includes(profile.id) ? 'Selected' : 'Click to select'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditProfile(profile)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Edit Profile
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm">
            {selectedProfiles.length} profile{selectedProfiles.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNext}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit/Create Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>
              {editingProfile?.id?.startsWith('new-') ? 'Add New Profile' : 'Edit Profile'}
            </DialogTitle>
            <DialogDescription>
              {editingProfile?.id?.startsWith('new-') ? 'Create a new profile' : 'Update the profile details'}
            </DialogDescription>
          </DialogHeader>
          
          {editingProfile && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted">
                  {editingProfile.imageUrl ? (
                    <img
                      src={editingProfile.imageUrl}
                      alt={editingProfile.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => generateProfileWithAI('image')}
                      disabled={isGenerating}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editingProfile.fullName}
                      onChange={(e) => setEditingProfile({ ...editingProfile, fullName: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editingProfile.position}
                      onChange={(e) => setEditingProfile({ ...editingProfile, position: e.target.value })}
                      placeholder="Enter position"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Profile Type</Label>
                  <Select
                    value={editingProfile.type}
                    onValueChange={(value: "ambassador" | "non-ambassador") =>
                      setEditingProfile({ ...editingProfile, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select profile type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambassador">Ambassador</SelectItem>
                      <SelectItem value="non-ambassador">Non-Ambassador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="education">Education</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateProfileWithAI('education')}
                      disabled={isGenerating}
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="education"
                    value={editingProfile.education}
                    onChange={(e) => setEditingProfile({ ...editingProfile, education: e.target.value })}
                    placeholder="Enter education background"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="overview">Overview</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateProfileWithAI('overview')}
                      disabled={isGenerating}
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="overview"
                    value={editingProfile.overview}
                    onChange={(e) => setEditingProfile({ ...editingProfile, overview: e.target.value })}
                    placeholder="Enter profile overview"
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => generateProfileWithAI('all')}
                  disabled={isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Generate All Fields with AI
                  {isGenerating && "..."}
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isGenerating}>
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

