export interface ExtractedInfo {
  company: string;
  role: string;
  stipend: string;
  location: string;
  recruiter_name: string;
  contact_email: string;
  application_url: string;
  payment_requested: boolean;
  payment_amount: string;
  claims: string[];
  urgency_language: string[];
  sensitive_information_requests: string[];
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  score_impact: number;
  summary: string;
  evidence_quote: string;
  why_it_matters: string;
}

export interface NormalAspect {
  title: string;
  detail: string;
}

export interface UnknownAspect {
  title: string;
  detail: string;
}

export interface AIAnalysis {
  model_used: string;
  available: boolean;
  summary: string;
  concerns: string[];
  unknowns: string[];
  recommended_actions: string[];
  local_inference: boolean;
  disclaimer: string;
}

export interface InvestigationReport {
  company: string;
  role: string;
  risk_score: number;
  risk_level: 'LOW RISK INDICATORS' | 'NEEDS VERIFICATION' | 'HIGH RISK INDICATORS';
  risk_category: 'low' | 'medium' | 'high';
  score_explanation: string;
  important_findings: RiskItem[];
  normal_aspects: NormalAspect[];
  unknowns: UnknownAspect[];
  ai_analysis: AIAnalysis;
  recommended_actions: string[];
  extracted_data: ExtractedInfo;
  source_type: 'text' | 'url';
  source_preview: string;
}

export interface DemoExample {
  id: string;
  title: string;
  badge: string;
  badgeColor: 'red' | 'green' | 'yellow';
  description: string;
  text: string;
}
