
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, FileText, User, Upload, Save, Bell, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    avatar: '',
    jobTitle: 'Product Manager',
    company: 'TechCorp',
    bio: 'Passionate about building AI-powered products that help people be more productive.',
    plan: 'professional',
    notifications: {
      email: true,
      marketing: false,
      updates: true,
      comments: true
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };
  
  const handleSaveProfile = () => {
    setUserData(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleDeleteAccount = () => {
    toast.error('This is a demo - account deletion is not implemented');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Bell className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <div>
                    <Badge variant="secondary" className="ml-2">
                      {userData.plan === 'free' ? 'Free Plan' : 
                       userData.plan === 'professional' ? 'Professional Plan' : 
                       'Enterprise Plan'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} />
                      <AvatarFallback className="text-2xl">
                        {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={isEditing ? formData.firstName : userData.firstName} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={isEditing ? formData.lastName : userData.lastName} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex">
                        <Input 
                          id="email" 
                          name="email"
                          value={isEditing ? formData.email : userData.email} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          type="email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input 
                          id="jobTitle" 
                          name="jobTitle"
                          value={isEditing ? formData.jobTitle : userData.jobTitle} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          name="company"
                          value={isEditing ? formData.company : userData.company} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        name="bio"
                        value={isEditing ? formData.bio : userData.bio} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData(userData);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive email notifications about your account
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) => handleSwitchChange('email', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive emails about new features and promotions
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={formData.notifications.marketing}
                      onCheckedChange={(checked) => handleSwitchChange('marketing', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="update-notifications">Product Updates</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive notifications about product updates
                      </p>
                    </div>
                    <Switch
                      id="update-notifications"
                      checked={formData.notifications.updates}
                      onCheckedChange={(checked) => handleSwitchChange('updates', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="comment-notifications">Comments</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive notifications when someone comments on your content
                      </p>
                    </div>
                    <Switch
                      id="comment-notifications"
                      checked={formData.notifications.comments}
                      onCheckedChange={(checked) => handleSwitchChange('comments', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Update your password to keep your account secure
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
