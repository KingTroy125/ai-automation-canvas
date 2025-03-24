
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  Calendar,
  Check,
  FileText,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  Trash2,
  Workflow,
  XCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface WorkflowAction {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

interface WorkflowTrigger {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
  lastRun?: string;
}

const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Document Summarization',
    description: 'Automatically summarize uploaded documents and send them via email',
    trigger: {
      id: 't1',
      type: 'document_upload',
      name: 'New Document Upload',
      config: {
        fileTypes: ['pdf', 'docx', 'txt']
      }
    },
    actions: [
      {
        id: 'a1',
        type: 'analyze_document',
        name: 'Analyze Document',
        config: {
          extractSummary: true,
          extractKeywords: true
        }
      },
      {
        id: 'a2',
        type: 'send_email',
        name: 'Send Email Notification',
        config: {
          recipient: '{{user.email}}',
          subject: 'Document Summary: {{document.name}}',
          body: 'Here is your document summary: {{document.summary}}'
        }
      }
    ],
    isActive: true,
    lastRun: '2023-08-12T14:30:00Z'
  },
  {
    id: '2',
    name: 'Weekly Report Generator',
    description: 'Generates weekly reports based on data and sends them to team members',
    trigger: {
      id: 't2',
      type: 'schedule',
      name: 'Weekly Schedule',
      config: {
        frequency: 'weekly',
        day: 'friday',
        time: '16:00'
      }
    },
    actions: [
      {
        id: 'a3',
        type: 'generate_report',
        name: 'Generate Weekly Report',
        config: {
          dataSource: 'analytics_api',
          reportType: 'performance_summary'
        }
      },
      {
        id: 'a4',
        type: 'send_email',
        name: 'Send Email to Team',
        config: {
          recipient: 'team@example.com',
          subject: 'Weekly Performance Report',
          body: 'Please find attached the weekly performance report.',
          attachReport: true
        }
      }
    ],
    isActive: false
  }
];

const WorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [activeTab, setActiveTab] = useState('all');
  const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({
    name: '',
    description: '',
    trigger: {
      id: `t-${Date.now()}`,
      type: 'document_upload',
      name: 'New Document Upload',
      config: {
        fileTypes: ['pdf', 'docx', 'txt']
      }
    },
    actions: [],
    isActive: true
  });
  
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'analyze_document':
        return <FileText className="h-4 w-4" />;
      case 'send_email':
        return <Mail className="h-4 w-4" />;
      case 'generate_report':
        return <FileText className="h-4 w-4" />;
      case 'chat_message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'document_upload':
        return <FileText className="h-4 w-4" />;
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      case 'chat_message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  
  const handleAddAction = () => {
    const newAction: WorkflowAction = {
      id: `a-${Date.now()}`,
      type: 'analyze_document',
      name: 'Analyze Document',
      config: {
        extractSummary: true,
        extractKeywords: true
      }
    };
    
    setNewWorkflow({
      ...newWorkflow,
      actions: [...(newWorkflow.actions || []), newAction]
    });
  };
  
  const handleRemoveAction = (actionId: string) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: (newWorkflow.actions || []).filter(action => action.id !== actionId)
    });
  };
  
  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!(newWorkflow.actions || []).length) {
      toast.error('Please add at least one action to your workflow');
      return;
    }
    
    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWorkflow.name || '',
      description: newWorkflow.description || '',
      trigger: newWorkflow.trigger as WorkflowTrigger,
      actions: newWorkflow.actions || [],
      isActive: newWorkflow.isActive !== undefined ? newWorkflow.isActive : true
    };
    
    setWorkflows([...workflows, workflow]);
    
    setNewWorkflow({
      name: '',
      description: '',
      trigger: {
        id: `t-${Date.now()}`,
        type: 'document_upload',
        name: 'New Document Upload',
        config: {
          fileTypes: ['pdf', 'docx', 'txt']
        }
      },
      actions: [],
      isActive: true
    });
    
    setActiveTab('all');
    toast.success('Workflow created successfully');
  };
  
  const toggleWorkflowStatus = (id: string) => {
    const updatedWorkflows = workflows.map(workflow => 
      workflow.id === id ? { ...workflow, isActive: !workflow.isActive } : workflow
    );
    
    setWorkflows(updatedWorkflows);
    
    const workflow = workflows.find(w => w.id === id);
    toast.success(`Workflow ${workflow?.isActive ? 'deactivated' : 'activated'}`);
  };
  
  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
    toast.success('Workflow deleted successfully');
  };
  
  const filteredWorkflows = activeTab === 'all' 
    ? workflows 
    : activeTab === 'active' 
      ? workflows.filter(wf => wf.isActive) 
      : workflows.filter(wf => !wf.isActive);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
          <p className="text-muted-foreground mt-2">
            Create automated workflows connecting multiple services and APIs
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Workflows</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => setActiveTab('create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{workflow.name}</span>
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                      />
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Trigger</h4>
                        <div className="flex items-center p-2 bg-muted rounded-md">
                          {getTriggerIcon(workflow.trigger.type)}
                          <span className="ml-2 text-sm">{workflow.trigger.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Actions ({workflow.actions.length})</h4>
                        <div className="space-y-2">
                          {workflow.actions.map((action, index) => (
                            <div key={action.id} className="flex items-center p-2 bg-muted rounded-md">
                              {getActionIcon(action.type)}
                              <span className="ml-2 text-sm">{action.name}</span>
                              {index < workflow.actions.length - 1 && (
                                <ArrowRight className="mx-2 h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {workflow.lastRun && (
                        <div className="text-xs text-muted-foreground">
                          Last run: {new Date(workflow.lastRun).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Run Now
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredWorkflows.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Workflow className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No workflows found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'active' 
                      ? 'You have no active workflows' 
                      : activeTab === 'inactive' 
                        ? 'You have no inactive workflows' 
                        : 'Create your first workflow to automate your tasks'}
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab('create')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Active workflows will be shown by the filter */}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Inactive workflows will be shown by the filter */}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Workflow</CardTitle>
                <CardDescription>
                  Configure your automated workflow with triggers and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input 
                      id="workflow-name"
                      placeholder="e.g., Document Processing Workflow"
                      value={newWorkflow.name || ''}
                      onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workflow-description">Description</Label>
                    <Textarea 
                      id="workflow-description"
                      placeholder="Describe what this workflow does"
                      value={newWorkflow.description || ''}
                      onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Trigger</Label>
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        {getTriggerIcon(newWorkflow.trigger?.type || '')}
                        <h4 className="font-medium">When this happens...</h4>
                      </div>
                      
                      <Select 
                        value={newWorkflow.trigger?.type || 'document_upload'} 
                        onValueChange={(value) => {
                          let triggerName = 'New Document Upload';
                          let config = { fileTypes: ['pdf', 'docx', 'txt'] };
                          
                          if (value === 'schedule') {
                            triggerName = 'Weekly Schedule';
                            config = { frequency: 'weekly', day: 'monday', time: '09:00' };
                          } else if (value === 'chat_message') {
                            triggerName = 'New Chat Message';
                            config = { keywords: [] };
                          }
                          
                          setNewWorkflow({
                            ...newWorkflow,
                            trigger: {
                              id: newWorkflow.trigger?.id || `t-${Date.now()}`,
                              type: value,
                              name: triggerName,
                              config
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document_upload">Document Upload</SelectItem>
                          <SelectItem value="schedule">Schedule</SelectItem>
                          <SelectItem value="chat_message">Chat Message</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-4">
                        {newWorkflow.trigger?.type === 'document_upload' && (
                          <div className="space-y-2">
                            <Label htmlFor="trigger-name">Trigger Name</Label>
                            <Input 
                              id="trigger-name"
                              value={newWorkflow.trigger?.name || 'New Document Upload'}
                              onChange={(e) => setNewWorkflow({
                                ...newWorkflow,
                                trigger: {
                                  ...newWorkflow.trigger as WorkflowTrigger,
                                  name: e.target.value
                                }
                              })}
                            />
                          </div>
                        )}
                        
                        {newWorkflow.trigger?.type === 'schedule' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="trigger-name">Trigger Name</Label>
                              <Input 
                                id="trigger-name"
                                value={newWorkflow.trigger?.name || 'Weekly Schedule'}
                                onChange={(e) => setNewWorkflow({
                                  ...newWorkflow,
                                  trigger: {
                                    ...newWorkflow.trigger as WorkflowTrigger,
                                    name: e.target.value
                                  }
                                })}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="schedule-frequency">Frequency</Label>
                                <Select 
                                  value={(newWorkflow.trigger?.config as any)?.frequency || 'weekly'} 
                                  onValueChange={(value) => setNewWorkflow({
                                    ...newWorkflow,
                                    trigger: {
                                      ...newWorkflow.trigger as WorkflowTrigger,
                                      config: {
                                        ...newWorkflow.trigger?.config,
                                        frequency: value
                                      }
                                    }
                                  })}
                                >
                                  <SelectTrigger id="schedule-frequency">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {(newWorkflow.trigger?.config as any)?.frequency === 'weekly' && (
                                <div className="space-y-2">
                                  <Label htmlFor="schedule-day">Day</Label>
                                  <Select 
                                    value={(newWorkflow.trigger?.config as any)?.day || 'monday'} 
                                    onValueChange={(value) => setNewWorkflow({
                                      ...newWorkflow,
                                      trigger: {
                                        ...newWorkflow.trigger as WorkflowTrigger,
                                        config: {
                                          ...newWorkflow.trigger?.config,
                                          day: value
                                        }
                                      }
                                    })}
                                  >
                                    <SelectTrigger id="schedule-day">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="monday">Monday</SelectItem>
                                      <SelectItem value="tuesday">Tuesday</SelectItem>
                                      <SelectItem value="wednesday">Wednesday</SelectItem>
                                      <SelectItem value="thursday">Thursday</SelectItem>
                                      <SelectItem value="friday">Friday</SelectItem>
                                      <SelectItem value="saturday">Saturday</SelectItem>
                                      <SelectItem value="sunday">Sunday</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Actions</Label>
                      <Button variant="outline" size="sm" onClick={handleAddAction}>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Action
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] border rounded-md p-4">
                      {newWorkflow.actions && newWorkflow.actions.length > 0 ? (
                        <div className="space-y-4">
                          {newWorkflow.actions.map((action, index) => (
                            <div key={action.id} className="border rounded-md overflow-hidden">
                              <Collapsible>
                                <div className="flex items-center justify-between bg-muted p-2">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-background rounded-full h-6 w-6 flex items-center justify-center">
                                      {index + 1}
                                    </div>
                                    <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
                                      {getActionIcon(action.type)}
                                      <span>{action.name}</span>
                                    </CollapsibleTrigger>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveAction(action.id)}
                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8 p-0"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                                <CollapsibleContent>
                                  <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`action-${action.id}-name`}>Action Name</Label>
                                      <Input 
                                        id={`action-${action.id}-name`}
                                        value={action.name}
                                        onChange={(e) => {
                                          const updatedActions = newWorkflow.actions?.map(a => 
                                            a.id === action.id ? { ...a, name: e.target.value } : a
                                          );
                                          setNewWorkflow({...newWorkflow, actions: updatedActions});
                                        }}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor={`action-${action.id}-type`}>Action Type</Label>
                                      <Select 
                                        value={action.type} 
                                        onValueChange={(value) => {
                                          let config = {};
                                          let name = '';
                                          
                                          switch (value) {
                                            case 'analyze_document':
                                              name = 'Analyze Document';
                                              config = { extractSummary: true, extractKeywords: true };
                                              break;
                                            case 'send_email':
                                              name = 'Send Email Notification';
                                              config = { 
                                                recipient: '{{user.email}}',
                                                subject: 'Document Summary',
                                                body: 'Here is your document summary:'
                                              };
                                              break;
                                            case 'generate_report':
                                              name = 'Generate Report';
                                              config = { 
                                                reportType: 'summary',
                                                format: 'pdf' 
                                              };
                                              break;
                                            case 'chat_message':
                                              name = 'Send Chat Message';
                                              config = { 
                                                message: 'Your document has been processed',
                                                mention: false
                                              };
                                              break;
                                          }
                                          
                                          const updatedActions = newWorkflow.actions?.map(a => 
                                            a.id === action.id ? { ...a, type: value, name, config } : a
                                          );
                                          setNewWorkflow({...newWorkflow, actions: updatedActions});
                                        }}
                                      >
                                        <SelectTrigger id={`action-${action.id}-type`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="analyze_document">Analyze Document</SelectItem>
                                          <SelectItem value="send_email">Send Email</SelectItem>
                                          <SelectItem value="generate_report">Generate Report</SelectItem>
                                          <SelectItem value="chat_message">Send Chat Message</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <Settings className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                          <h3 className="text-lg font-medium">No actions configured</h3>
                          <p className="text-muted-foreground mt-1 mb-4">
                            Add at least one action to your workflow
                          </p>
                          <Button variant="outline" size="sm" onClick={handleAddAction}>
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Action
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="workflow-active"
                      checked={newWorkflow.isActive !== undefined ? newWorkflow.isActive : true}
                      onCheckedChange={(checked) => setNewWorkflow({...newWorkflow, isActive: checked})}
                    />
                    <Label htmlFor="workflow-active">Activate workflow immediately</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('all')}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkflow}>
                  <Check className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowAutomation;
