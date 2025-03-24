
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, CloudLightning, Github, Globe, Key, Languages, Moon, Save, Sun, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your application settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
            <TabsTrigger value="general">
              <User className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Sun className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="models">
              <Bot className="h-4 w-4 mr-2" />
              AI Models
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue placeholder="Select Time Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                      <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                      <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <p className="text-muted-foreground text-sm">
                      Automatically save your work as you go
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="session-timeout" className="w-full">
                      <SelectValue placeholder="Select Session Timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-sm">
                    Your session will expire after the selected time of inactivity
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-primary">
                        <Sun className="h-6 w-6" />
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-primary border-primary">
                        <Moon className="h-6 w-6" />
                        <span className="text-sm">Dark</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-primary">
                        <div className="h-6 w-6 flex">
                          <div className="w-1/2 flex items-center justify-center bg-black rounded-l-full">
                            <Moon className="h-4 w-4 text-white" />
                          </div>
                          <div className="w-1/2 flex items-center justify-center bg-white rounded-r-full border-r border-y">
                            <Sun className="h-4 w-4 text-black" />
                          </div>
                        </div>
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="density">Compact Mode</Label>
                      <p className="text-muted-foreground text-sm">
                        Use less space in the user interface
                      </p>
                    </div>
                    <Switch id="density" />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size" className="w-full">
                        <SelectValue placeholder="Select Font Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="animation">Animations</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger id="animation" className="w-full">
                        <SelectValue placeholder="Select Animation Setting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="reduced">Reduced</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-sm">
                      Control the level of animations in the interface
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for various services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                      <Badge variant="outline">
                        <CloudLightning className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input type="password" id="openai-api-key" value="sk-•••••••••••••••••••••••••••••••" disabled />
                      <Button variant="outline">Reset</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used for AI chat completions and code generation
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="google-api-key">Google API Key</Label>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input type="password" id="google-api-key" placeholder="Enter your Google API key" />
                      <Button variant="outline">Connect</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used for document processing and OCR capabilities
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="github-api-key">GitHub Integration</Label>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Button variant="outline" className="w-full">
                        <Github className="h-4 w-4 mr-2" />
                        Connect GitHub
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Connect to GitHub for version control and code sharing
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="models" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Settings</CardTitle>
                <CardDescription>Configure AI models and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chat-model">Chat Completion Model</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger id="chat-model" className="w-full">
                        <SelectValue placeholder="Select AI Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select defaultValue="0.7">
                          <SelectTrigger id="temperature">
                            <SelectValue placeholder="Temperature" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.2">0.2 - More focused</SelectItem>
                            <SelectItem value="0.5">0.5 - Balanced</SelectItem>
                            <SelectItem value="0.7">0.7 - Default</SelectItem>
                            <SelectItem value="0.9">0.9 - More creative</SelectItem>
                            <SelectItem value="1.0">1.0 - Maximum creativity</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Controls randomness: lower values are more deterministic
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Maximum Length</Label>
                      <Select defaultValue="2000">
                        <SelectTrigger id="max-tokens">
                          <SelectValue placeholder="Maximum Length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512">512 tokens</SelectItem>
                          <SelectItem value="1024">1024 tokens</SelectItem>
                          <SelectItem value="2000">2000 tokens</SelectItem>
                          <SelectItem value="4000">4000 tokens</SelectItem>
                          <SelectItem value="8000">8000 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Maximum number of tokens in generated responses
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="embedding-model">Embedding Model</Label>
                    <Select defaultValue="text-embedding-3-small">
                      <SelectTrigger id="embedding-model" className="w-full">
                        <SelectValue placeholder="Select Embedding Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                        <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
                        <SelectItem value="custom">Custom Embedding Model</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Used for document similarity and search capabilities
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="local-models">Use Local Models When Available</Label>
                      <Switch id="local-models" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use local models for offline processing when possible to reduce API costs
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-vision">Enable Vision Features</Label>
                      <Switch id="enable-vision" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allow AI models to process images and visual content
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
