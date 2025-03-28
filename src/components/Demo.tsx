import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import GlassMorphism from './ui/GlassMorphism';
import AnimatedGradient from './ui/AnimatedGradient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, FileText, Bot, Workflow,
  ChevronLeft, ChevronRight, Layout
} from 'lucide-react';

interface DemoStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode;
}

const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    
    const elements = demoRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const demoSteps: DemoStep[] = [
    {
      id: "input",
      icon: <FileText className="h-5 w-5" />,
      title: "Describe Your Needs",
      description: "Upload files or describe what you need in natural language.",
      content: (
        <div className="space-y-4">
          <div className="h-64 bg-muted/30 rounded-md border border-border flex items-center justify-center">
            <div className="text-center p-6">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Drag and drop files or describe your requirements
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm">Upload Files</Button>
          </div>
        </div>
      )
    },
    {
      id: "analyze",
      icon: <BrainCircuit className="h-5 w-5" />,
      title: "AI Analysis",
      description: "Our AI analyzes your request and suggests optimal solutions.",
      content: (
        <div className="space-y-4">
          <div className="h-64 bg-muted/30 rounded-md border border-border p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Analyzing requirements...</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">Identifying optimal approach...</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-md">
                <p className="text-sm">Recommended solution: Web application with React frontend and API integration</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "generate",
      icon: <Code className="h-5 w-5" />,
      title: "Code Generation",
      description: "Generate high-quality, customized code for your solution.",
      content: (
        <div className="space-y-4">
          <div className="h-64 bg-background rounded-md border border-border overflow-hidden">
            <div className="bg-muted/50 px-3 py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">App.jsx</span>
            </div>
            <div className="p-4 font-mono text-xs overflow-y-auto h-[calc(100%-32px)]">
              <pre className="text-left">
                <code className="text-foreground">
{`import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { fetchData } from './api';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = async () => {
    const data = await fetchData(query);
    setResults(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        AI-Powered Search
      </h1>
      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
        />
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      <div className="space-y-4">
        {results.map((result) => (
          <ResultCard key={result.id} {...result} />
        ))}
      </div>
    </div>
  );
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "customize",
      icon: <Workflow className="h-5 w-5" />,
      title: "Customization",
      description: "Refine and customize your solution with AI-guided iterations.",
      content: (
        <div className="space-y-4">
          <Tabs defaultValue="workflow" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="ui">UI/UX</TabsTrigger>
            </TabsList>
            <TabsContent value="workflow" className="h-56">
              <GlassMorphism className="p-4 h-full">
                <div className="flex flex-col h-full justify-center items-center">
                  <Workflow className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-sm text-muted-foreground">
                    Customize automation workflow and integrations
                  </p>
                </div>
              </GlassMorphism>
            </TabsContent>
            <TabsContent value="code" className="h-56">
              <GlassMorphism className="p-4 h-full">
                <div className="flex flex-col h-full justify-center items-center">
                  <Code className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-sm text-muted-foreground">
                    Refine generated code and optimize performance
                  </p>
                </div>
              </GlassMorphism>
            </TabsContent>
            <TabsContent value="ui" className="h-56">
              <GlassMorphism className="p-4 h-full">
                <div className="flex flex-col h-full justify-center items-center">
                  <Layout className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-center text-sm text-muted-foreground">
                    Customize UI elements and user experience
                  </p>
                </div>
              </GlassMorphism>
            </TabsContent>
          </Tabs>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, demoSteps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section id="demo" className="py-20 px-4 relative overflow-hidden" ref={demoRef}>
      {/* Background gradient */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll opacity-0">
            See It In <span className="text-gradient">Action</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-on-scroll opacity-0 animate-delay-200">
            Experience how our AI agent transforms your requirements into functional solutions.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto animate-on-scroll opacity-0 animate-delay-300">
          <GlassMorphism className="p-6" intensity="medium">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {demoSteps[currentStep].icon}
                  {demoSteps[currentStep].title}
                </h3>
                <GlassMorphism className="px-3 py-1 rounded-full" intensity="light">
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {demoSteps.length}
                  </div>
                </GlassMorphism>
              </div>
              <p className="text-muted-foreground">{demoSteps[currentStep].description}</p>
            </div>
            
            <div className="mb-6">
              {demoSteps[currentStep].content}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button 
                onClick={nextStep}
                disabled={currentStep === demoSteps.length - 1}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </GlassMorphism>
        </div>
      </div>
    </section>
  );
};

export default Demo;

const BrainCircuit: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
      <path d="m15.7 10.4-.9.4" />
      <path d="m9.2 13.2.9-.4" />
      <path d="m12.8 7.7-.4.9" />
      <path d="m11.6 16.4.4-.9" />
      <path d="m7.7 11.2.9.4" />
      <path d="m16.3 13.9-.9-.4" />
      <path d="m13.9 7.7.4.9" />
      <path d="m10.1 16.4-.4-.9" />
      <path d="M12 12v.01" />
    </svg>
  );
};