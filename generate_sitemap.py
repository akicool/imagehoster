import os
from datetime import datetime

DOMAIN = "https://imagehoster.ru"
OUTPUT_FILE = "sitemap.xml"

STATIC_PAGES = [
    "/",
    "/image/33961d75-6906-46da-83ac-516366654786",
    "/generator",
    # "/about",
    # "/contact",
    # "/terms",
    # "/privacy"
]

def generate_sitemap():
    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S+00:00")
    
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    

    for page in STATIC_PAGES:
        sitemap.append(f"  <url>")
        sitemap.append(f"    <loc>{DOMAIN}{page}</loc>")
        sitemap.append(f"    <lastmod>{now}</lastmod>")
        sitemap.append(f"    <changefreq>monthly</changefreq>")
        sitemap.append(f"    <priority>0.8</priority>")
        sitemap.append(f"  </url>")
    

    images_dir = "uploads/" 
    if os.path.exists(images_dir):
        for filename in os.listdir(images_dir):
            if filename.endswith((".jpg", ".png", ".gif", ".webp")):
                sitemap.append(f"  <url>")
                sitemap.append(f"    <loc>{DOMAIN}/uploads/{filename}</loc>")
                sitemap.append(f"    <lastmod>{now}</lastmod>")
                sitemap.append(f"    <changefreq>weekly</changefreq>")
                sitemap.append(f"    <priority>0.5</priority>")
                sitemap.append(f"  </url>")

    sitemap.append("</urlset>")


    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(sitemap))

    print(f"Sitemap saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_sitemap()
