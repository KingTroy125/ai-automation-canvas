
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Copy, Pencil, Plus, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  instructions: string;
  category: string;
  isActive: boolean;
}

const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Research Assistant',
    description: 'Helps with gathering information and summarizing research topics',
    avatar: '',
    instructions: 'You are a helpful research assistant. Your goal is to provide accurate information on any topic and help summarize complex topics in simple terms.',
    category: 'research',
    isActive: true
  },
  {
    id: '2',
    name: 'Content Writer',
    description: 'Creates blog posts, social media content, and marketing copy',
    avatar: '',
    instructions: 'You are a creative content writer. Your goal is to produce engaging and well-written content for various platforms including blogs, social media, and marketing materials.',
    category: 'writing',
    isActive: true
  },
  {
    id: '3',
    name: 'Data Analyst',
    description: 'Analyzes and interprets data to extract valuable insights',
    avatar: '',
    instructions: 'You are a skilled data analyst. Your goal is to analyze complex datasets and provide meaningful insights and visualizations.',
    category: 'analysis',
    isActive: false
  },
];

const AIAgents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    description: '',
    instructions: '',
    category: 'general',
    isActive: true
  });
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name || '',
      description: newAgent.description || '',
      instructions: newAgent.instructions || '',
      category: newAgent.category || 'general',
      avatar: '',
      isActive: newAgent.isActive !== undefined ? newAgent.isActive : true
    };

    setAgents([...agents, agent]);
    setNewAgent({
      name: '',
      description: '',
      instructions: '',
      category: 'general',
      isActive: true
    });
    setCreateDialogOpen(false);
    toast.success('Agent created successfully');
  };

  const handleUpdateAgent = () => {
    if (!editingAgent) return;

    const updatedAgents = agents.map(agent => 
      agent.id === editingAgent.id ? editingAgent : agent
    );
    
    setAgents(updatedAgents);
    setEditingAgent(null);
    toast.success('Agent updated successfully');
  };

  const handleDeleteAgent = (id: string) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    setAgents(updatedAgents);
    toast.success('Agent deleted successfully');
  };

  const toggleAgentStatus = (id: string) => {
    const updatedAgents = agents.map(agent => 
      agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
    );
    
    setAgents(updatedAgents);
    
    const agent = agents.find(a => a.id === id);
    toast.success(`Agent ${agent?.name} ${agent?.isActive ? 'deactivated' : 'activated'}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research':
        return <Bot className="h-4 w-4 text-blue-500" />;
      case 'writing':
        return <Pencil className="h-4 w-4 text-green-500" />;
      case 'analysis':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage custom AI agents for specific tasks
            </p>
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
                <DialogDescription>
                  Configure your AI agent to perform specific tasks
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input 
                    id="name" 
                    value={newAgent.name || ''} 
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    placeholder="e.g., Research Assistant" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={newAgent.description || ''} 
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                    placeholder="e.g., Helps with gathering information and summarizing research topics" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newAgent.category || 'general'} 
                    onValueChange={(value) => setNewAgent({...newAgent, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    value={newAgent.instructions || ''} 
                    onChange={(e) => setNewAgent({...newAgent, instructions: e.target.value})}
                    placeholder="Provide detailed instructions about how the agent should behave and respond"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active-status" 
                    checked={newAgent.isActive} 
                    onCheckedChange={(checked) => setNewAgent({...newAgent, isActive: checked})}
                  />
                  <Label htmlFor="active-status">Active Status</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAgent}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Create Agent
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map(agent => (
            <Card key={agent.id} className={`border ${!agent.isActive ? 'border-muted bg-muted/50' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getCategoryIcon(agent.category)}
                      <span className="ml-1 capitalize">{agent.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Switch 
                    id={`toggle-${agent.id}`}
                    checked={agent.isActive}
                    onCheckedChange={() => toggleAgentStatus(agent.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 h-10">{agent.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingAgent(agent)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Agent</DialogTitle>
                      <DialogDescription>
                        Update your AI agent's configuration
                      </DialogDescription>
                    </DialogHeader>
                    
                    {editingAgent && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Agent Name</Label>
                          <Input 
                            id="edit-name" 
                            value={editingAgent.name} 
                            onChange={(e) => setEditingAgent({...editingAgent, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input 
                            id="edit-description" 
                            value={editingAgent.description} 
                            onChange={(e) => setEditingAgent({...editingAgent, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Select 
                            value={editingAgent.category} 
                            onValueChange={(value) => setEditingAgent({...editingAgent, category: value})}
                          >
                            <SelectTrigger id="edit-category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="research">Research</SelectItem>
                              <SelectItem value="writing">Writing</SelectItem>
                              <SelectItem value="analysis">Analysis</SelectItem>
                              <SelectItem value="coding">Coding</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-instructions">Instructions</Label>
                          <Textarea 
                            id="edit-instructions" 
                            value={editingAgent.instructions} 
                            onChange={(e) => setEditingAgent({...editingAgent, instructions: e.target.value})}
                            className="min-h-[100px]"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="edit-active-status" 
                            checked={editingAgent.isActive} 
                            onCheckedChange={(checked) => setEditingAgent({...editingAgent, isActive: checked})}
                          />
                          <Label htmlFor="edit-active-status">Active Status</Label>
                        </div>
                      </div>
                    )}
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingAgent(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateAgent}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAgents;
