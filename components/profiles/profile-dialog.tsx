"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Trash2, Sparkles, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockCountries } from "@/lib/mock-data"
import { generateEducationWithAI, generateOverviewWithAI } from "@/lib/ai-services"

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

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Partial<Profile>
  onSave: (profile: Partial<Profile>) => Promise<void>
  isNew?: boolean
  countryCode?: string
}

export default function ProfileDialog({
  open,
  onOpenChange,
  profile: initialProfile,
  onSave,
  isNew = false,
  countryCode,
}: ProfileDialogProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (open) {
      setProfile(initialProfile)
    }
  }, [open, initialProfile])

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
      await onSave(profile)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCountryName = (code: string | undefined) => {
    if (!code) return ''
    const country = mockCountries.find(c => c.code === code)
    return country ? country.name : code.toUpperCase()
  }

  // Generate profile data with AI (excluding image)
  const generateProfileWithAI = async (section?: 'education' | 'overview' | 'all') => {
    if (!profile.fullName) return
    
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
    } catch (error) {
      console.error("Error generating profile data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate initials for avatar placeholder
  const getInitials = (name: string | undefined) => {
    if (!name) return "?"
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Profile" : "Edit Profile"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-36 w-36 rounded-lg overflow-hidden bg-muted">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.fullName || "Profile image"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-secondary">
                    <span className="text-3xl font-semibold text-secondary-foreground">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="profileImage" className="block mb-2 text-sm">Profile Image</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('profileImage')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a professional photo
                </p>
                {profile.imageUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setProfile({ ...profile, imageUrl: "" })}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName || ""}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profile.position || ""}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    placeholder="Enter position"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Profile Type</Label>
                <Select
                  value={profile.type || "non-ambassador"}
                  onValueChange={(value: "ambassador" | "non-ambassador") =>
                    setProfile({ ...profile, type: value })
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
                    disabled={isGenerating || !profile.fullName}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="education"
                  value={profile.education || ""}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
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
                    disabled={isGenerating || !profile.fullName}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="overview"
                  value={profile.overview || ""}
                  onChange={(e) => setProfile({ ...profile, overview: e.target.value })}
                  placeholder="Enter profile overview"
                  rows={3}
                />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => generateProfileWithAI('all')}
                disabled={isGenerating || !profile.fullName}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Generate Text Fields with AI
                {isGenerating && "..."}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isGenerating || !profile.fullName || !profile.position}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 