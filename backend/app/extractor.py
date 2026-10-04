import re
from typing import Dict, Any, List
from .models import ExtractedInfo

# Common regex patterns
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
URL_REGEX = re.compile(r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[/\w\.-]*')

PAYMENT_PATTERNS = [
    r'(?:refundable\s+)?(?:registration|training|security|processing|application|seat)\s+fee',
    r'refundable\s+(?:deposit|amount)',
    r'pay\s+(?:a\s+)?(?:fee\s+of\s+)?(?:₹|rs\.?|inr|\$)\s*[\d,]+',
    r'deposit\s+of\s+(?:₹|rs\.?|inr|\$)\s*[\d,]+',
    r'pay\s+[\d,]+\s*(?:inr|rs|rupees)',
    r'submit\s+a\s+(?:refundable\s+)?registration\s+fee',
    r'course\s+fee',
    r'pay\s+to\s+confirm',
    r'security\s+deposit'
]

# Negation patterns for fees: "no application fee", "no registration fee", "we never ask for fees", etc.
NEGATION_FEE_REGEX = re.compile(r'(?:no|never|not|without\s+any|zero)\s+[a-z\s]{0,35}(?:fee|deposit|charge|cost|payment)', re.IGNORECASE)

AMOUNT_REGEX = re.compile(r'(?:₹|rs\.?|inr|\$)\s*[\d,]+', re.IGNORECASE)

URGENCY_PATTERNS = [
    r'apply\s+immediately',
    r'limited\s+(?:seats|vacancies|slots)',
    r'last\s+chance',
    r'today\s+only',
    r'offer\s+expires',
    r'pay\s+now',
    r'payment\s+must\s+be\s+completed\s+today',
    r'confirm\s+immediately',
    r'urgent\s+(?:hiring|requirement|opening)',
    r'within\s+\d+\s+hours',
    r'only\s+\d+\s+(?:seats|slots)\s+remaining'
]

NO_INTERVIEW_PATTERNS = [
    r'no\s+interview\s*(?:required)?',
    r'direct\s+selection',
    r'guaranteed\s+selection',
    r'100%\s+placement',
    r'instant\s+offer',
    r'shortlisted\s+directly',
    r'no\s+test\s+required',
    r'direct\s+joining'
]

SENSITIVE_PATTERNS = [
    r'bank\s+details',
    r'bank\s+account',
    r'otp',
    r'one[-\s]time\s+password',
    r'password',
    r'debit\s+card',
    r'credit\s+card',
    r'cvv',
    r'upi\s+pin',
    r'net\s+banking',
    r'atm\s+pin'
]

UNREALISTIC_PATTERNS = [
    r'earn\s+(?:₹|rs\.?|inr|\$)\s*[\d,]+\s*per\s*(?:month\s+while\s+working\s+\d+\s*hours|hour|2\s*hours|day)',
    r'work\s+\d+\s*hours?\s*per\s*day.*earn',
    r'guaranteed\s+internship',
    r'guaranteed\s+certificate\s*\+\s*job',
    r'guaranteed\s+job'
]

def extract_structured_info(text: str) -> ExtractedInfo:
    """Deterministic extractor for structured internship information."""
    if not text:
        return ExtractedInfo()

    clean_text = text.strip()
    lower_text = clean_text.lower()
    first_line = clean_text.split('\n')[0].strip()

    # Extract emails and strip trailing punctuation
    raw_emails = EMAIL_REGEX.findall(clean_text)
    contact_email = raw_emails[0].rstrip('.,;:<>') if raw_emails else ""

    # Extract URLs
    urls = URL_REGEX.findall(clean_text)
    application_url = urls[0].rstrip('.,;:<>') if urls else ""

    # Extract Role
    role = ""
    role_explicit = re.search(r'(?:role|position|title)[:\s]+([A-Za-z0-9/ ]+)', clean_text, re.IGNORECASE)
    if role_explicit:
        role = role_explicit.group(1).split('\n')[0].strip()
    else:
        role_match = re.search(r'([A-Za-z0-9/ ]+Intern(?:ship)?(?: Program)?)', first_line, re.IGNORECASE)
        if role_match:
            r_candidate = role_match.group(1).strip()
            if " at " in r_candidate:
                r_candidate = r_candidate.split(" at ")[0].strip()
            role = r_candidate
        else:
            role_match_body = re.search(r'([A-Za-z0-9/ ]{3,30}\sIntern(?:ship)?(?: Program)?)', clean_text, re.IGNORECASE)
            if role_match_body:
                role = role_match_body.group(1).strip()
            else:
                role = "Internship Opportunity"

    # Extract Company
    company = ""
    comp_explicit = re.search(r'(?:company|organization|employer)[:\s]+([A-Za-z0-9\s&]+)', clean_text, re.IGNORECASE)
    if comp_explicit:
        company = comp_explicit.group(1).split('\n')[0].strip()
    else:
        if ' at ' in first_line:
            parts = first_line.split(' at ')
            company = parts[-1].strip().strip('.:-')
        elif '-' in first_line:
            parts = first_line.split('-')
            company = parts[-1].strip().strip('.:-')
        else:
            comp_match = re.search(r'(?:at|with|by)\s+([A-Z][A-Za-z0-9\s&]{2,30}?)(?:\s+(?:is hiring|Technologies|Labs|Corp|Inc|Solutions|Pvt|Ltd|LLC|Team|We are|\.|\n))', clean_text)
            if comp_match:
                company = comp_match.group(1).strip()
            else:
                comp_match2 = re.search(r'([A-Z][A-Za-z0-9\s&]{2,30}?)\s+(?:is hiring|is selecting|is inviting|announces)', clean_text)
                if comp_match2:
                    company = comp_match2.group(1).strip()

    if not company or len(company) > 50:
        company = "Unspecified Organization"

    # Extract Stipend
    stipend = ""
    stipend_match = re.search(r'(?:earn|stipend|salary|pay|compensation)?\s*(?:₹|rs\.?|inr|\$)\s*[\d,]+(?:\s*(?:per|/)\s*(?:month|mo|hr|hour|week))?', clean_text, re.IGNORECASE)
    if stipend_match:
        stipend = stipend_match.group(0).strip()
    elif "unpaid" in lower_text:
        stipend = "Unpaid"

    # Extract Location
    location = ""
    if "remote" in lower_text or "work from home" in lower_text or "wfh" in lower_text:
        location = "Remote / Work From Home"
    elif "hybrid" in lower_text:
        location = "Hybrid"
    else:
        loc_match = re.search(r'location[:\s]+([A-Za-z\s,]+)', clean_text, re.IGNORECASE)
        if loc_match:
            location = loc_match.group(1).split('\n')[0].strip()
        else:
            location = "Not Specified"

    # Payment requested check with negation awareness
    payment_requested = False
    payment_amount = ""

    # Check positive patterns
    for pat in PAYMENT_PATTERNS:
        match = re.search(pat, lower_text)
        if match:
            # Check if this occurrence is negated
            matched_span = match.span()
            preceding_context = lower_text[max(0, matched_span[0] - 30):matched_span[0]]
            if any(neg in preceding_context for neg in ["no ", "never ", "without ", "zero ", "not "]):
                continue
            payment_requested = True
            break

    if payment_requested:
        fee_match = re.search(r'(?:fee|deposit|amount|pay|charge)(?:[^\n\.\,\;]{0,35})((?:₹|rs\.?|inr|\$)\s*[\d,]+)', clean_text, re.IGNORECASE)
        if fee_match:
            payment_amount = fee_match.group(1).strip()
        else:
            all_amounts = AMOUNT_REGEX.findall(clean_text)
            if all_amounts:
                payment_amount = all_amounts[-1]

    # Urgency language detection
    urgency_language = []
    for pat in URGENCY_PATTERNS:
        matches = re.finditer(pat, clean_text, re.IGNORECASE)
        for m in matches:
            phrase = m.group(0).strip()
            if phrase not in urgency_language:
                urgency_language.append(phrase)

    # Claims detection
    claims = []
    for pat in NO_INTERVIEW_PATTERNS:
        matches = re.finditer(pat, clean_text, re.IGNORECASE)
        for m in matches:
            phrase = m.group(0).strip()
            if phrase not in claims:
                claims.append(phrase)

    for pat in UNREALISTIC_PATTERNS:
        matches = re.finditer(pat, clean_text, re.IGNORECASE)
        for m in matches:
            phrase = m.group(0).strip()
            if phrase not in claims:
                claims.append(phrase)

    # Sensitive information requests
    sensitive_requests = []
    for pat in SENSITIVE_PATTERNS:
        matches = re.finditer(pat, clean_text, re.IGNORECASE)
        for m in matches:
            phrase = m.group(0).strip()
            if phrase not in sensitive_requests:
                sensitive_requests.append(phrase)

    return ExtractedInfo(
        company=company,
        role=role,
        stipend=stipend,
        location=location,
        recruiter_name="HR Recruitment Team",
        contact_email=contact_email,
        application_url=application_url,
        payment_requested=payment_requested,
        payment_amount=payment_amount,
        claims=claims,
        urgency_language=urgency_language,
        sensitive_information_requests=sensitive_requests
    )
