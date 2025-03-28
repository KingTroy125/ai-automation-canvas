# Chat Assistant Backend

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Anthropic API key to the `.env` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python run.py
```

**Note**: Never commit your `.env` file or share your API key publicly!