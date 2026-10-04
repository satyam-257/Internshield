import sys
import io

# Ensure UTF-8 output on Windows
if sys.platform.startswith("win"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

from app.aggregator import generate_investigation_report
from app.demo_data import DEMO_EXAMPLES

def run_tests():
    print("=" * 60)
    print("RUNNING INTERNSHIELD VERIFICATION TESTS")
    print("=" * 60)

    # 1. Test Required NexaByte Case
    test_case_text = DEMO_EXAMPLES[0]["text"]
    print("\n--- Test Case 1: Required NexaByte Listing ---")
    report = generate_investigation_report(test_case_text)
    
    print(f"Company: {report.company}")
    print(f"Role: {report.role}")
    print(f"Risk Score: {report.risk_score} / 100")
    print(f"Risk Level: {report.risk_level}")
    print(f"Risk Category: {report.risk_category}")
    print(f"Findings Count: {len(report.important_findings)}")
    for f in report.important_findings:
        print(f"  - [{f.severity.upper()}] {f.title} (+{f.score_impact})")

    assert report.risk_score >= 50, f"Expected High Risk (>=50), got {report.risk_score}"
    assert report.risk_level == "HIGH RISK INDICATORS"
    assert any("payment" in f.id for f in report.important_findings), "Missing payment detection"
    assert any("generic" in f.id or "email" in f.id for f in report.important_findings), "Missing generic email detection"
    assert any("interview" in f.id for f in report.important_findings), "Missing no interview detection"
    assert any("urgency" in f.id for f in report.important_findings), "Missing urgency detection"
    print(">>> Test Case 1: PASSED (Correctly flagged as HIGH RISK with all indicators)")

    # 2. Test Legitimate Case
    print("\n--- Test Case 2: Legitimate Acme Systems Listing ---")
    legit_report = generate_investigation_report(DEMO_EXAMPLES[1]["text"])
    print(f"Risk Score: {legit_report.risk_score} / 100")
    print(f"Risk Level: {legit_report.risk_level}")
    assert legit_report.risk_score < 25, f"Expected Low Risk (<25), got {legit_report.risk_score}"
    assert legit_report.risk_level == "LOW RISK INDICATORS"
    print(">>> Test Case 2: PASSED (Correctly flagged as LOW RISK)")

    # 3. Test Ambiguous Case
    print("\n--- Test Case 3: Ambiguous NovaPulse Listing ---")
    ambig_report = generate_investigation_report(DEMO_EXAMPLES[2]["text"])
    print(f"Risk Score: {ambig_report.risk_score} / 100")
    print(f"Risk Level: {ambig_report.risk_level}")
    assert 25 <= ambig_report.risk_score < 50, f"Expected Caution/Needs Verification, got {ambig_report.risk_score}"
    assert ambig_report.risk_level == "NEEDS VERIFICATION"
    print(">>> Test Case 3: PASSED (Correctly flagged as NEEDS VERIFICATION)")

    print("\n" + "=" * 60)
    print("ALL CORE DETERMINISTIC & AGGREGATION TESTS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
