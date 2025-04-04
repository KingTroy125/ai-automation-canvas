import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

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

const DEEPSEEK_MODELS = {
  "deepseek-chat": "DeepSeek Chat",
  "deepseek-coder": "DeepSeek Coder",
  "deepseek-v3": "DeepSeek v3"
};

const DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-20240620";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";

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
    console.log("Processing chat request");
    const data = JSON.parse(event.body);
    
    if (!data || !data.content) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing content in request' })
      };
    }

    const messageContent = data.content;
    // Get requested model, default to "auto" for automatic fallback
    const requestedModel = data.model || 'auto';

    console.log(`Chat request with model: ${requestedModel}`);

    // If requested model is OpenAI
    if (requestedModel in OPENAI_MODELS && process.env.OPENAI_API_KEY) {
      try {
        console.log("Using OpenAI API");
        // Try importing OpenAI with newer method first
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        
        const response = await openai.chat.completions.create({
          model: requestedModel,
          messages: [{"role": "user", "content": messageContent}],
          max_tokens: 1000
        });
        
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            response: response.choices[0].message.content,
            model: requestedModel
          })
        };
      } catch (error) {
        console.error('OpenAI API error:', error);
        if (requestedModel === 'auto') {
          // Continue to next service
          console.log("Falling back to next service");
        } else {
          throw error;
        }
      }
    }

    // If user specifically requests a Claude model or it's set to auto and Claude is available
    const isClaudeRequest = requestedModel in CLAUDE_MODELS || requestedModel === 'auto';
    if (isClaudeRequest && process.env.ANTHROPIC_API_KEY) {
      try {
        console.log("Using Anthropic API");
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });

        const claudeModel = requestedModel in CLAUDE_MODELS ? requestedModel : DEFAULT_CLAUDE_MODEL;

        const response = await anthropic.messages.create({
          model: claudeModel,
          max_tokens: 2000,
          messages: [
            { role: 'user', content: messageContent }
          ],
          system: "You are a helpful and friendly AI assistant. You should engage in natural conversation, be polite, and provide helpful responses."
        });

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            response: response.content[0].text,
            model: claudeModel
          })
        };
      } catch (error) {
        console.error('Claude API error:', error);
        if (requestedModel === 'auto') {
          // Continue to next service
          console.log("Falling back to next service");
        } else {
          throw error;
        }
      }
    }
    
    // If user specifically requests a DeepSeek model or it's set to auto and DeepSeek is available
    const isDeepSeekRequest = requestedModel in DEEPSEEK_MODELS || requestedModel === 'auto';
    if (isDeepSeekRequest && process.env.DEEPSEEK_API_KEY) {
      try {
        console.log("Using DeepSeek API");
        
        const deepseekModel = requestedModel in DEEPSEEK_MODELS ? requestedModel : DEFAULT_DEEPSEEK_MODEL;
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: deepseekModel,
            messages: [
              {"role": "system", "content": "You are a helpful and friendly AI assistant. You should engage in natural conversation, be polite, and provide helpful responses."},
              {"role": "user", "content": messageContent}
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`DeepSeek API responded with status ${response.status}: ${await response.text()}`);
        }
        
        const responseData = await response.json();
        
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            response: responseData.choices[0].message.content,
            model: deepseekModel
          })
        };
      } catch (error) {
        console.error('DeepSeek API error:', error);
        if (requestedModel === 'auto') {
          // Continue to next service
          console.log("Falling back to next service");
        } else {
          throw error;
        }
      }
    }

    // If we reach here, either no API keys were configured or all attempts failed
    console.log("No valid API keys or all API calls failed, using mock response");
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        response: `I'm sorry, I can't process your request at the moment. No API keys are configured for the requested model (${requestedModel}). Please check your Netlify environment variables to configure one of the following API keys:\n- OPENAI_API_KEY for GPT models\n- ANTHROPIC_API_KEY for Claude models\n- DEEPSEEK_API_KEY for DeepSeek models`,
        model: "mock"
      })
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ 
        response: `Error: ${error.message || 'Unknown error'}. Please check the Netlify function logs for details.`,
        error: error.message || 'Unknown error',
        model: 'error'
      })
    };
  }
}; 