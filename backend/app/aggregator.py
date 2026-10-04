from typing import Optional
from .models import InvestigationReport, ExtractedInfo, AIAnalysis
from .extractor import extract_structured_info
from .risk_engine import analyze_risks
from .llm_client import analyze_with_local_llm

def generate_investigation_report(
    text: str,
    source_type: str = "text",
    original_url: Optional[str] = None
) -> InvestigationReport:
    """
    Unified investigation pipeline:
    1. Extract structured info
    2. Run deterministic risk engine
    3. Run local open-weight AI analysis
    4. Aggregate into explainable investigation report
    """
    clean_text = text.strip()
    
    # 1. Structured Information Extraction
    extracted: ExtractedInfo = extract_structured_info(clean_text)
    if original_url and not extracted.application_url:
        extracted.application_url = original_url

    # 2. Deterministic Risk Engine
    risk_score, risk_level, risk_category, score_explanation, findings, normal_aspects, unknowns, recommended_actions = analyze_risks(
        clean_text, extracted
    )

    # 3. Local Open-Weight LLM Analysis
    ai_analysis: AIAnalysis = analyze_with_local_llm(
        clean_text, extracted, findings
    )

    # Merge any unique AI recommendations with engine recommendations
    if ai_analysis.recommended_actions:
        for act in ai_analysis.recommended_actions:
            if act not in recommended_actions:
                recommended_actions.append(act)

    # Source preview snippet
    source_preview = clean_text[:250] + ("..." if len(clean_text) > 250 else "")

    return InvestigationReport(
        company=extracted.company or "Unspecified Organization",
        role=extracted.role or "Internship Opportunity",
        risk_score=risk_score,
        risk_level=risk_level,
        risk_category=risk_category,
        score_explanation=score_explanation,
        important_findings=findings,
        normal_aspects=normal_aspects,
        unknowns=unknowns,
        ai_analysis=ai_analysis,
        recommended_actions=recommended_actions,
        extracted_data=extracted,
        source_type=source_type,
        source_preview=source_preview
    )
