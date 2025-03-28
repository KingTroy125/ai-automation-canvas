from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

# Check for API key
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

app = FastAPI()

# Update origins to match your Vite dev server port (5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# Initialize Anthropic client
anthropic = Anthropic(api_key=api_key)

class Message(BaseModel):
    content: str

@app.post("/chat")
async def chat(message: Message):
    try:
        print(f"Received message: {message.content}")
        response = anthropic.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": message.content
                }
            ]
        )
        return {"response": response.content[0].text}
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(error_msg)
        raise HTTPException(
            status_code=401 if "invalid x-api-key" in str(e).lower() else 500,
            detail=error_msg
        )

@app.get("/verify-key")
async def verify_key():
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found in environment")
    return {"status": "API key is set"}