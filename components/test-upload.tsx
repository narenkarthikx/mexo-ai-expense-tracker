"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function TestUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("File selected in test component:", file)
    
    if (file) {
      setSelectedFile(file)
      toast({
        title: "File Selected!",
        description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const triggerFileSelect = () => {
    console.log("Trigger file select clicked")
    console.log("Input ref:", fileInputRef.current)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      toast({
        title: "Error",
        description: "File input not found",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">🧪 File Upload Test</h3>
      
      {/* Method 1: Direct input (visible) */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Method 1: Direct Visible Input</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block"
          />
        </div>

        {/* Method 2: Hidden input with ref */}
        <div>
          <label className="block text-sm font-medium mb-2">Method 2: Hidden Input + Ref</label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button onClick={triggerFileSelect} variant="outline">
            Select File (Hidden Input)
          </Button>
        </div>

        {/* Method 3: Label for approach */}
        <div>
          <label className="block text-sm font-medium mb-2">Method 3: Label For</label>
          <Input
            id="test-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="test-file-input">
            <Button variant="outline" className="cursor-pointer">
              Select File (Label For)
            </Button>
          </label>
        </div>

        {/* File Info */}
        <div className="p-3 bg-muted rounded">
          <h4 className="font-medium">Selected File Info:</h4>
          {selectedFile ? (
            <div className="text-sm mt-2">
              <p>Name: {selectedFile.name}</p>
              <p>Type: {selectedFile.type}</p>
              <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>Last Modified: {new Date(selectedFile.lastModified).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No file selected</p>
          )}
        </div>
      </div>
    </div>
  )
}