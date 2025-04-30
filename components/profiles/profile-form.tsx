"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { User, Trash2, Sparkles } from "lucide-react"
import DeleteProfileDialog from "@/components/profiles/delete-profile-dialog"
import { mockCountries } from "@/lib/mock-data"
import { searchImageWithOpenAI, generateEducationWithAI, generateOverviewWithAI } from "@/lib/ai-services"

interface Profile {
  id: string
  fullName: string
  position: string
  type: "ambassador" | "non-ambassador"
  education: string
  overview: string
  imageUrl: string
  country: string
}

interface ProfileFormProps {
  initialData: Profile
  countryCode: string
}

export default function ProfileForm({ initialData, countryCode }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [profile, setProfile] = useState<Profile>(initialData)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfile({ ...profile, imageUrl })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, you would make an API call here to update the profile
      console.log("Updating profile:", profile)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to the country profiles page
      router.push(`/dashboard/countries/${countryCode}/profiles`)
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCountryName = (code: string) => {
    const country = mockCountries.find(c => c.code === code)
    return country ? country.name : code.toUpperCase()
  }

  // Generate profile data with AI
  const generateProfileWithAI = async (section?: 'education' | 'overview' | 'image' | 'all') => {
    setIsGenerating(true)
    
    try {
      // Update profile based on the section being generated
      if (section === 'education' || section === 'all') {
        const educationText = generateEducationWithAI(profile.fullName);
        setProfile(prev => ({ ...prev, education: educationText }))
      }
      
      if (section === 'overview' || section === 'all') {
        const isAmbassador = profile.type === 'ambassador';
        const overviewText = generateOverviewWithAI(profile.fullName, isAmbassador);
        setProfile(prev => ({ ...prev, overview: overviewText }))
      }
      
      if (section === 'image' || section === 'all') {
        // Use OpenAI to find a suitable image based on profile information
        const country = getCountryName(profile.country);
        const searchQuery = `${profile.fullName || 'diplomat'}, ${profile.position || 'political figure'}, ${country}`;
        
        const imageUrl = await searchImageWithOpenAI(searchQuery);
        if (imageUrl) {
          setProfile(prev => ({ ...prev, imageUrl }))
        }
      }
    } catch (error) {
      console.error("Error generating profile data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-48 w-48 rounded-lg overflow-hidden bg-muted">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="space-y-2 w-full">
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
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
                {profile.imageUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => setProfile({ ...profile, imageUrl: "" })}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    placeholder="Enter position"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Profile Type</Label>
                <Select
                  value={profile.type}
                  onValueChange={(value: "ambassador" | "non-ambassador") =>
                    setProfile({ ...profile, type: value })
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
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  placeholder="Enter education background"
                  rows={3}
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
                  value={profile.overview}
                  onChange={(e) => setProfile({ ...profile, overview: e.target.value })}
                  placeholder="Enter profile overview"
                  rows={4}
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
        </CardContent>
      </Card>

      <div className="flex justify-between items-center space-x-4">
        <DeleteProfileDialog 
          profileId={profile.id}
          profileName={profile.fullName}
          countryCode={countryCode}
        />
        <Button type="submit" disabled={isLoading || isGenerating}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
} 