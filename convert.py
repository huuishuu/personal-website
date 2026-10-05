import os
import glob
from bs4 import BeautifulSoup

# Output filename
output_file = "wordpress_import.xml"

# Find all HTML files
html_files = glob.glob("**/*.html", recursive=True)
print(f"Found {len(html_files)} HTML pages to process...")

# Strict WXR / XML Header
xml_header = """<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
    <title>Weebly Archive Import</title>
    <link>https://huuishuu.weebly.com</link>
    <description>Archived Weebly Site</description>
    <pubDate>Mon, 05 Oct 2026 00:00:00 +0000</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
"""

xml_footer = """</channel>
</rss>
"""

items_xml = ""

for file_path in html_files:
    if "convert.py" in file_path:
        continue

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            soup = BeautifulSoup(f.read(), "html.parser")

            # Page Title
            page_title = soup.title.string.strip() if soup.title and soup.title.string else os.path.basename(file_path)
            
            # Escape XML special characters in title
            page_title_clean = page_title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

            # Extract main content
            content_div = soup.find("div", class_="wsite-elements") or soup.find("main") or soup.find("body")

            if content_div:
                body_html = str(content_div)
                
                # Wrap content in CDATA block so raw HTML doesn't break XML parsing
                item = f"""
    <item>
        <title>{page_title_clean}</title>
        <dc:creator><![CDATA[admin]]></dc:creator>
        <description></description>
        <content:encoded><![CDATA[{body_html}]]></content:encoded>
        <wp:post_id>{hash(file_path) & 0x7FFFFFFF}</wp:post_id>
        <wp:post_date>2026-10-05 00:00:00</wp:post_date>
        <wp:post_type>page</wp:post_type>
        <wp:status>publish</wp:status>
        <wp:is_sticky>0</wp:is_sticky>
    </item>
"""
                items_xml += item

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

# Write file cleanly
with open(output_file, "w", encoding="utf-8") as out:
    out.write(xml_header + items_xml + xml_footer)

print(f"\nDone! Saved valid WXR export file to: {output_file}")
