from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback
import sys
import ssl
import certifi

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

# Patch to handle SSL issues
try:
    # Create SSL context with proper verification
    ssl_context = ssl.create_default_context(cafile=certifi.where())
except Exception as e:
    print(f"Warning: Could not create SSL context: {e}")
    ssl_context = None

# Load environment variables
load_dotenv()

# Get API keys
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")
deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")

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

# Available DeepSeek models
DEEPSEEK_MODELS = {
    "deepseek-chat": "DeepSeek Chat",
    "deepseek-coder": "DeepSeek Coder",
    "deepseek-v3": "DeepSeek v3"
}

# Default Claude model to use
DEFAULT_CLAUDE_MODEL = "claude-3-5-sonnet-20240620"
# Default DeepSeek model to use
DEFAULT_DEEPSEEK_MODEL = "deepseek-v3"

# For testing fallback - set to True to simulate Claude being down
SIMULATE_CLAUDE_DOWN = False
# For testing fallback - set to True to simulate DeepSeek being down
SIMULATE_DEEPSEEK_DOWN = False

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
    
    # Add DeepSeek models if available
    if deepseek_api_key and not SIMULATE_DEEPSEEK_DOWN:
        for model_id, model_name in DEEPSEEK_MODELS.items():
            available_models.append({
                "id": model_id,
                "name": model_name,
                "provider": "deepseek"
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
    if deepseek_api_key and not SIMULATE_DEEPSEEK_DOWN:
        available_models.extend(DEEPSEEK_MODELS.keys())
    
    if not available_models:
        available_models = ["mock"]
        
    return jsonify({"status": "OK", "available_models": available_models})

@app.route('/toggle-claude', methods=['POST'])
def toggle_claude():
    global SIMULATE_CLAUDE_DOWN
    SIMULATE_CLAUDE_DOWN = not SIMULATE_CLAUDE_DOWN
    status = "DOWN" if SIMULATE_CLAUDE_DOWN else "UP"
    return jsonify({"status": f"Claude simulation is now {status}"})

@app.route('/toggle-deepseek', methods=['POST'])
def toggle_deepseek():
    global SIMULATE_DEEPSEEK_DOWN
    SIMULATE_DEEPSEEK_DOWN = not SIMULATE_DEEPSEEK_DOWN
    status = "DOWN" if SIMULATE_DEEPSEEK_DOWN else "UP"
    return jsonify({"status": f"DeepSeek simulation is now {status}"})

@app.route('/code-generate', methods=['POST'])
def code_generate():
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "Missing prompt in request"}), 400
        
        prompt = data['prompt']
        requested_model = data.get('model', 'auto')
        language = data.get('language', '')
        
        # Construct a prompt that ensures only code is returned
        if language:
            code_prompt = f"Generate ONLY code in {language} for the following task: {prompt}. Return ONLY the code without any explanations, comments, or markdown formatting."
        else:
            code_prompt = f"Generate ONLY code for the following task: {prompt}. Return ONLY the code without any explanations, comments, or markdown formatting."
        
        # If requested model is OpenAI
        if requested_model in OPENAI_MODELS.keys() and openai_api_key:
            try:
                # Try using the OpenAI client with SSL handling
                try:
                    from openai import OpenAI
                    
                    # Configure the client with proper SSL settings if needed
                    client_kwargs = {"api_key": openai_api_key}
                    
                    # Create a custom httpx client with proper SSL settings if needed
                    try:
                        import httpx
                        http_client = httpx.Client(
                            timeout=60.0,
                            verify=certifi.where()  # Use proper SSL certificate verification
                        )
                        client_kwargs["http_client"] = http_client
                    except Exception as http_error:
                        print(f"Warning: Could not create custom HTTP client: {http_error}")
                    
                    client = OpenAI(**client_kwargs)
                    
                    response = client.chat.completions.create(
                        model=requested_model,
                        messages=[
                            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
                            {"role": "user", "content": code_prompt}
                        ],
                        max_tokens=2000
                    )
                    return jsonify({
                        "code": response.choices[0].message.content.strip(),
                        "model": requested_model
                    })
                except Exception as openai_import_error:
                    print(f"Error with OpenAI client: {str(openai_import_error)}")
                    
                    # Fall back to direct API call if client doesn't work
                    import httpx
                    
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {openai_api_key}"
                    }
                    
                    payload = {
                        "model": requested_model,
                        "messages": [
                            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
                            {"role": "user", "content": code_prompt}
                        ],
                        "max_tokens": 2000
                    }
                    
                    # Use httpx with proper SSL context
                    api_response = httpx.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=60.0,
                        verify=certifi.where()  # Use proper certificate verification
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                        
                        return jsonify({
                            "code": response_text,
                            "model": requested_model
                        })
                    else:
                        raise Exception(f"OpenAI API call failed: {api_response.status_code} - {api_response.text}")
            except Exception as e:
                print(f"OpenAI API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
        # If user specifically requests a Claude model or it's set to auto and Claude is available
        is_claude_request = requested_model in CLAUDE_MODELS.keys() or requested_model == 'auto'
        if is_claude_request and anthropic_api_key and not SIMULATE_CLAUDE_DOWN:
            try:
                import anthropic
                
                # Determine which Claude model to use
                claude_model = requested_model if requested_model in CLAUDE_MODELS.keys() else DEFAULT_CLAUDE_MODEL
                
                try:
                    # Create Anthropic client with proper SSL settings
                    client_kwargs = {"api_key": anthropic_api_key}
                    
                    # Create a custom httpx client with proper SSL settings
                    try:
                        import httpx
                        http_client = httpx.Client(
                            timeout=60.0,
                            verify=certifi.where()  # Use proper SSL certificate verification
                        )
                        client_kwargs["http_client"] = http_client
                    except Exception as http_error:
                        print(f"Warning: Could not create custom HTTP client: {http_error}")
                    
                    client = anthropic.Anthropic(**client_kwargs)
                    
                    try:
                        response = client.messages.create(
                            model=claude_model,
                            max_tokens=2000,
                            messages=[
                                {"role": "user", "content": code_prompt}
                            ],
                            system="You are a code-only assistant. You must only return code without explanations or markdown formatting. Do not include any text before or after the code."
                        )
                    except TypeError as te:
                        if 'socket_options' in str(te):
                            import httpx
                            http_client = httpx.Client(
                                timeout=60.0,
                                verify=certifi.where()  # Use proper certificate verification
                            )
                            client = anthropic.Anthropic(
                                api_key=anthropic_api_key,
                                http_client=http_client
                            )
                            response = client.messages.create(
                                model=claude_model,
                                max_tokens=2000,
                                messages=[
                                    {"role": "user", "content": code_prompt}
                                ],
                                system="You are a code-only assistant. You must only return code without explanations or markdown formatting. Do not include any text before or after the code."
                            )
                        else:
                            raise
                    
                    # Extract the content and clean up markdown code blocks if present
                    if hasattr(response, 'content') and isinstance(response.content, list):
                        response_text = response.content[0].text.strip()
                    else:
                        response_text = str(response.content).strip()
                    
                    # Remove markdown code blocks if present
                    if response_text.startswith("```") and response_text.endswith("```"):
                        # Extract language if specified
                        first_line_end = response_text.find("\n")
                        if first_line_end > 0:
                            language_line = response_text[3:first_line_end].strip()
                            if language_line:  # There's a language specification
                                response_text = response_text[first_line_end+1:-3].strip()
                            else:
                                response_text = response_text[3:-3].strip()
                        else:
                            response_text = response_text[3:-3].strip()
                    
                    return jsonify({
                        "code": response_text,
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
                        "max_tokens": 2000,
                        "messages": [{"role": "user", "content": code_prompt}],
                        "system": "You are a code-only assistant. You must only return code without explanations or markdown formatting. Do not include any text before or after the code."
                    }
                    
                    # Use httpx with proper SSL context
                    api_response = httpx.post(
                        "https://api.anthropic.com/v1/messages",
                        headers=headers,
                        json=payload,
                        timeout=60.0,
                        verify=certifi.where()  # Use proper certificate verification
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("content", [{"text": ""}])[0]["text"].strip()
                        
                        # Remove markdown code blocks if present
                        if response_text.startswith("```") and response_text.endswith("```"):
                            # Extract language if specified
                            first_line_end = response_text.find("\n")
                            if first_line_end > 0:
                                language_line = response_text[3:first_line_end].strip()
                                if language_line:  # There's a language specification
                                    response_text = response_text[first_line_end+1:-3].strip()
                                else:
                                    response_text = response_text[3:-3].strip()
                            else:
                                response_text = response_text[3:-3].strip()
                        
                        return jsonify({
                            "code": response_text,
                            "model": claude_model
                        })
                    else:
                        raise Exception(f"API call failed: {api_response.status_code} - {api_response.text}")
                    
            except Exception as e:
                print(f"Claude API error: {str(e)}")
                print(traceback.format_exc())
                if requested_model == 'auto' and openai_api_key:
                    pass  # Continue to OpenAI fallback
                else:
                    raise
        
        # If user specifically requests a DeepSeek model or it's set to auto and DeepSeek is available
        is_deepseek_request = requested_model in DEEPSEEK_MODELS.keys() or requested_model == 'auto'
        if is_deepseek_request and deepseek_api_key and not SIMULATE_DEEPSEEK_DOWN:
            try:
                # Import DeepSeek with compatibility handling
                import deepseek
                
                # Determine which DeepSeek model to use
                deepseek_model = requested_model if requested_model in DEEPSEEK_MODELS.keys() else DEFAULT_DEEPSEEK_MODEL
                
                try:
                    # Create DeepSeek client
                    client = deepseek.Client(api_key=deepseek_api_key)
                    
                    try:
                        # Call DeepSeek API for code generation
                        response = client.generate(
                            prompt=code_prompt,
                            model=deepseek_model,
                            max_tokens=2000,
                            temperature=0.2,  # Lower temperature for code generation
                            system_prompt="You are a code-only assistant. You must only return code without explanations or markdown formatting."
                        )
                        return jsonify({
                            "code": response.text.strip(),
                            "model": deepseek_model
                        })
                    except Exception as api_error:
                        print(f"DeepSeek API call error: {str(api_error)}")
                        print(traceback.format_exc())
                        raise
                except Exception as client_error:
                    print(f"DeepSeek client creation error: {str(client_error)}")
                    print(traceback.format_exc())
                    
                    # Try direct API call as fallback
                    import httpx
                    
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {deepseek_api_key}"
                    }
                    
                    payload = {
                        "model": deepseek_model,
                        "messages": [
                            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
                            {"role": "user", "content": code_prompt}
                        ],
                        "max_tokens": 2000,
                        "temperature": 0.2
                    }
                    
                    api_response = httpx.post(
                        "https://api.deepseek.com/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=60.0,
                        verify=certifi.where()
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                        
                        return jsonify({
                            "code": response_text,
                            "model": deepseek_model
                        })
                    else:
                        raise Exception(f"DeepSeek API call failed: {api_response.status_code} - {api_response.text}")
            except Exception as e:
                print(f"DeepSeek API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
        # Fall back to OpenAI if in auto mode
        if requested_model == 'auto' and openai_api_key:
            fallback_model = next(iter(OPENAI_MODELS.keys()), "gpt-3.5-turbo")
            try:
                # Try using the OpenAI client with SSL handling
                try:
                    from openai import OpenAI
                    
                    # Configure the client with proper SSL settings if needed
                    client_kwargs = {"api_key": openai_api_key}
                    
                    # Create a custom httpx client with proper SSL settings if needed
                    try:
                        import httpx
                        http_client = httpx.Client(
                            timeout=60.0,
                            verify=certifi.where()  # Use proper SSL certificate verification
                        )
                        client_kwargs["http_client"] = http_client
                    except Exception as http_error:
                        print(f"Warning: Could not create custom HTTP client: {http_error}")
                    
                    client = OpenAI(**client_kwargs)
                    
                    response = client.chat.completions.create(
                        model=fallback_model,
                        messages=[
                            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
                            {"role": "user", "content": code_prompt}
                        ],
                        max_tokens=2000
                    )
                    return jsonify({
                        "code": response.choices[0].message.content.strip(),
                        "model": fallback_model
                    })
                except Exception as openai_import_error:
                    print(f"Error with OpenAI client: {str(openai_import_error)}")
                    
                    # Fall back to direct API call if client doesn't work
                    import httpx
                    
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {openai_api_key}"
                    }
                    
                    payload = {
                        "model": fallback_model,
                        "messages": [
                            {"role": "system", "content": "You are a code-only assistant. You must only return code without explanations or markdown formatting."},
                            {"role": "user", "content": code_prompt}
                        ],
                        "max_tokens": 2000
                    }
                    
                    # Use httpx with proper SSL context
                    api_response = httpx.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=60.0,
                        verify=certifi.where()  # Use proper certificate verification
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                        
                        return jsonify({
                            "code": response_text,
                            "model": fallback_model
                        })
                    else:
                        raise Exception(f"OpenAI API call failed: {api_response.status_code} - {api_response.text}")
            except Exception as e:
                print(f"OpenAI API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
        # If we get here, no suitable model was found
        return jsonify({
            "code": "# No model available to generate code",
            "model": "mock"
        }), 503
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in code generation endpoint: {error_msg}")
        print(traceback.format_exc())
        
        return jsonify({
            "code": "# Error: " + str(e),
            "error": error_msg,
            "model": "error"
        }), 500

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
                            max_tokens=2000,
                            messages=[
                                {"role": "user", "content": message_content}
                            ],
                            system="You are a helpful and friendly AI assistant. You should engage in natural conversation, be polite, and provide helpful responses. You can help with coding questions but should also be able to have general conversations."
                        )
                    except TypeError as te:
                        if 'socket_options' in str(te):
                            import httpx
                            http_client = httpx.Client(timeout=None)
                            client = anthropic.Anthropic(
                                api_key=anthropic_api_key,
                                http_client=http_client
                            )
                            response = client.messages.create(
                                model=claude_model,
                                max_tokens=2000,
                                messages=[
                                    {"role": "user", "content": message_content}
                                ],
                                system="You are a code-only assistant. You must only return code without explanations or markdown formatting."
                            )
                        else:
                            raise
                    
                    # Extract the content and clean up markdown code blocks if present
                    if hasattr(response, 'content') and isinstance(response.content, list):
                        response_text = response.content[0].text.strip()
                    else:
                        response_text = str(response.content).strip()
                    
                    # Remove markdown code blocks if present
                    if response_text.startswith("```") and response_text.endswith("```"):
                        # Extract language if specified
                        first_line_end = response_text.find("\n")
                        if first_line_end > 0:
                            language_line = response_text[3:first_line_end].strip()
                            if language_line:  # There's a language specification
                                response_text = response_text[first_line_end+1:-3].strip()
                            else:
                                response_text = response_text[3:-3].strip()
                        else:
                            response_text = response_text[3:-3].strip()
                    
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
                        "max_tokens": 2000,
                        "messages": [{"role": "user", "content": message_content}],
                        "system": "You are a code-only assistant. You must only return code without explanations or markdown formatting."
                    }
                    
                    api_response = httpx.post(
                        "https://api.anthropic.com/v1/messages",
                        headers=headers,
                        json=payload,
                        timeout=30.0
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("content", [{"text": ""}])[0]["text"].strip()
                        
                        # Remove markdown code blocks if present
                        if response_text.startswith("```") and response_text.endswith("```"):
                            # Extract language if specified
                            first_line_end = response_text.find("\n")
                            if first_line_end > 0:
                                language_line = response_text[3:first_line_end].strip()
                                if language_line:  # There's a language specification
                                    response_text = response_text[first_line_end+1:-3].strip()
                                else:
                                    response_text = response_text[3:-3].strip()
                            else:
                                response_text = response_text[3:-3].strip()
                        
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
        
        # If user specifically requests a DeepSeek model or it's set to auto and DeepSeek is available
        is_deepseek_request = requested_model in DEEPSEEK_MODELS.keys() or requested_model == 'auto'
        if is_deepseek_request and deepseek_api_key and not SIMULATE_DEEPSEEK_DOWN:
            try:
                # Import DeepSeek with compatibility handling
                import deepseek
                
                # Determine which DeepSeek model to use
                deepseek_model = requested_model if requested_model in DEEPSEEK_MODELS.keys() else DEFAULT_DEEPSEEK_MODEL
                
                try:
                    # Create DeepSeek client
                    client = deepseek.Client(api_key=deepseek_api_key)
                    
                    try:
                        # Call DeepSeek API for chat
                        response = client.generate(
                            prompt=message_content,
                            model=deepseek_model,
                            max_tokens=2000,
                            temperature=0.7,
                            system_prompt="You are a helpful and friendly AI assistant. You should engage in natural conversation, be polite, and provide helpful responses. You can help with coding questions but should also be able to have general conversations."
                        )
                        return jsonify({
                            "response": response.text.strip(),
                            "model": deepseek_model
                        })
                    except Exception as api_error:
                        print(f"DeepSeek API call error: {str(api_error)}")
                        print(traceback.format_exc())
                        raise
                except Exception as client_error:
                    print(f"DeepSeek client creation error: {str(client_error)}")
                    print(traceback.format_exc())
                    
                    # Try direct API call as fallback
                    import httpx
                    
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {deepseek_api_key}"
                    }
                    
                    payload = {
                        "model": deepseek_model,
                        "messages": [
                            {"role": "system", "content": "You are a helpful and friendly AI assistant. You should engage in natural conversation, be polite, and provide helpful responses. You can help with coding questions but should also be able to have general conversations."},
                            {"role": "user", "content": message_content}
                        ],
                        "max_tokens": 2000,
                        "temperature": 0.7
                    }
                    
                    api_response = httpx.post(
                        "https://api.deepseek.com/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=60.0,
                        verify=certifi.where()
                    )
                    
                    if api_response.status_code == 200:
                        response_json = api_response.json()
                        response_text = response_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                        
                        return jsonify({
                            "response": response_text,
                            "model": deepseek_model
                        })
                    else:
                        raise Exception(f"DeepSeek API call failed: {api_response.status_code} - {api_response.text}")
            except Exception as e:
                print(f"DeepSeek API error: {str(e)}")
                print(traceback.format_exc())
                raise
        
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