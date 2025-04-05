import React, { useState, useEffect } from 'react';
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
import { Mail, FileText, User, Upload, Save, Bell, Shield, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getProfile, updateProfile, Profile as ProfileType } from '@/lib/profile-service';
import { useAuth } from '@/lib/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<ProfileType & {
    notifications?: {
      email: boolean;
      marketing: boolean;
      updates: boolean;
      comments: boolean;
    };
    plan?: string;
  }>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    job_title: '',
    company: '',
    bio: '',
    notifications: {
      email: true,
      marketing: false,
      updates: true,
      comments: true
    },
    plan: 'free'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  
  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getProfile();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile information');
          return;
        }
        
        if (data) {
          // Transform the data to match our expected format
          const profileData = {
            id: data.id,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || user?.email || '',
            job_title: data.job_title || '',
            company: data.company || '',
            bio: data.bio || '',
            // Keep notification preferences and plan (these might be added to the profile table later)
            notifications: {
              email: true,
              marketing: false,
              updates: true,
              comments: true
            },
            plan: 'free'
          };
          
          setUserData(profileData);
          setFormData(profileData);
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
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
        ...prev.notifications!,
        [field]: value
      }
    }));
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      // Extract only the fields we want to update in Supabase
      const { data, error } = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        job_title: formData.job_title,
        company: formData.company,
        bio: formData.bio
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
        return;
      }
      
      setUserData(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Unexpected error saving profile:', err);
      toast.error('An unexpected error occurred while saving your profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    toast.error('This is a demo - account deletion is not implemented');
  };
  
  if (loading && !isEditing) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
                      <AvatarImage src="" alt={`${userData.first_name} ${userData.last_name}`} />
                      <AvatarFallback className="text-2xl">
                        {userData.first_name?.charAt(0) || ''}{userData.last_name?.charAt(0) || ''}
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
                        <Label htmlFor="first_name">First Name</Label>
                        <Input 
                          id="first_name" 
                          name="first_name"
                          value={isEditing ? formData.first_name : userData.first_name} 
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input 
                          id="last_name" 
                          name="last_name"
                          value={isEditing ? formData.last_name : userData.last_name} 
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
                          value={userData.email} 
                          disabled={true}
                          type="email"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="job_title">Job Title</Label>
                        <Input 
                          id="job_title" 
                          name="job_title"
                          value={isEditing ? formData.job_title : userData.job_title} 
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
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
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
                      checked={formData.notifications?.email}
                      onCheckedChange={(checked) => handleSwitchChange('email', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                      <p className="text-muted-foreground text-sm">
                        Receive emails about new features and promotions
                      </p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={formData.notifications?.marketing}
                      onCheckedChange={(checked) => handleSwitchChange('marketing', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="updates-notifications">Product Updates</Label>
                      <p className="text-muted-foreground text-sm">
                        Get notified about important product updates
                      </p>
                    </div>
                    <Switch
                      id="updates-notifications"
                      checked={formData.notifications?.updates}
                      onCheckedChange={(checked) => handleSwitchChange('updates', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Notification preferences updated')}>
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
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-muted-foreground text-sm">
                    Update your password for added security
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button className="mt-4" onClick={() => toast.success('Password changed successfully')}>
                    Change Password
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                  <p className="text-muted-foreground text-sm">
                    Permanently delete your account and all data
                  </p>
                  <Button variant="destructive" className="mt-4" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
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
