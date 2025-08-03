from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Praxify API"
    api_version: str = "1.0.0"
    debug: bool = False
    reload: bool = False
    
    # Gemini API Configuration
    gemini_api_key: Optional[str] = None
    
    # Supabase Configuration
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    
    # CORS Configuration
    cors_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings() 