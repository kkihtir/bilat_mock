"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import ProfileDialog from "@/components/profiles/profile-dialog"

export default function ProfileDialogExample() {
  const [open, setOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<any>({
    country: "us",
    type: "non-ambassador"
  })

  const handleSaveProfile = async (profile: any) => {
    // In a real application, you would save the profile to your database
    console.log("Saving profile:", profile)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Success! The dialog will close automatically
    setEditingProfile(profile) // Update the local state with the saved profile
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile Dialog Example</h2>
        <p className="text-muted-foreground mb-4">
          This example shows how to use the ProfileDialog component to add or edit profiles.
          The dialog now uses initials for avatar placeholders instead of stock images.
        </p>
      </div>
      
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Profile
      </Button>
      
      {editingProfile.fullName && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="font-medium mb-2">Current Profile:</h3>
          <p><strong>Name:</strong> {editingProfile.fullName}</p>
          <p><strong>Position:</strong> {editingProfile.position}</p>
          <p><strong>Type:</strong> {editingProfile.type}</p>
        </div>
      )}
      
      <ProfileDialog
        open={open}
        onOpenChange={setOpen}
        profile={editingProfile}
        onSave={handleSaveProfile}
        isNew={true}
        countryCode="us"
      />
    </div>
  )
} 