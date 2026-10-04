import ipaddress
import socket
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup

MAX_CONTENT_LENGTH = 500 * 1024  # 500 KB limit
TIMEOUT_SECONDS = 7.0
MAX_REDIRECTS = 3

def is_ip_private_or_reserved(ip_str: str) -> bool:
    """Check if an IP address belongs to private, loopback, link-local, or reserved space."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
            or ip.is_unspecified
        )
    except ValueError:
        return True

def validate_url_safety(url: str) -> str:
    """Validate that the URL scheme is HTTP/HTTPS and resolves to a public IP."""
    parsed = urlparse(url)
    if parsed.scheme.lower() not in ("http", "https"):
        raise ValueError("Only http and https protocols are supported.")

    hostname = parsed.hostname
    if not hostname:
        raise ValueError("Invalid URL: missing hostname.")

    if hostname.lower() in ("localhost", "127.0.0.1", "::1", "0.0.0.0"):
        raise ValueError("Access to local addresses is prohibited.")

    try:
        # Resolve DNS
        addr_info = socket.getaddrinfo(hostname, None)
        ips = [info[4][0] for info in addr_info]
        for ip in ips:
            if is_ip_private_or_reserved(ip):
                raise ValueError("Access to private/internal network addresses is prohibited.")
    except socket.gaierror:
        raise ValueError(f"Could not resolve domain '{hostname}'.")

    return url

def fetch_and_clean_url_text(url: str) -> str:
    """
    Safely fetch internship page content with SSRF safeguards,
    size limits, and timeout protection.
    """
    safe_url = validate_url_safety(url)

    headers = {
        "User-Agent": "InternShield-SafetyBot/1.0 (+https://github.com/internshield/safety)",
        "Accept": "text/html,application/xhtml+xml,text/plain"
    }

    try:
        with httpx.Client(
            timeout=TIMEOUT_SECONDS,
            max_redirects=MAX_REDIRECTS,
            follow_redirects=True,
            verify=True
        ) as client:
            response = client.get(safe_url, headers=headers)

            # Check response status
            if response.status_code != 200:
                raise ValueError(f"HTTP error {response.status_code} while fetching listing.")

            content_type = response.headers.get("content-type", "").lower()
            if not ("text/html" in content_type or "text/plain" in content_type):
                raise ValueError(f"Unsupported content type: {content_type}. Only HTML and text pages can be analyzed.")

            content_bytes = response.content
            if len(content_bytes) > MAX_CONTENT_LENGTH:
                content_bytes = content_bytes[:MAX_CONTENT_LENGTH]

            html_text = content_bytes.decode(response.encoding or "utf-8", errors="replace")

            # Parse with BeautifulSoup
            soup = BeautifulSoup(html_text, "html.parser")

            # Remove scripts, styles, svg, forms
            for element in soup(["script", "style", "noscript", "svg", "nav", "footer", "header"]):
                element.decompose()

            # Extract visible text
            extracted_text = soup.get_text(separator="\n", strip=True)

            # Basic sanity check
            if len(extracted_text) < 50:
                raise ValueError("Could not extract sufficient readable text from the provided URL.")

            return extracted_text[:4000]

    except httpx.TimeoutException:
        raise ValueError("Request timed out while connecting to the target website.")
    except httpx.RequestError as e:
        raise ValueError(f"Network error while fetching URL: {str(e)}")
