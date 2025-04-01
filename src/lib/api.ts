const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : 'http://localhost:8000';

export async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/default`);
    if (!response.ok) {
      throw new Error(`Failed to connect to backend: ${response.statusText}`);
    }
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getAvailableModels() {
  try {
    console.log('Fetching available models from:', `${API_BASE_URL}/models`);
    const response = await fetch(`${API_BASE_URL}/models`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch models:', response.statusText);
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received models:', data);
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return { models: [{ id: 'mock', name: 'Mock Model (API Error)', provider: 'mock' }] };
  }
}

export async function generateCode(prompt: string, model: string, language?: string) {
  try {
    console.log(`Generating code with model: ${model}, language: ${language || 'unspecified'}`);
    const response = await fetch(`${API_BASE_URL}/code-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ prompt, model, language }),
    });
    
    if (!response.ok) {
      console.error('Code generation failed:', response.statusText);
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to generate code: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

export async function sendChatMessage(content: string, model: string) {
  try {
    console.log(`Sending chat message with model: ${model}`);
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ content, model }),
    });
    
    if (!response.ok) {
      console.error('Chat message failed:', response.statusText);
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
} 