from typing import List, Optional
from pydantic import BaseModel, Field

class InvestigationRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

class ExtractedInfo(BaseModel):
    company: str = ""
    role: str = ""
    stipend: str = ""
    location: str = ""
    recruiter_name: str = ""
    contact_email: str = ""
    application_url: str = ""
    payment_requested: bool = False
    payment_amount: str = ""
    claims: List[str] = Field(default_factory=list)
    urgency_language: List[str] = Field(default_factory=list)
    sensitive_information_requests: List[str] = Field(default_factory=list)

class RiskItem(BaseModel):
    id: str
    title: str
    severity: str  # "high", "medium", "low", "info"
    score_impact: int
    summary: str
    evidence_quote: str
    why_it_matters: str

class NormalAspect(BaseModel):
    title: str
    detail: str

class UnknownAspect(BaseModel):
    title: str
    detail: str

class AIAnalysis(BaseModel):
    model_used: str
    available: bool
    summary: str
    concerns: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    local_inference: bool = True
    disclaimer: str = "Analysis generated locally via open-weight AI model. Informational only, not legal or fraud determination."

class InvestigationReport(BaseModel):
    company: str
    role: str
    risk_score: int  # 0 to 100
    risk_level: str  # "LOW RISK INDICATORS" | "NEEDS VERIFICATION" | "HIGH RISK INDICATORS"
    risk_category: str  # "low" | "medium" | "high"
    score_explanation: str
    important_findings: List[RiskItem] = Field(default_factory=list)
    normal_aspects: List[NormalAspect] = Field(default_factory=list)
    unknowns: List[UnknownAspect] = Field(default_factory=list)
    ai_analysis: AIAnalysis
    recommended_actions: List[str] = Field(default_factory=list)
    extracted_data: ExtractedInfo
    source_type: str = "text"  # "text" | "url"
    source_preview: str = ""
