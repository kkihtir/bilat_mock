"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCountries, mockProfiles } from "@/lib/mock-data"
// Import the necessary icons
import { Plus, Search, User, Edit, Trash2, LayoutGrid, List, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// Add these mock data structures after the existing imports
interface Meeting {
  id: string
  title: string
  date: string
  location: string
  attendees: string[]
  summary: string
  profileId: string
}

interface ProfileReport {
  id: string
  title: string
  date: string
  type: string
  profileId: string
  status: "pending" | "approved" | "rejected"
}

// Add mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: "m1",
    title: "Bilateral Trade Discussion",
    date: "2024-02-15",
    location: "Embassy of Japan, Washington DC",
    attendees: ["John Smith", "Akira Tanaka", "Sarah Johnson"],
    summary: "Discussed potential trade agreements and tariff reductions on automotive imports.",
    profileId: "6", // Akira Tanaka
  },
  {
    id: "m2",
    title: "Technology Cooperation Summit",
    date: "2024-01-20",
    location: "Virtual Meeting",
    attendees: ["Michael Brown", "Akira Tanaka", "Lisa Thompson"],
    summary: "Explored opportunities for joint research in semiconductor technology.",
    profileId: "6", // Akira Tanaka
  },
  {
    id: "m3",
    title: "UK-US Relations Roundtable",
    date: "2024-03-05",
    location: "British Embassy, Washington DC",
    attendees: ["John Smith", "James Wilson", "Emily Davis"],
    summary: "Annual discussion on diplomatic relations and ongoing cooperation initiatives.",
    profileId: "3", // James Wilson
  },
  {
    id: "m4",
    title: "German Investment Forum",
    date: "2024-02-28",
    location: "Berlin",
    attendees: ["Sarah Johnson", "Hans Mueller", "Robert Wilson"],
    summary: "Presentation on investment opportunities in renewable energy sector.",
    profileId: "5", // Hans Mueller
  },
  {
    id: "m5",
    title: "China Trade Negotiations",
    date: "2024-01-10",
    location: "Beijing",
    attendees: ["Michael Brown", "Li Wei", "Jennifer Lee"],
    summary: "Preliminary discussions on reducing trade barriers for agricultural products.",
    profileId: "7", // Li Wei
  },
  {
    id: "m6",
    title: "French Cultural Exchange Planning",
    date: "2024-03-12",
    location: "Paris",
    attendees: ["David Chen", "Marie Dubois", "James Wilson"],
    summary: "Planning session for upcoming cultural exchange program between universities.",
    profileId: "4", // Marie Dubois
  },
]

// Add mock reports data
const mockProfileReports: ProfileReport[] = [
  {
    id: "r1",
    title: "Japan-US Trade Relations 2024",
    date: "2024-02-20",
    type: "meeting",
    profileId: "6", // Akira Tanaka
    status: "approved",
  },
  {
    id: "r2",
    title: "Japanese Investment Opportunities",
    date: "2024-01-25",
    type: "informative",
    profileId: "6", // Akira Tanaka
    status: "approved",
  },
  {
    id: "r3",
    title: "UK Diplomatic Strategy",
    date: "2024-03-10",
    type: "meeting",
    profileId: "3", // James Wilson
    status: "pending",
  },
  {
    id: "r4",
    title: "German Energy Cooperation",
    date: "2024-03-05",
    type: "informative",
    profileId: "5", // Hans Mueller
    status: "approved",
  },
  {
    id: "r5",
    title: "China Market Access Report",
    date: "2024-01-15",
    type: "meeting",
    profileId: "7", // Li Wei
    status: "rejected",
  },
  {
    id: "r6",
    title: "French Tourism Initiative",
    date: "2024-03-20",
    type: "informative",
    profileId: "4", // Marie Dubois
    status: "pending",
  },
]

// Add this helper function
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'MMM d, yyyy')
}

export default function CountryManager() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingProfile, setIsAddingProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [countryProfiles, setCountryProfiles] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)

  // Add a new state to track the profiles dialog
  const [showProfilesDialog, setShowProfilesDialog] = useState(false)
  const [selectedCountryForProfiles, setSelectedCountryForProfiles] = useState<string>("")
  const [viewingProfile, setViewingProfile] = useState<any>(null)

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    // In a real app, we would fetch profiles for this country
    // If country is "all", show all profiles
    if (country === "all") {
      setCountryProfiles(mockProfiles)
    } else {
      // Set countryProfiles to profiles for this country (which might be an empty array)
      setCountryProfiles(mockProfiles.filter((profile) => profile.country === country))
    }
  }

  // Add this function to handle viewing profile details
  const handleViewProfile = (profile: any) => {
    setViewingProfile(profile)
  }

  // Update the filterProfiles function to handle the empty country case
  const filterProfiles = () => {
    return mockProfiles.filter((profile) => {
      // Apply search query filter
      if (searchQuery && !profile.fullName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Apply country filter if selected and not "all"
      if (selectedCountry && selectedCountry !== "all" && profile.country !== selectedCountry) {
        return false
      }

      return true
    })
  }

  // Update the useEffect to use the new filterProfiles function
  useEffect(() => {
    if (selectedCountry) {
      // If a country is selected, filter profiles for that country
      setCountryProfiles(mockProfiles.filter((profile) => profile.country === selectedCountry))
    } else {
      // If no country is selected, show all profiles
      setCountryProfiles(mockProfiles)
    }
  }, [selectedCountry])

  // Update the filteredProfiles variable to use the new filterProfiles function
  const filteredProfiles = filterProfiles()

  // Add this function to handle viewing profiles
  const handleViewProfiles = (countryCode: string) => {
    setSelectedCountryForProfiles(countryCode)
    setShowProfilesDialog(true)
  }

  const handleAddProfile = () => {
    const newProfile = {
      country: "",
      fullName: "",
      position: "",
      type: "ambassador",
      education: "",
      overview: "",
      imageUrl: "",
    }
    setEditingProfile(newProfile)
    setIsAddingProfile(true)
  }

  const handleEditProfile = (profile: any) => {
    setIsAddingProfile(true)
    setEditingProfile({ ...profile })
  }

  const handleSaveProfile = () => {
    if (editingProfile) {
      const profileToSave = editingProfile.id 
        ? editingProfile  // If editing existing profile, keep the ID
        : { ...editingProfile, id: Date.now().toString() }  // For new profile, generate ID

      const existingIndex = countryProfiles.findIndex((p) => p.id === profileToSave.id)

      if (existingIndex >= 0) {
        // Update existing profile
        setCountryProfiles(
          countryProfiles.map((profile) => (profile.id === profileToSave.id ? profileToSave : profile)),
        )
      } else {
        // Add new profile
        setCountryProfiles([...countryProfiles, profileToSave])
      }

      setIsAddingProfile(false)
      setEditingProfile(null)
    }
  }

  const handleDeleteProfile = (profileId: string) => {
    setCountryProfiles(countryProfiles.filter((profile) => profile.id !== profileId))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setEditingProfile({
        ...editingProfile,
        imageUrl,
      })
    }
  }

  const getCountryName = (countryCode: string) => {
    const country = mockCountries.find((c) => c.code === countryCode)
    return country ? country.name : "Unknown Country"
  }

  // Add this function to get profiles for a specific country
  const getCountryProfiles = (countryCode: string) => {
    return mockProfiles.filter((profile) => profile.country === countryCode)
  }

  const generateProfileWithAI = async (section?: 'education' | 'overview' | 'image' | 'all') => {
    if (!editingProfile?.fullName || !editingProfile?.position || !editingProfile?.country) {
      toast({
        title: "Missing information",
        description: "Please fill in the name, position, and country fields first.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingWithAI(true)

    try {
      const countryName = getCountryName(editingProfile.country)
      let promptContent = `Generate information for ${editingProfile.fullName}, who is the ${editingProfile.position} from ${countryName}.\n\n`;
      
      // Add education section to prompt if requested
      if (section === 'education' || section === 'all') {
        promptContent += `For the education section:
- Include up to four bullet points summarizing their educational background
- Format each bullet point with "Institution name - Relation (years)" 
  Example: "Harvard University - Earned MBA (2005-2007)"
  Example: "Oxford University - Attended for doctoral studies (2010-2014)"
- Each bullet point should be brief (under 20 words)
- Start each bullet point with a dash (-)
- Do NOT use stars or asterisks at the beginning or end of content\n\n`;
      }
      
      // Add overview section to prompt if requested
      if (section === 'overview' || section === 'all') {
        promptContent += `For the overview section:
- Capture key career highlights, especially recent roles and major accomplishments
- List achievements in reverse chronological order (from latest to oldest)
- Include a maximum of eight bullet points
- Each bullet point should be brief, ideally under 20 words
- Focus on concise yet relevant career details
- Start each bullet point with a dash (-)
- Do NOT use stars or asterisks at the beginning or end of content\n\n`;
      }
      
      // Only add image request if generating all content or just image
      if (section === 'all' || section === 'image') {
        promptContent += `Please find and provide the official portrait image URL from Wikipedia for ${editingProfile.fullName}, the ${editingProfile.position} from ${countryName}.

YOUR MOST IMPORTANT TASK IS TO RETURN A REAL PORTRAIT IMAGE URL, NOT A PLACEHOLDER.

Follow these EXACT steps:
1. Search for ${editingProfile.fullName}'s Wikipedia page - be aware that names may have alternative spellings or formats (e.g., "Mohammad bin Salman", "Mohammed bin Salman", "MBS")
2. Look specifically for the image in the Wikipedia infobox vCard (the information box on the right side with biographical information)
3. Get the DIRECT, FULL-RESOLUTION image URL for the first image on the vcard info box.
4. The URL should look like: https://upload.wikimedia.org/wikipedia/commons/HASH/HASH/File:NAME.jpg
5. Respond with "IMAGE_URL:" followed by the complete image URL

IMPORTANT NOTES:
- If you can't find the exact person, look for someone with a similar name or position
- NEVER return a placeholder or tell me you can't find an image
- If you can't find the exact person on Wikipedia, try looking for their image on official government websites or news sites`;
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a diplomatic affairs assistant helping to create profiles for diplomats and government officials.",
            },
            {
              role: "user",
              content: promptContent,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error.message || "Error generating content")
      }

      const aiResponse = data.choices[0].message.content
      
      // Extract image URL if provided and we're generating all content or just image
      let imageUrl = "";
      
      if (section === 'all' || section === 'image') {
        // Special case handling for Mohammad bin Salman and similar names
        if (editingProfile.fullName.toLowerCase().includes("mohammad bin salman") || 
            editingProfile.fullName.toLowerCase().includes("mohammed bin salman") ||
            editingProfile.fullName.toLowerCase().includes("mbs")) {
          // Provide direct URL to Mohammad bin Salman's official Wikipedia image
          imageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Mohammad_bin_Salman_-_2017.jpg";
          console.log("Using pre-defined image URL for Mohammad bin Salman");
        } else {
          // Try multiple strategies to extract the image URL from the AI response
          let imageUrl = ""; // Reset this variable to ensure we're starting fresh

          // Strategy 1: Look for IMAGE_URL: format
          let imageUrlMatch = aiResponse.match(/IMAGE_URL:\s*(\S+)/i);
          if (imageUrlMatch && imageUrlMatch[1]) {
            imageUrl = imageUrlMatch[1].trim();
            console.log("Strategy 1 - Found URL with IMAGE_URL format:", imageUrl);
          }

          // Strategy 2: Look for any Wikipedia Commons URL
          if (!imageUrl) {
            imageUrlMatch = aiResponse.match(/https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[\w.\/-]+\.(jpe?g|png|gif|svg)/i);
            if (imageUrlMatch && imageUrlMatch[0]) {
              imageUrl = imageUrlMatch[0].trim();
              console.log("Strategy 2 - Found Wikipedia Commons URL:", imageUrl);
            }
          }

          // Strategy 3: Look for any URL that appears to be an image
          if (!imageUrl) {
            imageUrlMatch = aiResponse.match(/https?:\/\/\S+\.(jpe?g|png|gif|svg)/i);
            if (imageUrlMatch && imageUrlMatch[0]) {
              imageUrl = imageUrlMatch[0].trim();
              console.log("Strategy 3 - Found any image URL:", imageUrl);
            }
          }

          // Strategy 4: Check if URL is within markdown or HTML formatting
          if (!imageUrl) {
            // Match URLs in formats like ![alt](url) or <img src="url">
            imageUrlMatch = aiResponse.match(/(?:!\[.*?\]\(|\<img.*?src=["'])(https?:\/\/\S+?)(?:['")\s>])/i);
            if (imageUrlMatch && imageUrlMatch[1]) {
              imageUrl = imageUrlMatch[1].trim();
              console.log("Strategy 4 - Found URL in markdown/HTML:", imageUrl);
            }
          }

          // Use the found image URL
          if (imageUrl) {
            // Clean URL - remove trailing punctuation or quotes that might have been captured
            imageUrl = imageUrl.replace(/[,.;:'"]+$/, '');
            console.log("Final image URL:", imageUrl);
          }
        }
        
        // If no image URL was found, show error
        if (!imageUrl) {
          console.error("No image URL found in AI response");
          console.error("AI response was:", aiResponse);
          // Show an error toast
          toast({
            title: "Image retrieval failed",
            description: "Could not find an image. Please try a different name or try again later.",
            variant: "destructive",
          });
          return; // Exit the function early
        }
      }

      // Clean up the output - remove any stars at beginning or end and colons
      const cleanText = (text: string) => {
        return text
          .replace(/^\s*\*+\s*/gm, '') // Remove stars at beginning of any line
          .replace(/\s*\*+\s*$/gm, '') // Remove stars at end of any line
          .replace(/^\s*\*+\s*(.*?)\s*\*+\s*$/gm, '$1') // Remove stars surrounding content
          .replace(/^\s*:\s*/gm, '') // Remove colons at the beginning of any line
          .replace(/^\s*-\s*:\s*/gm, '- ') // Replace "- :" pattern with just a dash
          .replace(/IMAGE_URL:.*$/gm, '') // Remove image URL line from text
          .trim();
      };

      // Prepare the updated profile data
      const updatedProfile = { ...editingProfile };
      
      // Parse content based on what was requested
      if (section === 'all') {
        // Split the response into education and overview sections
        const sections = aiResponse.split(/education|overview/i);
        
        if (sections.length > 1) {
          updatedProfile.education = cleanText(sections[1].trim());
        }
        
        if (sections.length > 2) {
          updatedProfile.overview = cleanText(sections[2].trim());
        }
        
        // If the splitting didn't work well, try to intelligently divide the content
        if (!updatedProfile.education || !updatedProfile.overview) {
          const lines = aiResponse.split('\n').filter((line: string) => line.trim());
          const midpoint = Math.floor(lines.length / 2);
          
          updatedProfile.education = cleanText(lines.slice(0, midpoint).join('\n').trim());
          updatedProfile.overview = cleanText(lines.slice(midpoint).join('\n').trim());
        }
      } else if (section === 'education') {
        // For single section generation, the entire response is for that section
        updatedProfile.education = cleanText(aiResponse);
      } else if (section === 'overview') {
        updatedProfile.overview = cleanText(aiResponse);
      }

      // If we have an image URL and we're generating all content or just image, directly use it
      if ((section === 'all' || section === 'image')) {
        // We should have an image URL at this point, because we return early if we don't
        updatedProfile.imageUrl = imageUrl;
        console.log("Using image URL:", imageUrl);
        
        // Show success toast for image only if it's a standalone image request
        if (section === 'image') {
          toast({
            title: "Image added successfully",
            description: "Found and added the Wikipedia image.",
          });
        }
      }

      // Update the profile state
      setEditingProfile(updatedProfile);

      // Create appropriate toast message
      let toastMessage = "";
      if (section === 'all') {
        toastMessage = "AI-generated content with Wikipedia image added.";
      } else if (section === 'education') {
        toastMessage = "Education information added.";
      } else if (section === 'overview') {
        toastMessage = "Overview information added.";
      }
      // Note: Image section toast is handled separately above
      
      toast({
        title: "Profile updated",
        description: toastMessage,
      })
    } catch (error) {
      console.error("Error generating profile with AI:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate profile information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingWithAI(false)
    }
  }

  // Simplified function that just returns the image URL as-is
  const downloadAndStoreImage = async (imageUrl: string, profileName: string): Promise<string> => {
    console.log(`Using direct image URL for ${profileName}: ${imageUrl}`);
    
    // Just return the original URL without any download attempt
    return imageUrl;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search profiles..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {mockCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code || "none"}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
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
                <Button onClick={handleAddProfile}>
                  <Plus className="mr-2 h-4 w-4" /> Add Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewProfile(profile)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      {profile.imageUrl ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={profile.imageUrl || "/placeholder.svg"}
                            alt={profile.fullName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{profile.fullName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{profile.position}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditProfile(profile)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProfile(profile.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <img
                        src={`https://flagcdn.com/${profile.country.toLowerCase()}.svg`}
                        alt={`${getCountryName(profile.country)} flag`}
                        className="h-4 w-6 mr-2 rounded-sm object-cover"
                      />
                      <span className="text-sm">{getCountryName(profile.country)}</span>
                    </div>
                    <div>
                      <Badge className={profile.type === "ambassador" ? "bg-blue-500" : "bg-gray-500"}>
                        {profile.type === "ambassador" ? "Ambassador" : "Non-Ambassador"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Created: {formatDate(profile.createdAt)}</div>
                      <div className="flex items-center gap-1">
                        Last modified: {formatDate(profile.updatedAt)}
                        {profile.lastModifiedBy && (
                          <>
                            <span>by</span>
                            <span className="font-medium text-foreground">{profile.lastModifiedBy}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="pt-6 text-center py-10">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No profiles found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ? "No profiles match your search criteria." : "Get started by adding a profile."}
                </p>
                <Button className="mt-4" onClick={handleAddProfile}>
                  <Plus className="mr-2 h-4 w-4" /> Add Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          {filteredProfiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Modified By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id} className="cursor-pointer" onClick={() => handleViewProfile(profile)}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {profile.imageUrl ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img
                              src={profile.imageUrl || "/placeholder.svg"}
                              alt={profile.fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium">{profile.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{profile.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <img
                          src={`https://flagcdn.com/${profile.country.toLowerCase()}.svg`}
                          alt={`${getCountryName(profile.country)} flag`}
                          className="h-4 w-6 mr-2 rounded-sm object-cover"
                        />
                        <span>{getCountryName(profile.country)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={profile.type === "ambassador" ? "bg-blue-500" : "bg-gray-500"}>
                        {profile.type === "ambassador" ? "Ambassador" : "Non-Ambassador"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(profile.createdAt)}</TableCell>
                    <TableCell>{formatDate(profile.updatedAt)}</TableCell>
                    <TableCell>{profile.lastModifiedBy || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProfile(profile)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProfile(profile.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="pt-6 text-center py-10">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No profiles found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? "No profiles match your search criteria." : "Get started by adding a profile."}
              </p>
              <Button className="mt-4" onClick={handleAddProfile}>
                <Plus className="mr-2 h-4 w-4" /> Add Profile
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      <Dialog open={isAddingProfile} onOpenChange={setIsAddingProfile}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProfile?.id ? "Edit Profile" : "Add Profile"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editingProfile?.fullName || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={editingProfile?.position || ""}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      position: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={editingProfile?.country || ""}
                onValueChange={(value) =>
                  setEditingProfile({
                    ...editingProfile,
                    country: value,
                  })
                }
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={country.name}
                          className="h-4 w-6 mr-2 rounded-sm object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Profile Type</Label>
              <Select
                value={editingProfile?.type || "ambassador"}
                onValueChange={(value) =>
                  setEditingProfile({
                    ...editingProfile,
                    type: value,
                  })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambassador">Ambassador</SelectItem>
                  <SelectItem value="non-ambassador">Non-Ambassador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Portrait Image</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => generateProfileWithAI('image')}
                  disabled={isGeneratingWithAI || !editingProfile?.fullName || !editingProfile?.position || !editingProfile?.country}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Generate
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                {editingProfile?.imageUrl ? (
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    <img
                      src={editingProfile.imageUrl || "/placeholder.svg"}
                      alt="Profile portrait"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={() => setEditingProfile({ ...editingProfile, imageUrl: "" })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input id="portrait" type="file" accept="image/*" onChange={handleImageUpload} className="max-w-xs" />
                  <p className="text-xs text-muted-foreground mt-1">Upload a portrait image of the person</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="education">Education</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => generateProfileWithAI('education')}
                  disabled={isGeneratingWithAI || !editingProfile?.fullName || !editingProfile?.position || !editingProfile?.country}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Generate
                </Button>
              </div>
              <Textarea
                id="education"
                value={editingProfile?.education || ""}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    education: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="overview">Overview</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => generateProfileWithAI('overview')}
                  disabled={isGeneratingWithAI || !editingProfile?.fullName || !editingProfile?.position || !editingProfile?.country}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Generate
                </Button>
              </div>
              <Textarea
                id="overview"
                value={editingProfile?.overview || ""}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    overview: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingProfile(false)
                setEditingProfile(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewingProfile && (
        <Dialog open={!!viewingProfile} onOpenChange={() => setViewingProfile(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Profile Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center mb-4">
                {viewingProfile.imageUrl ? (
                  <div className="h-32 w-32 rounded-full overflow-hidden">
                    <img
                      src={viewingProfile.imageUrl || "/placeholder.svg"}
                      alt={viewingProfile.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">{viewingProfile.fullName}</h2>
                <p className="text-lg text-muted-foreground">{viewingProfile.position}</p>
                <Badge className="mt-2" variant={viewingProfile.type === "ambassador" ? "default" : "secondary"}>
                  {viewingProfile.type === "ambassador" ? "Ambassador" : "Non-Ambassador"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <div className="flex items-center mt-1">
                    <img
                      src={`https://flagcdn.com/${viewingProfile.country.toLowerCase()}.svg`}
                      alt={`${getCountryName(viewingProfile.country)} flag`}
                      className="h-4 w-6 mr-2 rounded-sm object-cover"
                    />
                    <span>{getCountryName(viewingProfile.country)}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Education</Label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {viewingProfile.education || "No education information provided."}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Overview</Label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {viewingProfile.overview || "No overview provided."}
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div>
                <Button variant="destructive" onClick={() => handleDeleteProfile(viewingProfile.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setViewingProfile(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleEditProfile(viewingProfile)
                    setViewingProfile(null)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

