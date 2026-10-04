import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS
from .models import InvestigationRequest, InvestigationReport
from .demo_data import DEMO_EXAMPLES
from .url_fetcher import fetch_and_clean_url_text
from .aggregator import generate_investigation_report
from .llm_client import detect_available_ollama_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("internshield")

app = FastAPI(
    title="InternShield API",
    description="Safety investigation engine for student internship & job opportunities.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "InternShield API",
        "tagline": "Think before you apply.",
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    model = detect_available_ollama_model()
    return {
        "status": "healthy",
        "ollama_available": model is not None,
        "active_model": model or "Rule-based engine active (Ollama fallback)"
    }

@app.get("/api/demo-examples")
def get_demo_examples():
    return {"examples": DEMO_EXAMPLES}

@app.post("/api/investigate", response_model=InvestigationReport)
def investigate_opportunity(request: InvestigationRequest):
    target_text = ""
    source_type = "text"
    original_url = None

    if request.url and request.url.strip():
        source_type = "url"
        original_url = request.url.strip()
        try:
            target_text = fetch_and_clean_url_text(original_url)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"URL Analysis Error: {str(ve)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error fetching URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve content from the provided URL."
            )
    elif request.text and request.text.strip():
        target_text = request.text.strip()
        if len(target_text) < 15:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide a more detailed internship description (at least 15 characters)."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either internship text or a listing URL."
        )

    try:
        report = generate_investigation_report(
            text=target_text,
            source_type=source_type,
            original_url=original_url
        )
        return report
    except Exception as e:
        logger.error(f"Investigation pipeline error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Investigation failed: {str(e)}"
        )
