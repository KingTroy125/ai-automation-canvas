
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, FileUp, List, Scan, SearchCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const DocumentAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      toast.success(`File selected: ${selectedFile.name}`);
      
      // For demo purposes, let's pretend we can read the file contents
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'text/plain' ||
          selectedFile.name.endsWith('.txt') ||
          selectedFile.name.endsWith('.pdf')) {
        // In a real app, you would use the appropriate API to extract text
        // This is just a demo
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const analyzeDocument = () => {
    if (activeTab === 'upload' && !file) {
      toast.error('Please upload a document first');
      return;
    }

    if (activeTab === 'paste' && !text.trim()) {
      toast.error('Please enter some text first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      // Mock results
      const analysisResults = {
        summary: 'This document discusses the implementation of AI technologies in modern business workflows, focusing on efficiency improvements and cost reduction strategies.',
        keywords: ['artificial intelligence', 'business automation', 'workflow optimization', 'cost reduction', 'efficiency'],
        entities: [
          { type: 'organization', name: 'TechCorp', mentions: 8 },
          { type: 'technology', name: 'Machine Learning', mentions: 12 },
          { type: 'person', name: 'Dr. Sarah Johnson', mentions: 3 },
        ],
        sentiment: {
          overall: 'positive',
          score: 0.78,
          breakdown: {
            positive: '67%',
            neutral: '28%',
            negative: '5%'
          }
        },
        wordCount: 1247,
        readingTime: '5 minutes'
      };

      setResults(analysisResults);
      setIsAnalyzing(false);
      toast.success('Document analysis complete');
    }, 2000);
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Document Summary</h4>
              <p>{results.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Key Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-md p-3">
                  <div className="text-muted-foreground text-xs">Word Count</div>
                  <div className="text-xl font-bold">{results.wordCount}</div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-muted-foreground text-xs">Reading Time</div>
                  <div className="text-xl font-bold">{results.readingTime}</div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-muted-foreground text-xs">Sentiment</div>
                  <div className="text-xl font-bold capitalize">{results.sentiment.overall}</div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-muted-foreground text-xs">Sentiment Score</div>
                  <div className="text-xl font-bold">{results.sentiment.score.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {results.keywords.map((keyword: string, index: number) => (
                  <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Entities Detected</h4>
              <div className="space-y-2">
                {results.entities.map((entity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <span className="font-medium">{entity.name}</span> 
                      <span className="text-xs text-muted-foreground ml-2 capitalize">({entity.type})</span>
                    </div>
                    <div className="text-sm">{entity.mentions} mentions</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload documents or paste text to extract insights and information
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">
              <FileUp className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="paste">
              <FileText className="h-4 w-4 mr-2" />
              Paste Text
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">Upload your document</h3>
                  <p className="text-sm text-muted-foreground mb-4">PDF, DOC, TXT, or RTF files</p>
                  
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button as="span">Select File</Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                    />
                  </label>
                  
                  {file && (
                    <div className="mt-4 text-sm">
                      Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={analyzeDocument} 
                  disabled={isAnalyzing || !file} 
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>Analyzing Document...</>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Analyze Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="paste" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label htmlFor="text-input" className="text-sm font-medium block mb-2">
                    Paste your text below
                  </label>
                  <Textarea
                    id="text-input"
                    placeholder="Paste or type the document text here..."
                    className="min-h-[200px]"
                    value={text}
                    onChange={handleTextChange}
                  />
                </div>
                
                <Button 
                  onClick={analyzeDocument} 
                  disabled={isAnalyzing || !text.trim()} 
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>Analyzing Text...</>
                  ) : (
                    <>
                      <SearchCheck className="mr-2 h-4 w-4" />
                      Analyze Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {renderResults()}
      </div>
    </DashboardLayout>
  );
};

export default DocumentAnalysis;
