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
  const [showPreview, setShowPreview] = useState(false);

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
      <div className="space-y-8">
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
                    id="prompt-input"
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
              
              {/* Tabs for code view and live preview */}
              {generatedCode && !error ? (
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="code">
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Live Preview
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="mt-0">
                    <div className="relative bg-zinc-950 rounded-md overflow-hidden">
                      <pre className="p-4 text-zinc-100 overflow-x-auto">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-0">
                    <div className="rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
                      {/* Browser-like header */}
                      <div className="bg-zinc-200 dark:bg-zinc-800 flex items-center gap-2 px-3 py-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded px-2 py-1 text-xs flex-grow text-center">
                          preview
                        </div>
                      </div>
                      
                      {/* Live preview area */}
                      <div className="bg-white dark:bg-zinc-950 p-6 min-h-[300px] flex flex-col items-center justify-center">
                        {/* HTML Rendering */}
                        {language === 'html' && (
                          <div className="w-full h-full flex flex-col">
                            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-800 dark:text-blue-200 text-sm">
                              <p>Rendered HTML preview with CSS support</p>
                            </div>
                            
                            {/* Using iframe sandbox for secure rendering */}
                            <div className="w-full flex-grow border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden bg-white">
                              <iframe
                                title="HTML Preview"
                                sandbox="allow-scripts"
                                className="w-full h-[300px]"
                                srcDoc={`
                                  <!DOCTYPE html>
                                  <html>
                                    <head>
                                      <meta charset="UTF-8">
                                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                                      ${framework === 'bootstrap' ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}
                                      <style>
                                        body { 
                                          padding: 1rem;
                                          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                        }
                                        /* Fix for tailwind preflight interfering with bootstrap */
                                        ${framework === 'bootstrap' ? '*, ::before, ::after { box-sizing: border-box; }' : ''}
                                      </style>
                                    </head>
                                    <body>
                                      ${generatedCode}
                                      ${framework === 'bootstrap' ? '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>' : ''}
                                    </body>
                                  </html>
                                `}
                              />
                            </div>
                            
                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                              <p>Note: For security reasons, some interactive features might be limited in the preview</p>
                            </div>
                          </div>
                        )}
                        
                        {/* For non-HTML languages, show a placeholder */}
                        {language !== 'html' && (
                          <div className="text-center p-6 w-full">
                            {/* React components preview */}
                            {(language === 'javascript' || language === 'typescript') && framework === 'react' ? (
                              <div className="space-y-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-800 dark:text-blue-200 text-sm mb-4">
                                  <p>Simulated React component preview based on the generated code</p>
                                </div>
                                
                                <div className="p-6 border rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                                  {/* Detect button components */}
                                  {generatedCode.includes('button') || generatedCode.includes('Button') ? (
                                    <div className="flex flex-col gap-3 items-center">
                                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                                        Primary Button
                                      </button>
                                      
                                      {/* Show loading button if the code has loading state */}
                                      {generatedCode.includes('loading') || generatedCode.includes('Loading') || generatedCode.includes('isLoading') ? (
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded opacity-70 cursor-not-allowed flex items-center justify-center gap-2">
                                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Loading...
                                        </button>
                                      ) : null}
                                      
                                      {/* Show secondary button if variants are mentioned */}
                                      {generatedCode.includes('variant') || generatedCode.includes('secondary') || generatedCode.includes('Secondary') ? (
                                        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">
                                          Secondary Button
                                        </button>
                                      ) : null}
                                    </div>
                                  ) : generatedCode.includes('Card') || generatedCode.includes('card') ? (
                                    /* Card component preview */
                                    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-zinc-800">
                                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                      <div className="px-6 py-4">
                                        <div className="font-bold text-xl mb-2">Card Title</div>
                                        <p className="text-gray-700 dark:text-gray-300 text-base">
                                          This is a preview of what your card component might look like based on the generated code.
                                        </p>
                                      </div>
                                      <div className="px-6 pt-4 pb-2">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                          Action
                                        </button>
                                      </div>
                                    </div>
                                  ) : generatedCode.includes('Form') || generatedCode.includes('form') ? (
                                    /* Form component preview */
                                    <div className="max-w-md mx-auto">
                                      <form className="bg-white dark:bg-zinc-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                        <div className="mb-4">
                                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                                            Username
                                          </label>
                                          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" id="username" type="text" placeholder="Username" />
                                        </div>
                                        <div className="mb-6">
                                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                            Password
                                          </label>
                                          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" id="password" type="password" placeholder="******************" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                            Sign In
                                          </button>
                                          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                            Forgot Password?
                                          </a>
                                        </div>
                                      </form>
                                    </div>
                                  ) : (
                                    /* Generic component preview */
                                    <div className="text-center">
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Component preview based on the generated code</p>
                                      <div className="p-4 border rounded bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">
                                        [React Component Preview]
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                  <p>To see the actual component in action, copy the code and use it in your React application.</p>
                                </div>
                              </div>
                            ) : (
                              /* Non-React code notification */
                              <div className="p-6 border rounded-md border-dashed border-zinc-300 dark:border-zinc-700">
                                <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
                                  <p>Live preview is currently available for HTML code.</p>
                                  <p className="text-sm mt-1">For {framework}, you would typically run this code in your development environment.</p>
                                </div>
                                <h3 className="text-lg font-medium mb-2">Code Output Preview</h3>
                                <p>Generated {language} code would run here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                // Error or no code yet generated
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
                    <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
                      <Code className="h-12 w-12 mb-2 opacity-20" />
                      <p>Generated code will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeGeneration;
