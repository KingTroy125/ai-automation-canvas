from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback
import sys

# Fix for cgi module in Python 3.13
if sys.version_info >= (3, 13):
    sys.modules['cgi'] = type('CGIModule', (), {
        'parse_header': lambda header: (header, {})
    })

# Patch for HTTPTransport socket_options incompatibility
try:
    import httpx
    original_init = httpx.HTTPTransport.__init__
    
    def patched_init(self, *args, **kwargs):
        # Remove socket_options if present (incompatible with older httpx versions)
        if 'socket_options' in kwargs:
            del kwargs['socket_options']
        return original_init(self, *args, **kwargs)
    
    httpx.HTTPTransport.__init__ = patched_init
except Exception as e:
    print(f"Warning: Could not patch HTTPTransport: {e}")

# Load environment variables
load_dotenv()

# Get API keys
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Available OpenAI models
OPENAI_MODELS = {
    "gpt-4": "GPT-4",
    "gpt-4-turbo": "GPT-4 Turbo",
    "gpt-3.5-turbo": "GPT-3.5 Turbo"
}

# Available Claude models
CLAUDE_MODELS = {
    "claude-3-sonnet-20240229": "Claude 3 Sonnet",
    "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet"
}

# Default Claude model to use
DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-20240620"

# For testing fallback - set to True to simulate Claude being down
SIMULATE_CLAUDE_DOWN = False

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/', methods=['GET'])
def read_root():
    return jsonify({"message": "API is running"})

@app.route('/models', methods=['GET'])
def get_models():
    available_models = []
    
    # Add Claude models if available
    if anthropic_api_key and not SIMULATE_CLAUDE_DOWN:
        for model_id, model_name in CLAUDE_MODELS.items():
            available_models.append({
                "id": model_id,
                "name": model_name,
                "provider": "anthropic"
            })
    
    # Add OpenAI models if available
    if openai_api_key:
        for model_id, model_name in OPENAI_MODELS.items():
            available_models.append({
                "id": model_id,
                "name": model_name,
                "provider": "openai"
            })
    
    # If no models available, add mock
    if not available_models:
        available_models.append({
            "id": "mock",
            "name": "Mock Model",
            "provider": "mock"
        })
    
    return jsonify({"models": available_models})

@app.route('/verify-key', methods=['GET'])
def verify_key():
    available_models = []
    if anthropic_api_key and not SIMULATE_CLAUDE_DOWN:
        available_models.extend(CLAUDE_MODELS.keys())
    if openai_api_key:
        for model_id in OPENAI_MODELS.keys():
            available_models.append(model_id)
    
    if not available_models:
        available_models = ["mock"]
        
    return jsonify({"status": "OK", "available_models": available_models})

@app.route('/toggle-claude', methods=['POST'])
def toggle_claude():
    global SIMULATE_CLAUDE_DOWN
    SIMULATE_CLAUDE_DOWN = not SIMULATE_CLAUDE_DOWN
    status = "DOWN" if SIMULATE_CLAUDE_DOWN else "UP"
    return jsonify({"status": f"Claude simulation is now {status}"})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "Missing content in request"}), 400
        
        message_content = data['content']
        # Get requested model, default to "auto" for automatic fallback
        requested_model = data.get('model', 'auto')
        
        # If requested model is OpenAI
        if requested_model in OPENAI_MODELS.keys() and openai_api_key:
            try:
                # Try importing OpenAI with newer method first
                try:
                    from openai import OpenAI
                    client = OpenAI(api_key=openai_api_key)
                    response = client.chat.completions.create(
                        model=requested_model,
                        messages=[{"role": "user", "content": message_content}],
                        max_tokens=1000
                    )
                    return jsonify({
                        "response": response.choices[0].message.content,
                        "model": requested_model
                    })
                except (ImportError, AttributeError):
                    # Fall back to older OpenAI API version
                    import openai
                    openai.api_key = openai_api_key
                    response = openai.ChatCompletion.create(
                        model=requested_model,
                        messages=[{"role": "user", "content": message_content}],
                        max_tokens=1000
                    )
                    return jsonify({
                        "response": response.choices[0].message.content,
                        "model": requested_model
                    })
            except Exception as e:
                print(f"OpenAI API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
        # If user specifically requests a Claude model or it's set to auto and Claude is available
        is_claude_request = requested_model in CLAUDE_MODELS.keys() or requested_model == 'auto'
        if is_claude_request and anthropic_api_key and not SIMULATE_CLAUDE_DOWN:
            try:
                # Import anthropic with compatibility handling
                import anthropic
                
                # Determine which Claude model to use
                claude_model = requested_model if requested_model in CLAUDE_MODELS.keys() else DEFAULT_CLAUDE_MODEL
                
                try:
                    # Create Anthropic client based on installed version (0.49.0)
                    client = anthropic.Anthropic(api_key=anthropic_api_key)
                    
                    # Use a try/except block to handle potential socket_options errors
                    try:
                        response = client.messages.create(
                            model=claude_model,
                            max_tokens=1000,
                            messages=[{"role": "user", "content": message_content}]
                        )
                    except TypeError as te:
                        if 'socket_options' in str(te):
                            # If using a direct client fails with socket_options error, 
                            # try to use a custom httpx client without socket_options
                            import httpx
                            http_client = httpx.Client(timeout=None)
                            client = anthropic.Anthropic(
                                api_key=anthropic_api_key,
                                http_client=http_client
                            )
                            response = client.messages.create(
                                model=claude_model,
                                max_tokens=1000,
                                messages=[{"role": "user", "content": message_content}]
                            )
                        else:
                            raise
                    
                    # Extract response content based on SDK version
                    if hasattr(response, 'content') and isinstance(response.content, list):
                        response_text = response.content[0].text
                    else:
                        # Fallback for other response formats
                        response_text = str(response.content)
                    
                    return jsonify({
                        "response": response_text,
                        "model": claude_model
                    })
                except Exception as e:
                    print(f"Error with Anthropic client: {str(e)}")
                    print(traceback.format_exc())
                    
                    # Fall back to direct API call if client doesn't work
                    import httpx
                    
                    headers = {
                        "Content-Type": "application/json",
                        "X-Api-Key": anthropic_api_key,
                        "anthropic-version": "2023-06-01"
                    }
                    
                    payload = {
                        "model": claude_model,
                        "max_tokens": 1000,
                        "messages": [{"role": "user", "content": message_content}]
                    }
                    
                    api_response = httpx.post(
                        "https://api.anthropic.com/v1/messages",
                        headers=headers,
                        json=payload,
                        timeout=30.0
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("content", [{"text": "No response text"}])[0]["text"]
                        
                        return jsonify({
                            "response": response_text,
                            "model": claude_model
                        })
                    else:
                        raise Exception(f"API call failed: {api_response.status_code} - {api_response.text}")
                    
            except Exception as e:
                print(f"Claude API error: {str(e)}")
                print(traceback.format_exc())
                # If Claude fails and we're in auto mode, try OpenAI
                if requested_model == 'auto' and openai_api_key:
                    pass  # Continue to OpenAI fallback
                else:
                    raise  # If user specifically requested Claude, raise the error
        
        # Fall back to OpenAI if in auto mode
        if requested_model == 'auto' and openai_api_key:
            # Choose the best available OpenAI model
            fallback_model = next(iter(OPENAI_MODELS.keys()), "gpt-3.5-turbo")
            try:
                # Try importing OpenAI with newer method first
                try:
                    from openai import OpenAI
                    client = OpenAI(api_key=openai_api_key)
                    response = client.chat.completions.create(
                        model=fallback_model,
                        messages=[{"role": "user", "content": message_content}],
                        max_tokens=1000
                    )
                    return jsonify({
                        "response": response.choices[0].message.content,
                        "model": fallback_model
                    })
                except (ImportError, AttributeError):
                    # Fall back to older OpenAI API version
                    import openai
                    openai.api_key = openai_api_key
                    response = openai.ChatCompletion.create(
                        model=fallback_model,
                        messages=[{"role": "user", "content": message_content}],
                        max_tokens=1000
                    )
                    return jsonify({
                        "response": response.choices[0].message.content,
                        "model": fallback_model
                    })
            except Exception as e:
                print(f"OpenAI API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
        # If we get here, no suitable model was found
        return jsonify({
            "response": "The requested AI model is not available.",
            "model": "mock"
        }), 503
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in chat endpoint: {error_msg}")
        print(traceback.format_exc())
        
        # More user-friendly error message
        user_error_msg = "I encountered an error connecting to the AI service. Please check your API keys and try again."
        
        # Return appropriate error code
        if "invalid" in error_msg.lower() and "key" in error_msg.lower():
            status_code = 401  # Unauthorized for API key issues
            user_error_msg = "Invalid API key. Please check your API key configuration."
        else:
            status_code = 500  # Internal server error for other issues
            
        return jsonify({
            "response": user_error_msg,
            "error": error_msg,
            "model": "error"
        }), status_code

# NOTE: All other routes are disabled until we fix compatibility issues

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)