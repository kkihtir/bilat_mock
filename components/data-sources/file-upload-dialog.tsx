"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon as UploadCheck } from "lucide-react"

interface FileUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  dataSourceName: string
  dataSourceId: string
  onUploadComplete: (dataSourceId: string) => void
}

export default function FileUploadDialog({
  isOpen,
  onClose,
  dataSourceName,
  dataSourceId,
  onUploadComplete,
}: FileUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
      onUploadComplete(dataSourceId)

      // Reset state and close dialog after a delay
      setTimeout(() => {
        setFile(null)
        setUploadSuccess(false)
        onClose()
      }, 1500)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a file for <strong>{dataSourceName}</strong> data source.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" onChange={handleFileChange} disabled={isUploading || uploadSuccess} />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: {file.name} ({file.size} bytes)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={!file || isUploading || uploadSuccess}>
            {isUploading ? (
              "Uploading..."
            ) : uploadSuccess ? (
              <>
                <UploadCheck className="mr-2 h-4 w-4" />
                Uploaded!
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

