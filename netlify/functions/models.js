const dotenv = require('dotenv');

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

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const availableModels = [];
    
    // Add Claude models if available
    if (process.env.ANTHROPIC_API_KEY) {
      for (const [modelId, modelName] of Object.entries(CLAUDE_MODELS)) {
        availableModels.push({
          id: modelId,
          name: modelName,
          provider: "anthropic"
        });
      }
    }
    
    // Add OpenAI models if available
    if (process.env.OPENAI_API_KEY) {
      for (const [modelId, modelName] of Object.entries(OPENAI_MODELS)) {
        availableModels.push({
          id: modelId,
          name: modelName,
          provider: "openai"
        });
      }
    }
    
    // If no models available, add mock
    if (availableModels.length === 0) {
      availableModels.push({
        id: "mock",
        name: "Mock Model",
        provider: "mock"
      });
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ models: availableModels })
    };
    
  } catch (error) {
    console.error('Error in models function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 