import json
import logging
import httpx
from typing import Dict, Any, Optional, List
from .config import OLLAMA_HOST, OLLAMA_MODEL, DEFAULT_FALLBACK_MODELS
from .models import ExtractedInfo, RiskItem, AIAnalysis

logger = logging.getLogger("internshield.llm")

SYSTEM_PROMPT = """You are an internship safety assistant.
Analyze evidence conservatively.
Never declare a company, recruiter, or internship fraudulent unless independently established evidence proves that fact.
Distinguish facts from inference.
If something cannot be verified, say so.
Your role is to help the student decide what should be independently verified.

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "summary": "A conservative 2-3 sentence assessment of the opportunity's safety signals.",
  "concerns": ["List of specific cautionary signals or red flags identified"],
  "unknowns": ["List of things that cannot be verified from the listing alone"],
  "recommended_actions": ["List of specific verification steps the student should take"]
}
Do not include markdown fences, backticks, or text before/after the JSON.
"""

def detect_available_ollama_model() -> Optional[str]:
    """Query Ollama API to detect available local models, prioritizing lightweight open models."""
    try:
        with httpx.Client(timeout=1.5) as client:
            resp = client.get(f"{OLLAMA_HOST}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                installed = [m["name"] for m in data.get("models", [])]
                if not installed:
                    return None
                
                # 1. Direct configured model match
                for m in installed:
                    if OLLAMA_MODEL == m or (":" in OLLAMA_MODEL and OLLAMA_MODEL in m):
                        return m
                
                # 2. Check prioritized lightweight fallbacks
                for preferred in DEFAULT_FALLBACK_MODELS:
                    for m in installed:
                        if preferred in m or m.startswith(preferred.split(":")[0]):
                            return m
                
                return None
    except Exception as e:
        logger.warning(f"Ollama server check: {e}")
        return None
    return None

def analyze_with_local_llm(
    text: str,
    extracted: ExtractedInfo,
    findings: List[RiskItem]
) -> AIAnalysis:
    """
    Run local open-weight model analysis via Ollama.
    Degrades gracefully if Ollama is offline or times out.
    """
    selected_model = detect_available_ollama_model()
    if not selected_model:
        return AIAnalysis(
            model_used="Rule Engine Mode (Ollama offline/model loading)",
            available=False,
            summary="Local AI analysis unavailable. Risk checks were still completed using InternShield's rule-based safety engine.",
            concerns=[f.title for f in findings],
            unknowns=[
                "Recruiter identity cannot be authenticated from text alone.",
                "Listing existence on official careers portal requires manual verification."
            ],
            recommended_actions=[
                f"Search for {extracted.company}'s official website directly in your browser.",
                "Verify whether this position is listed on the official careers portal.",
                "Never pay upfront fees, registration charges, or share private OTPs/credentials."
            ],
            local_inference=True
        )

    # Format prompt with structured evidence
    prompt = f"""Internship Details:
Company: {extracted.company}
Role: {extracted.role}
Stipend: {extracted.stipend or 'Not specified'}
Location: {extracted.location or 'Not specified'}
Recruiter Contact: {extracted.contact_email or 'None provided'}
Payment Requested: {'Yes (' + extracted.payment_amount + ')' if extracted.payment_requested else 'No'}

Detected Risk Indicators:
{chr(10).join([f"- {f.title}: {f.why_it_matters}" for f in findings]) if findings else "- None detected"}

Full Listing Text:
\"\"\"{text[:1000]}\"\"\"

Generate your conservative evaluation in JSON format now:"""

    try:
        # Responsive timeout so user demo never hangs
        with httpx.Client(timeout=4.0) as client:
            payload = {
                "model": selected_model,
                "prompt": prompt,
                "system": SYSTEM_PROMPT,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "top_p": 0.9,
                    "num_predict": 250
                }
            }
            resp = client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
            if resp.status_code == 200:
                result = resp.json()
                raw_response = result.get("response", "").strip()

                cleaned_json = raw_response
                if cleaned_json.startswith("```"):
                    lines = cleaned_json.split("\n")
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].startswith("```"):
                        lines = lines[:-1]
                    cleaned_json = "\n".join(lines).strip()

                try:
                    parsed = json.loads(cleaned_json)
                    return AIAnalysis(
                        model_used=selected_model,
                        available=True,
                        summary=parsed.get("summary", "Analysis completed by local open-weight model."),
                        concerns=parsed.get("concerns", []),
                        unknowns=parsed.get("unknowns", []),
                        recommended_actions=parsed.get("recommended_actions", []),
                        local_inference=True
                    )
                except json.JSONDecodeError:
                    return AIAnalysis(
                        model_used=selected_model,
                        available=True,
                        summary=raw_response[:300].replace("{", "").replace("}", "") if raw_response else "Local AI evaluated the evidence.",
                        concerns=[f.title for f in findings],
                        unknowns=["Company incorporation status warrants verification."],
                        recommended_actions=[
                            "Check official website directly.",
                            "Verify recruiter credentials on professional networks."
                        ],
                        local_inference=True
                    )
    except Exception as e:
        logger.warning(f"Ollama call timed out or failed: {e}")

    # Fallback if request times out
    return AIAnalysis(
        model_used=f"{selected_model} (Rule-Assisted)",
        available=False,
        summary="Local AI analysis unavailable. Risk checks were still completed using InternShield's rule-based safety engine.",
        concerns=[f.title for f in findings],
        unknowns=[
            "Official domain ownership cannot be validated without web search.",
            "Recruiter identity requires independent confirmation."
        ],
        recommended_actions=[
            "Search for company domain directly in a browser.",
            "Never transfer funds to secure an internship."
        ],
        local_inference=True
    )
