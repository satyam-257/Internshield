import re
from typing import List, Tuple
from .models import ExtractedInfo, RiskItem, NormalAspect, UnknownAspect

GENERIC_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com",
    "icloud.com", "protonmail.com", "aol.com", "mail.com", "zoho.com"
}

def analyze_risks(
    text: str,
    extracted: ExtractedInfo
) -> Tuple[int, str, str, str, List[RiskItem], List[NormalAspect], List[UnknownAspect], List[str]]:
    """
    Deterministic safety analysis engine.
    Calculates transparent weighted risk score and produces explainable evidence cards.
    NEVER accuses of fraud; presents calibrated risk indicators.
    """
    score = 0
    findings: List[RiskItem] = []
    normal_aspects: List[NormalAspect] = []
    unknowns: List[UnknownAspect] = []
    recommended_actions: List[str] = []

    lower_text = text.lower()

    # 1. Applicant Payment Requested (+30)
    if extracted.payment_requested:
        score += 30
        fee_display = f" ({extracted.payment_amount})" if extracted.payment_amount else ""
        findings.append(RiskItem(
            id="payment_requested",
            title=f"Applicant payment requested{fee_display}",
            severity="high",
            score_impact=30,
            summary=f"A payment requirement was detected in the listing{fee_display}.",
            evidence_quote=f"Detected payment context: {extracted.payment_amount or 'Registration / training fee requested'}",
            why_it_matters="Payment requirements deserve independent verification before proceeding. Legitimate recruitment processes rarely depend on applicants paying fees to secure an internship or training."
        ))
        recommended_actions.append("Do not send money or registration fees until you have independently verified the opportunity through official corporate channels.")
    else:
        normal_aspects.append(NormalAspect(
            title="No upfront payment requested",
            detail="The listing does not mention mandatory candidate application or registration fees."
        ))

    # 2. Sensitive Credential Request (+40, Critical)
    if extracted.sensitive_information_requests:
        score += 40
        items_joined = ", ".join(extracted.sensitive_information_requests)
        findings.append(RiskItem(
            id="sensitive_credentials",
            title="Sensitive credential or financial information requested",
            severity="high",
            score_impact=40,
            summary=f"Request for sensitive personal or financial information: {items_joined}",
            evidence_quote=f"Identified terms: {items_joined}",
            why_it_matters="Legitimate employers never request bank passwords, OTPs, UPI PINs, or credit card details during the application phase. Never disclose authentication secrets."
        ))
        recommended_actions.append("CRITICAL: Never share passwords, OTPs, CVV, or UPI PINs under any circumstances.")

    # 3. Recruiter Email Domain Check
    if extracted.contact_email:
        email_domain = extracted.contact_email.split('@')[-1].lower() if '@' in extracted.contact_email else ""
        
        # Check generic email provider (+10)
        if email_domain in GENERIC_EMAIL_DOMAINS:
            score += 10
            findings.append(RiskItem(
                id="generic_email",
                title=f"Generic recruiter email address ({extracted.contact_email})",
                severity="medium",
                score_impact=10,
                summary="The recruiter uses a public free email service rather than an organization domain.",
                evidence_quote=extracted.contact_email,
                why_it_matters="The recruiter uses a generic email provider rather than an official company domain. While early-stage startups sometimes use free email services, established companies typically communicate using their registered domain."
            ))
            recommended_actions.append(f"Search for the company's official domain to check if {extracted.contact_email} is listed as a legitimate contact.")
            
            # Domain Mismatch (+15)
            if extracted.company and extracted.company.lower() not in ["unspecified organization", ""]:
                score += 15
                findings.append(RiskItem(
                    id="domain_mismatch",
                    title="Recruiter email does not match organization domain",
                    severity="medium",
                    score_impact=15,
                    summary=f"Recruiter contact ({extracted.contact_email}) does not use a domain associated with '{extracted.company}'.",
                    evidence_quote=f"Company: {extracted.company} | Contact: {extracted.contact_email}",
                    why_it_matters="Recruiter email does not use the organization's domain. Unofficial communication channels make it harder to verify recruiter affiliation."
                ))
        else:
            # Custom domain (e.g. university-recruiting@acmesoftware.io)
            domain_name = email_domain.split('.')[0].lower()
            comp_clean = re.sub(r'[^a-zA-Z0-9]', '', extracted.company).lower()
            
            # Check if domain matches company name
            if domain_name in comp_clean or (comp_clean and comp_clean in domain_name) or any(part in domain_name for part in comp_clean.split() if len(part) >= 4):
                normal_aspects.append(NormalAspect(
                    title=f"Verified corporate domain ({email_domain})",
                    detail=f"Recruiter contact uses domain '{email_domain}' consistent with '{extracted.company}'."
                ))
            else:
                score += 15
                findings.append(RiskItem(
                    id="domain_mismatch",
                    title="Recruiter domain differs from organization name",
                    severity="medium",
                    score_impact=15,
                    summary=f"Recruiter email domain '{email_domain}' does not clearly match company name '{extracted.company}'.",
                    evidence_quote=f"Company: {extracted.company} | Domain: {email_domain}",
                    why_it_matters="Recruiter email domain does not match company branding, which warrants checking company ownership."
                ))
    else:
        unknowns.append(UnknownAspect(
            title="Recruiter contact email absent",
            detail="No direct email address was detected in the listing text."
        ))

    # 4. No Interview / Direct Selection Claim (+10)
    no_interview_found = False
    for claim in extracted.claims:
        if any(term in claim.lower() for term in ["no interview", "direct selection", "guaranteed selection", "100% placement", "instant offer", "shortlisted directly"]):
            no_interview_found = True
            break

    if no_interview_found:
        score += 10
        matching_claims = [c for c in extracted.claims if any(term in c.lower() for term in ["interview", "direct", "shortlist", "instant", "100%"])]
        findings.append(RiskItem(
            id="no_interview",
            title="Direct selection / No interview claimed",
            severity="medium",
            score_impact=10,
            summary="The listing claims candidates are selected directly without technical or behavioral evaluation.",
            evidence_quote=", ".join(matching_claims) if matching_claims else "Direct selection / no interview",
            why_it_matters="Offers extended without any screening or interview process are unusual for genuine professional roles. Legitimate organizations assess candidate capabilities before making commitments."
        ))
        recommended_actions.append("Ask the recruiter about the screening and evaluation process before accepting an offer.")
    else:
        normal_aspects.append(NormalAspect(
            title="Standard evaluation implied",
            detail="The listing does not claim automatic or guaranteed direct selection without an interview."
        ))

    # 5. Extreme Urgency Language (+10)
    if extracted.urgency_language:
        score += 10
        urgency_items = ", ".join(extracted.urgency_language)
        findings.append(RiskItem(
            id="urgency_tactics",
            title="Urgency tactics detected",
            severity="medium",
            score_impact=10,
            summary=f"High-pressure time or seat constraints detected: {urgency_items}",
            evidence_quote=urgency_items,
            why_it_matters="Urgency phrases like 'limited seats', 'today only', or 'confirm immediately' create artificial pressure to push candidates into rapid decisions without time for verification."
        ))
        recommended_actions.append("Take time to verify the opportunity independently. Never rush into financial commitments under pressure.")

    # 6. Unrealistic Promises / Guarantees (+10)
    unrealistic_claims = [c for c in extracted.claims if any(term in c.lower() for term in ["earn", "guaranteed", "work 2 hours", "trivial"])]
    if unrealistic_claims:
        score += 10
        claims_text = ", ".join(unrealistic_claims)
        findings.append(RiskItem(
            id="unrealistic_promises",
            title="Disproportionate earnings or placement guarantee",
            severity="medium",
            score_impact=10,
            summary=f"Compensation or terms appear disproportionate: {claims_text}",
            evidence_quote=claims_text,
            why_it_matters="Unusually high compensation for minimal hours or unconditional placement guarantees are common attractors in questionable listings."
        ))

    # Additional standard Normal Aspects
    if extracted.role and extracted.role != "Internship Opportunity":
        normal_aspects.append(NormalAspect(
            title="Role description specified",
            detail=f"Target role defined as '{extracted.role}'."
        ))
    if extracted.stipend:
        normal_aspects.append(NormalAspect(
            title="Stipend information specified",
            detail=f"Mentioned compensation: {extracted.stipend}."
        ))
    if extracted.location and extracted.location != "Not Specified":
        normal_aspects.append(NormalAspect(
            title="Work arrangement specified",
            detail=f"Location or work model specified: {extracted.location}."
        ))

    # Standard Unknowns
    unknowns.append(UnknownAspect(
        title="Recruiter's verified identity",
        detail="Individual recruiter profile cannot be independently authenticated from listing text alone."
    ))
    unknowns.append(UnknownAspect(
        title="Official careers portal presence",
        detail=f"Whether this role is published on {extracted.company}'s official careers page requires manual cross-referencing."
    ))

    # Cap score at 100
    risk_score = min(100, max(0, score))

    # Determine risk category & label
    if risk_score >= 50:
        risk_level = "HIGH RISK INDICATORS"
        risk_category = "high"
    elif risk_score >= 25:
        risk_level = "NEEDS VERIFICATION"
        risk_category = "medium"
    else:
        risk_level = "LOW RISK INDICATORS"
        risk_category = "low"

    score_explanation = "This score summarizes detected warning signals and structural anomalies. It is not proof that an opportunity is fraudulent, but highlights areas that warrant candidate caution."

    # Standard recommended next steps
    standard_steps = [
        f"Find {extracted.company}'s official website independently via search engine (do not click untrusted links).",
        "Look for the internship on the company's official careers or jobs page.",
        "Contact the company HR team using contact information verified from their primary domain.",
        "Never send money, application fees, or security deposits to secure an internship.",
        "Never share passwords, OTPs, debit/credit card credentials, or UPI PINs."
    ]
    for step in standard_steps:
        if step not in recommended_actions:
            recommended_actions.append(step)

    return risk_score, risk_level, risk_category, score_explanation, findings, normal_aspects, unknowns, recommended_actions
