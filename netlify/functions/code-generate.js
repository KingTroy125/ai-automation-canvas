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
const DEFAULT_DEEPSEEK_MODEL = "deepseek-coder";

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

    // Construct a prompt that ensures only code is returned
    let codePrompt;
    if (language) {
      codePrompt = `Generate ONLY code in ${language} for the following task: ${prompt}. Return ONLY the code without any explanations, comments, or markdown formatting.`;
    } else {
      codePrompt = `Generate ONLY code for the following task: ${prompt}. Return ONLY the code without any explanations, comments, or markdown formatting.`;
    }

    // If requested model is OpenAI
    if (requestedModel in OPENAI_MODELS && process.env.OPENAI_API_KEY) {
      try {
        console.log("Using OpenAI API");
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
          model: requestedModel,
          messages: [
            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
            {"role": "user", "content": codePrompt}
          ],
          max_tokens: 2000,
          temperature: 0.2 // Lower temperature for code generation
        });

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            code: response.choices[0].message.content.trim(),
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

    // If requested model is Claude
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
            { role: 'user', content: codePrompt }
          ],
          system: "You are a code-only assistant. Return only the code without any explanations or markdown formatting."
        });

        // Extract just the code from the response
        let code = response.content[0].text;
        
        // Remove markdown code blocks if present
        code = code.replace(/```[\w]*\n/g, '').replace(/```$/g, '').trim();

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            code: code,
            model: claudeModel
          })
        };
      } catch (error) {
        console.error('Claude API error:', error);
        if (requestedModel === 'auto' && process.env.OPENAI_API_KEY) {
          // Continue to next service
          console.log("Falling back to next service");
        } else {
          throw error;
        }
      }
    }
    
    // If requested model is DeepSeek
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
              {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
              {"role": "user", "content": codePrompt}
            ],
            max_tokens: 2000,
            temperature: 0.2
          })
        });
        
        if (!response.ok) {
          throw new Error(`DeepSeek API responded with status ${response.status}: ${await response.text()}`);
        }
        
        const responseData = await response.json();
        let code = responseData.choices[0].message.content;
        
        // Remove markdown code blocks if present
        code = code.replace(/```[\w]*\n/g, '').replace(/```$/g, '').trim();
        
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            code: code,
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
        code: `// This is a mock response because no AI service was available.\n// The requested model (${requestedModel}) couldn't be used.\n\n// Here's a placeholder for your ${language || 'code'} request:\n\n// "${prompt}"\n\n// Please configure API keys in your Netlify environment variables:\n// - OPENAI_API_KEY for GPT models\n// - ANTHROPIC_API_KEY for Claude models\n// - DEEPSEEK_API_KEY for DeepSeek models`,
        model: "mock"
      })
    };
    
  } catch (error) {
    console.error('Error in code generation function:', error);
    
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ 
        code: `// Error: ${error.message || 'Unknown error'}\n\n// Please check your Netlify function logs for more details.`,
        error: error.message || 'Unknown error',
        model: 'error'
      })
    };
  }
}; 