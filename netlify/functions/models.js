import * as dotenv from 'dotenv';

dotenv.config();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const CLAUDE_MODELS = {
  "claude-3-sonnet-20240229": "Claude 3 Sonnet",
  "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet"
};

const OPENAI_MODELS = {
  "gpt-4": "GPT-4",
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-3.5-turbo": "GPT-3.5 Turbo"
};

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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log("Processing models request");
    
    // Always include at least these mock models to prevent frontend errors
    const availableModels = [
      {
        id: "mock",
        name: "Mock Model",
        provider: "mock"
      },
      {
        id: "auto",
        name: "Auto (Default)",
        provider: "auto"
      }
    ];
    
    // Add Claude models if available
    if (process.env.ANTHROPIC_API_KEY) {
      console.log("Adding Claude models");
      const claudeModels = {
        "claude-3-sonnet-20240229": "Claude 3 Sonnet",
        "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet"
      };
      
      for (const [modelId, modelName] of Object.entries(claudeModels)) {
        availableModels.push({
          id: modelId,
          name: modelName,
          provider: "anthropic"
        });
      }
    } else {
      console.log("No Anthropic API key found");
    }
    
    // Add OpenAI models if available
    if (process.env.OPENAI_API_KEY) {
      console.log("Adding OpenAI models");
      const openaiModels = {
        "gpt-4": "GPT-4",
        "gpt-4-turbo": "GPT-4 Turbo",
        "gpt-3.5-turbo": "GPT-3.5 Turbo"
      };
      
      for (const [modelId, modelName] of Object.entries(openaiModels)) {
        availableModels.push({
          id: modelId,
          name: modelName,
          provider: "openai"
        });
      }
    } else {
      console.log("No OpenAI API key found");
    }
    
    // Add DeepSeek models if available
    if (process.env.DEEPSEEK_API_KEY) {
      console.log("Adding DeepSeek models");
      const deepseekModels = {
        "deepseek-chat": "DeepSeek Chat",
        "deepseek-coder": "DeepSeek Coder",
        "deepseek-v3": "DeepSeek v3"
      };
      
      for (const [modelId, modelName] of Object.entries(deepseekModels)) {
        availableModels.push({
          id: modelId,
          name: modelName,
          provider: "deepseek"
        });
      }
    } else {
      console.log("No DeepSeek API key found");
    }
    
    console.log(`Returning ${availableModels.length} models`);
    
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ models: availableModels })
    };
    
  } catch (error) {
    console.error('Error in models function:', error);
    
    // Always return at least these mock models to prevent frontend errors
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ 
        models: [
          {
            id: "mock",
            name: "Mock Model (Error Fallback)",
            provider: "mock"
          },
          {
            id: "auto",
            name: "Auto (Default)",
            provider: "auto"
          }
        ],
        error: error.message 
      })
    };
  }
}; 