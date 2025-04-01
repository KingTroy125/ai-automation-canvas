const { Configuration, OpenAIApi } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
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

const DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-20240620";

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    if (!data || !data.content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing content in request' })
      };
    }

    const messageContent = data.content;
    const requestedModel = data.model || 'auto';

    // OpenAI handling
    if (requestedModel in OPENAI_MODELS && process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAIApi(new Configuration({
          apiKey: process.env.OPENAI_API_KEY
        }));

        const response = await openai.createChatCompletion({
          model: requestedModel,
          messages: [{ role: 'user', content: messageContent }],
          max_tokens: 1000
        });

        return {
          statusCode: 200,
          body: JSON.stringify({
            response: response.data.choices[0].message.content,
            model: requestedModel
          })
        };
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
      }
    }

    // Claude handling
    const isClaudeRequest = requestedModel in CLAUDE_MODELS || requestedModel === 'auto';
    if (isClaudeRequest && process.env.ANTHROPIC_API_KEY) {
      try {
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
          body: JSON.stringify({
            response: response.content[0].text,
            model: claudeModel
          })
        };
      } catch (error) {
        console.error('Claude API error:', error);
        if (requestedModel === 'auto' && process.env.OPENAI_API_KEY) {
          // Continue to OpenAI fallback
        } else {
          throw error;
        }
      }
    }

    // Fallback to OpenAI in auto mode
    if (requestedModel === 'auto' && process.env.OPENAI_API_KEY) {
      const fallbackModel = Object.keys(OPENAI_MODELS)[0] || "gpt-3.5-turbo";
      const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPENAI_API_KEY
      }));

      const response = await openai.createChatCompletion({
        model: fallbackModel,
        messages: [{ role: 'user', content: messageContent }],
        max_tokens: 1000
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          response: response.data.choices[0].message.content,
          model: fallbackModel
        })
      };
    }

    return {
      statusCode: 503,
      body: JSON.stringify({
        response: 'The requested AI model is not available.',
        model: 'mock'
      })
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    const userErrorMsg = error.message.toLowerCase().includes('api key') 
      ? 'Invalid API key. Please check your API key configuration.'
      : 'I encountered an error connecting to the AI service. Please try again.';

    return {
      statusCode: error.message.toLowerCase().includes('api key') ? 401 : 500,
      body: JSON.stringify({
        response: userErrorMsg,
        error: error.message,
        model: 'error'
      })
    };
  }
}; 