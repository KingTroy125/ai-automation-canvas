import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Code, Copy, Wand2, Settings2, Download, ClipboardCopy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { generateCode, getAvailableModels, testBackendConnection } from '@/lib/api';

interface Model {
  id: string;
  name: string;
  provider: string;
}

const CodeGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('react');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [availableModels, setAvailableModels] = useState<Model[]>([
    { id: 'auto', name: 'Auto (Default)', provider: 'auto' }
  ]);
  const [usedModel, setUsedModel] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [includeComments, setIncludeComments] = useState(false);
  const [codeLength, setCodeLength] = useState(1); // 1 = Normal, 0 = Concise, 2 = Detailed
  const [error, setError] = useState<string | null>(null);

  // Test backend connection and fetch models
  useEffect(() => {
    // Test backend connection first
    const checkBackendConnection = async () => {
      setError('Connecting to AI service...');
      const connectionTest = await testBackendConnection();
      if (!connectionTest.success) {
        console.error('Backend connection failed:', connectionTest.error);
        setError('Could not connect to AI service. Check if the backend is running.');
        return false;
      }
      console.log('Backend connection successful');
      setError(null);
      return true;
    };

    const fetchModels = async () => {
      try {
        const isConnected = await checkBackendConnection();
        if (!isConnected) {
          // Set default models as fallback
          setAvailableModels([
            { id: 'auto', name: 'Auto (Default)', provider: 'auto' },
            { id: 'mock', name: 'Mock Model', provider: 'mock' }
          ]);
          return;
        }
        
        const data = await getAvailableModels();
        if (data && data.models && data.models.length > 0) {
          // Make sure 'auto' is always included
          if (!data.models.some(m => m.id === 'auto')) {
            data.models.unshift({ id: 'auto', name: 'Auto (Default)', provider: 'auto' });
          }
          
          setAvailableModels(data.models);
          
          // Set a default model if one is available
          if (!selectedModel || selectedModel === 'auto') {
            const defaultModel = data.models.find(m => m.provider === 'anthropic') 
              || data.models.find(m => m.provider === 'openai') 
              || data.models[0];
            
            setSelectedModel(defaultModel.id);
          }
        } else {
          // Fallback for empty models array
          setAvailableModels([
            { id: 'auto', name: 'Auto (Default)', provider: 'auto' },
            { id: 'mock', name: 'Mock Model', provider: 'mock' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load available models. Please check if the backend is running.');
        
        // Fallback for complete failure
        setAvailableModels([
          { id: 'auto', name: 'Auto (Default)', provider: 'auto' },
          { id: 'mock', name: 'Mock Model', provider: 'mock' }
        ]);
      }
    };

    fetchModels();
  }, []);

  const getFrameworkOptions = (lang: string) => {
    switch(lang) {
      case 'javascript':
      case 'typescript':
        return [
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'nextjs', label: 'Next.js' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      case 'html':
        return [
          { value: 'bootstrap', label: 'Bootstrap' },
          { value: 'tailwind', label: 'Tailwind CSS' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      case 'css':
        return [
          { value: 'tailwind', label: 'Tailwind CSS' },
          { value: 'sass', label: 'SASS/SCSS' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      case 'python':
        return [
          { value: 'django', label: 'Django' },
          { value: 'flask', label: 'Flask' },
          { value: 'fastapi', label: 'FastAPI' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      case 'java':
        return [
          { value: 'spring', label: 'Spring' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      case 'csharp':
        return [
          { value: 'aspnet', label: 'ASP.NET' },
          { value: 'none', label: 'None (Vanilla)' }
        ];
      default:
        return [
          { value: 'none', label: 'None' }
        ];
    }
  };

  // Update framework when language changes
  useEffect(() => {
    const frameworkOptions = getFrameworkOptions(language);
    if (!frameworkOptions.find(option => option.value === framework)) {
      setFramework(frameworkOptions[0].value);
    }
  }, [language]);

  const handleGenerateCode = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setGeneratedCode('');
    setError(null);
    
    try {
      const data = await generateCode(
        prompt, 
        selectedModel, 
        language || undefined
      );
      
      setGeneratedCode(data.code);
      setUsedModel(data.model || selectedModel);
    } catch (err) {
      console.error('Error generating code:', err);
      setError(`Failed to generate code: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getModelDisplayName = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) return model.name;
    
    // Fallback names
    if (modelId.includes('claude-3-5')) return 'Claude 3.5 Sonnet';
    if (modelId.includes('claude-3')) return 'Claude 3 Sonnet';
    if (modelId.includes('gpt-4-turbo')) return 'GPT-4 Turbo';
    if (modelId.includes('gpt-4')) return 'GPT-4';
    if (modelId.includes('gpt-3.5')) return 'GPT-3.5 Turbo';
    if (modelId.includes('deepseek-chat')) return 'DeepSeek Chat';
    if (modelId.includes('deepseek-coder')) return 'DeepSeek Coder';
    if (modelId.includes('deepseek-v3')) return 'DeepSeek v3';
    
    return modelId;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied",
      description: "Code copied to clipboard"
    });
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      html: 'html',
      css: 'css'
    };
    
    const extension = extensions[language] || 'txt';
    const fileName = `generated_code.${extension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `Code saved as ${fileName}`
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Generation</h1>
          <p className="text-muted-foreground mt-2">
            Generate code snippets for various languages and frameworks using AI
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Describe what you want to build</label>
                  <Textarea 
                    placeholder="E.g., Create a React button component with hover effects and loading state"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Framework</label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFrameworkOptions(language).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">AI Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Default)</SelectItem>
                      
                      {availableModels.filter(m => m.provider === 'anthropic' && m.id !== 'auto').length > 0 && (
                        <SelectItem value="divider-anthropic" disabled>
                          --- Anthropic ---
                        </SelectItem>
                      )}
                      
                      {availableModels
                        .filter(model => model.provider === 'anthropic' && model.id !== 'auto')
                        .map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      
                      {availableModels.filter(m => m.provider === 'openai').length > 0 && (
                        <SelectItem value="divider-openai" disabled>
                          --- OpenAI ---
                        </SelectItem>
                      )}
                      
                      {availableModels
                        .filter(model => model.provider === 'openai')
                        .map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-1"
                  >
                    <Settings2 className="h-4 w-4" />
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                </div>
                
                {showAdvancedOptions && (
                  <div className="space-y-4 p-4 bg-secondary/20 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="comments">Include Comments</Label>
                        <p className="text-xs text-muted-foreground">
                          Add explanatory comments to the generated code
                        </p>
                      </div>
                      <Switch
                        id="comments"
                        checked={includeComments}
                        onCheckedChange={setIncludeComments}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="code-length">Code Length</Label>
                        <span className="text-xs text-muted-foreground">
                          {codeLength === 0 ? 'Concise' : codeLength === 1 ? 'Normal' : 'Detailed'}
                        </span>
                      </div>
                      <Slider
                        id="code-length"
                        min={0}
                        max={2}
                        step={1}
                        value={[codeLength]}
                        onValueChange={(value) => setCodeLength(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Concise</span>
                        <span>Normal</span>
                        <span>Detailed</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleGenerateCode} 
                  className="w-full" 
                  disabled={isLoading || !prompt.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoading ? 'Generating...' : 'Generate Code'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <div className="flex items-center gap-2">
                  {usedModel && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {getModelDisplayName(usedModel)}
                    </span>
                  )}
                {generatedCode && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={downloadCode} title="Download code">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy to clipboard">
                        <ClipboardCopy className="h-4 w-4" />
                  </Button>
                    </div>
                )}
                </div>
              </div>
              <div className="relative bg-zinc-950 rounded-md overflow-hidden">
                {error ? (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
                    <h3 className="font-bold">Connection Error</h3>
                    <p>{error}</p>
                    <button 
                      className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                      onClick={async () => {
                        const connectionTest = await testBackendConnection();
                        if (connectionTest.success) {
                          setError(null);
                          getAvailableModels().then(data => {
                            if (data && data.models) {
                              setAvailableModels(data.models);
                            }
                          });
                        } else {
                          setError(`Still unable to connect: ${connectionTest.error}`);
                        }
                      }}
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : (
                  generatedCode ? (
                    <pre className="p-4 text-zinc-100 overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
                      <Code className="h-12 w-12 mb-2 opacity-20" />
                      <p>Generated code will appear here</p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeGeneration;
