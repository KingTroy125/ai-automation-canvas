// More reliable environment detection for Netlify
const isNetlify = Boolean(
  typeof window !== 'undefined' && (
    window.location.hostname.includes('netlify.app') ||
    // Only consider non-localhost as Netlify if in production mode
    (window.location.hostname !== 'localhost' && import.meta.env.PROD === true)
  )
);

// Fall back to production default if we can't detect hostname
const API_BASE_URL = isNetlify
  ? '/.netlify/functions'
  : 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL, 'isNetlify:', isNetlify, 'hostname:', typeof window !== 'undefined' ? window.location.hostname : 'unknown');

// Create a function to add a delay for retrying
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add a function to retry failed requests
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300) {
  try {
    console.log(`Attempting fetch to ${url}...`);
    const response = await fetch(url, options);
    if (response.ok) {
      console.log(`Fetch to ${url} successful`);
      return response;
    }
    console.log(`Fetch to ${url} failed with status: ${response.status}`);
  } catch (err) {
    console.error(`Fetch to ${url} threw error:`, err);
    if (retries === 0) {
      throw err;
    }
    console.log(`Request failed, retrying in ${backoff}ms...`);
    await delay(backoff);
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
  
  if (retries === 0) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  
  console.log(`Request failed, retrying in ${backoff}ms...`);
  await delay(backoff);
  return fetchWithRetry(url, options, retries - 1, backoff * 2);
}

export async function testBackendConnection() {
  try {
    // Try multiple endpoints in order of preference
    const endpoints = ['/debug', '/default', '/models'];
    let lastError: Error | null = null;
    
    console.log('Testing backend connection, trying multiple endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${API_BASE_URL}${endpoint}`);
        const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }, 1, 500); // 1 retry, 500ms backoff
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Backend connection successful via ${endpoint}:`, data);
          return { success: true, data, endpoint };
        }
      } catch (error) {
        console.error(`Failed to connect to ${endpoint}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
    
    // If we get here, all endpoints failed
    throw lastError || new Error('Failed to connect to any backend endpoint');
  } catch (error) {
    console.error('All backend connection tests failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getAvailableModels() {
  try {
    console.log('Fetching available models from:', `${API_BASE_URL}/models`);
    const response = await fetchWithRetry(`${API_BASE_URL}/models`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/code-generate`, {
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
    const response = await fetchWithRetry(`${API_BASE_URL}/chat`, {
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