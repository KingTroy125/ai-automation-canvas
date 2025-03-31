import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Send, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  model?: string;
  isError?: boolean;
}

interface Model {
  id: string;
  name: string;
  provider: string;
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [availableModels, setAvailableModels] = useState<Model[]>([
    { id: 'auto', name: 'Auto (Default)', provider: 'auto' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchAvailableModels = async () => {
      try {
        // First try the new models endpoint
        const response = await fetch('http://localhost:8000/models');
        if (response.ok) {
          const data = await response.json();
          // Add the auto option
          setAvailableModels([
            { id: 'auto', name: 'Auto (Default)', provider: 'auto' },
            ...data.models
          ]);
        } else {
          // Fall back to the old endpoint
          const oldResponse = await fetch('http://localhost:8000/verify-key');
          if (oldResponse.ok) {
            const data = await oldResponse.json();
            const formattedModels = data.available_models.map((id: string) => {
              if (id === 'claude-3-sonnet-20240229') {
                return { id, name: 'Claude 3 Sonnet', provider: 'anthropic' };
              } else if (id === 'claude-3-5-sonnet-20240620') {
                return { id, name: 'Claude 3.5 Sonnet', provider: 'anthropic' };
              } else if (id === 'gpt-4') {
                return { id, name: 'GPT-4', provider: 'openai' };
              } else if (id === 'gpt-4-turbo') {
                return { id, name: 'GPT-4 Turbo', provider: 'openai' };
              } else if (id === 'gpt-3.5-turbo') {
                return { id, name: 'GPT-3.5 Turbo', provider: 'openai' };
              } else {
                return { id, name: id, provider: 'unknown' };
              }
            });
            
            setAvailableModels([
              { id: 'auto', name: 'Auto (Default)', provider: 'auto' },
              ...formattedModels
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching available models:', error);
        toast({
          title: "Connection Error",
          description: "Could not connect to AI service. Check if the backend is running.",
          variant: "destructive"
        });
      }
    };

    fetchAvailableModels();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ 
          content: input.trim(),
          model: selectedModel 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.response || `HTTP error! status: ${response.status}`);
      }
      
      const botMessage: Message = {
        role: 'bot',
        content: data.response,
        timestamp: new Date(),
        model: data.model,
        isError: data.model === 'error'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModelLabel = (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (model) return model.name;
    
    // Fallback friendly names for models not in the list
    if (modelId.includes('claude-3-5')) return 'Claude 3.5 Sonnet';
    if (modelId.includes('claude-3')) return 'Claude 3 Sonnet';
    if (modelId.includes('gpt-4-turbo')) return 'GPT-4 Turbo';
    if (modelId.includes('gpt-4')) return 'GPT-4';
    if (modelId.includes('gpt-3.5')) return 'GPT-3.5 Turbo';
    
    return modelId;
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-120px)] flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Chat Assistant</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Model:</span>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Default)</SelectItem>
                
                {availableModels.filter(m => m.provider === 'anthropic' && m.id !== 'auto').length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Anthropic</SelectLabel>
                    {availableModels
                      .filter(model => model.provider === 'anthropic')
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
                
                {availableModels.filter(m => m.provider === 'openai').length > 0 && (
                  <SelectGroup>
                    <SelectLabel>OpenAI</SelectLabel>
                    {availableModels
                      .filter(model => model.provider === 'openai')
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="flex-1 flex flex-col overflow-hidden p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[80%] space-x-2 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.role === 'user' ? (
                        <>
                          <AvatarFallback>U</AvatarFallback>
                          <AvatarImage src="" alt="User" />
                        </>
                      ) : (
                        <>
                          <AvatarFallback className={`${message.isError ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div 
                      className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : message.isError
                            ? 'bg-destructive/10 text-destructive-foreground'
                            : 'bg-muted'
                      }`}
                    >
                      {message.model && message.role === 'bot' && (
                        <div className="text-xs font-medium mb-1 opacity-70">
                          {getModelLabel(message.model)}
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSend} className="mt-4 flex items-end gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatAssistant;
