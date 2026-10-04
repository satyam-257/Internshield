import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
# Configurable model preference
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")
DEFAULT_FALLBACK_MODELS = ["qwen2.5:0.5b", "qwen2.5:1.5b", "qwen2.5:3b", "qwen3:4b", "gemma4:e4b", "llama3.2:1b"]

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]
