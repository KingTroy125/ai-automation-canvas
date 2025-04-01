import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const CLAUDE_MODELS = {
  "claude-3-sonnet-20240229": "Claude 3 Sonnet",
  "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet"
};

const OPENAI_MODELS = {
  "gpt-4": "GPT-4",
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-3.5-turbo": "GPT-3.5 Turbo"
};

const DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-20240620";

export const handler = async (event, context) => {
  // Always add CORS headers
  const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log("Processing code generation request");
    const data = JSON.parse(event.body);
    
    if (!data || !data.prompt) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing prompt in request' })
      };
    }

    const prompt = data.prompt;
    const requestedModel = data.model || 'auto';
    const language = data.language || '';

    console.log(`Generating code with model: ${requestedModel}, language: ${language || 'unspecified'}`);

    // Return a mock response for testing
    // In production, this would call the actual AI API
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        code: `// Generated code for: ${prompt}\n// Using ${language || 'auto-detected'} language\n\n// Sample code for testing\nfunction example() {\n  console.log("This is a mock response for testing");\n  return true;\n}`,
        model: "mock"
      })
    };
    
  } catch (error) {
    console.error('Error in code generation function:', error);
    
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ 
        code: `// Error: ${error.message || 'Unknown error'}`,
        error: error.message || 'Unknown error',
        model: 'error'
      })
    };
  }
}; 