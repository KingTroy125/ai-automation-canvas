
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Code, 
  FileText, 
  MessageSquare, 
  Workflow,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, path }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="group hover:border-primary/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4">{description}</CardDescription>
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary/10 transition-colors"
          onClick={() => navigate(path)}
        >
          Launch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to AI Agent</h1>
          <p className="text-muted-foreground mt-2">
            Choose from our AI-powered tools to start your project
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            title="Chat Assistant"
            description="Intelligent conversational AI to answer your questions and provide guidance."
            icon={<MessageSquare className="h-6 w-6" />}
            path="/dashboard/chat"
          />
          <ToolCard
            title="Code Generation"
            description="AI-powered code generator for multiple programming languages and frameworks."
            icon={<Code className="h-6 w-6" />}
            path="/dashboard/code-generation"
          />
          <ToolCard
            title="Document Analysis"
            description="Extract insights and information from documents, PDFs, and images."
            icon={<FileText className="h-6 w-6" />}
            path="/dashboard/documents"
          />
          <ToolCard
            title="AI Agents"
            description="Build custom AI agents for specific tasks and workflows."
            icon={<Bot className="h-6 w-6" />}
            path="/dashboard/agents"
          />
          <ToolCard
            title="Workflow Automation"
            description="Create automated workflows connecting multiple services and APIs."
            icon={<Workflow className="h-6 w-6" />}
            path="/dashboard/workflows"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
