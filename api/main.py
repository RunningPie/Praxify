import warnings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import elicit, validate
from app.core.config import settings

# Suppress Pydantic field shadowing warnings from Google Generative AI SDK
warnings.filterwarnings("ignore", message="Field name .* shadows an attribute in parent")

# Load environment variables
load_dotenv()

# Debug environment variables
print("🔧 Starting Praxify API...")
print(f"🔑 GEMINI_API_KEY available: {bool(os.getenv('GEMINI_API_KEY'))}")
if os.getenv('GEMINI_API_KEY'):
    print(f"🔑 GEMINI_API_KEY preview: {os.getenv('GEMINI_API_KEY')[:10]}...")
else:
    print("❌ GEMINI_API_KEY not found in environment variables")

# Create FastAPI app
app = FastAPI(
    title="Praxify API",
    description="AI-powered requirements elicitation and validation API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(elicit.router, prefix="/api", tags=["elicitation"])
app.include_router(validate.router, prefix="/api", tags=["validation"])

@app.get("/")
async def root():
    return {"message": "Praxify API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Praxify API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=7001,
        reload=settings.reload
    ) 