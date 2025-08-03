# 🚀 Praxify Backend Setup Guide

This guide will help you set up the Praxify backend API with FastAPI and Gemini AI integration.

## 📋 Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## 🛠️ Installation Steps

### 1. Navigate to the API Directory
```bash
cd api
```

### 2. Create a Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the `api` directory:
```bash
# Copy the example file
cp env.example .env
```

Edit the `.env` file and add your Gemini API key:
```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Supabase Configuration (for future use)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# API Configuration
DEBUG=false
```

### 5. Run the Development Server
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 🧪 Testing the API

### Using the Test Script
```bash
python test_elicit.py
```

### Using curl
```bash
# Health check
curl http://localhost:8000/api/elicit/health

# Test elicitation
curl -X POST http://localhost:8000/api/elicit \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "I want to build a mobile app for a local restaurant that allows customers to browse the menu, place orders online, and track their order status."
  }'
```

### Using the Interactive API Documentation
Visit `http://localhost:8000/docs` in your browser to see the interactive Swagger UI documentation.

## 📁 Project Structure

```
api/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── test_elicit.py         # Test script
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py      # Configuration settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── elicitation.py # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── gemini_service.py # Gemini AI integration
│   ├── controllers/
│   │   ├── __init__.py
│   │   └── elicitation_controller.py # Business logic
│   └── routers/
│       ├── __init__.py
│       └── elicit.py      # API routes
└── README.md              # Original README
```

## 🔧 API Endpoints

### POST `/api/elicit`
Generates clarifying questions and user personas from a project idea.

**Request Body:**
```json
{
  "idea": "Your project idea here..."
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What specific problem are you trying to solve?",
      "category": "functional",
      "priority": "high"
    }
  ],
  "personas": [
    {
      "name": "Primary User",
      "role": "End User",
      "description": "Description of the persona",
      "goals": ["Goal 1", "Goal 2"],
      "pain_points": ["Pain point 1", "Pain point 2"]
    }
  ],
  "summary": "Brief analysis of the project idea",
  "next_steps": ["Step 1", "Step 2", "Step 3"]
}
```

### GET `/api/elicit/health`
Health check endpoint for the elicitation service.

## 🐛 Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Make sure you're in the virtual environment and have installed dependencies
   ```bash
   pip install -r requirements.txt
   ```

2. **Gemini API Key Error**: Ensure your `.env` file has the correct API key
   ```bash
   # Check if the key is loaded
   python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('GEMINI_API_KEY:', os.getenv('GEMINI_API_KEY')[:10] + '...' if os.getenv('GEMINI_API_KEY') else 'Not set')"
   ```

3. **Port Already in Use**: Change the port in `main.py` or kill the process using the port
   ```bash
   # On Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # On macOS/Linux
   lsof -ti:8000 | xargs kill -9
   ```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key"
4. Create a new API key or use an existing one
5. Copy the key and add it to your `.env` file

## 🚀 Deployment

For deployment to Vercel or other serverless platforms, the FastAPI app is structured to work with serverless functions. The main entry point is `main.py` which creates the FastAPI app instance.

## 📚 Next Steps

- [ ] Add validation endpoint (`/api/validate`)
- [ ] Add visualization endpoint (`/api/visualize`)
- [ ] Integrate with Supabase for data persistence
- [ ] Add authentication and user management
- [ ] Implement rate limiting and caching 