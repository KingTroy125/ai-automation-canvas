const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : 'http://localhost:8000';

export async function getAvailableModels() {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    return { models: [{ id: 'mock', name: 'Mock Model', provider: 'mock' }] };
  }
}

export async function generateCode(prompt: string, model: string, language?: string) {
  const response = await fetch(`${API_BASE_URL}/code-generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, model, language }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to generate code: ${response.statusText}`);
  }
  
  return response.json();
}

export async function sendChatMessage(content: string, model: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, model }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to send message: ${response.statusText}`);
  }
  
  return response.json();
} 