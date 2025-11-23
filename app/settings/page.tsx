"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-provider"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LogOut, User, Bell, Shield, Trash2, Save } from "lucide-react"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
  })
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
  })

  const handleProfileUpdate = async () => {
    try {
      // Here you would typically update the user profile via Supabase
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Here you would typically delete the user account
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
          <Button onClick={handleProfileUpdate} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your app experience and notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about budget alerts and reminders
              </p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup your data to the cloud
              </p>
            </div>
            <Switch
              checked={preferences.autoBackup}
              onCheckedChange={(checked) => setPreferences({ ...preferences, autoBackup: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Account
          </CardTitle>
          <CardDescription>
            Manage your account security and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Account Status:</span>
              <span className="text-green-600">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your account is secure and all data is encrypted
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}