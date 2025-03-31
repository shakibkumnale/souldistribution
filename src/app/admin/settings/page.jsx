// src/app/admin/settings/page.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const metadata = {
  title: 'Settings | Soul Distribution',
  description: 'Configure website settings and user preferences',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your distribution website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="Soul Distribution" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" defaultValue="contact@souldistribution.com" type="email" className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  defaultValue="Distribute your music worldwide with Soul Distribution! We provide affordable and transparent music distribution with full support."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="siteLogo">Site Logo</Label>
                  <Input id="siteLogo" type="file" accept="image/*" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input id="favicon" type="file" accept="image/*" className="mt-1" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableFeaturedArtists">Enable Featured Artists</Label>
                  <Switch id="enableFeaturedArtists" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableInstagramFeed">Enable Instagram Feed</Label>
                  <Switch id="enableInstagramFeed" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableYouTubeVideos">Enable YouTube Videos</Label>
                  <Switch id="enableYouTubeVideos" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Configure API keys for various services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="spotifyClientId">Spotify Client ID</Label>
                  <Input id="spotifyClientId" placeholder="Enter your Spotify Client ID" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="spotifyClientSecret">Spotify Client Secret</Label>
                  <Input id="spotifyClientSecret" type="password" placeholder="Enter your Spotify Client Secret" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="youtubeApiKey">YouTube API Key</Label>
                  <Input id="youtubeApiKey" type="password" placeholder="Enter your YouTube API Key" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="instagramToken">Instagram Access Token</Label>
                  <Input id="instagramToken" type="password" placeholder="Enter your Instagram Access Token" className="mt-1" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">Save API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Full Name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Email Address" className="mt-1" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Current Password" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="New Password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm Password" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">Update Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}