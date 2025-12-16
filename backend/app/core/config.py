from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "LLM Toolkit"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/llm_toolkit"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # AWS
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    
    # S3
    S3_BUCKET_PREFIX: str = "llm-toolkit"
    
    # SageMaker
    SAGEMAKER_EXECUTION_ROLE: str = ""
    
    # OpenAI (for AI assistant)
    OPENAI_API_KEY: str = ""
    
    # Cognito (optional)
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
