import os
import glob
from bs4 import BeautifulSoup

# Find all .html files
html_files = glob.glob("**/*.html", recursive=True)
print(f"Scanning {len(html_files)} HTML files for Weebly branding...")

cleaned_count = 0

for file_path in html_files:
    if "clean_branding.py" in file_path:
        continue

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        soup = BeautifulSoup(content, "html.parser")
        modified = False

        # 1. Target the exact footer container ID and any variants
        target_ids = [
            "weebly-footer-signup-container-v3",
            "weebly-footer-signup-container",
            "weebly-footer-signup",
            "customer-accounts-app",
        ]

        for target_id in target_ids:
            element = soup.find(id=target_id)
            if element:
                element.decompose()
                modified = True

        # 2. Also scrub any elements matching weebly-footer classes or links
        footer_selectors = [
            'div[class*="weebly-footer"]',
            'a[href*="weebly.com/signup"]',
            'a[href*="utm_medium=footer"]'
        ]

        for selector in footer_selectors:
            for el in soup.select(selector):
                el.decompose()
                modified = True

        # 3. Remove Weebly tracking & popup scripts
        for script in soup.find_all("script"):
            src = script.get("src", "")
            if "editmysite.com" in src or "weebly.com" in src:
                script.decompose()
                modified = True

        # 4. Write back cleanly
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(str(soup))
            cleaned_count += 1

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print(f"\nDone! Successfully removed Weebly branding from {cleaned_count} pages.")
