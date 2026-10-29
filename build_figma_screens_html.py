import json
import base64
import os

svg_dir = "public/figma-export"
files = [
    ("01_landing_home.svg", "01. Home / Landing Page (1440 × 1040)", "Hero + 5 circular carousel cards"),
    ("02_the_test_quiz.svg", "02. The Test / Quiz Page (1440 × 980)", "Perception test, subject viewer & factors"),
    ("03_image_library_archive.svg", "03. Image Library / Archive (1440 × 920)", "Cylindrical 3D gallery layout"),
    ("04_results_stats.svg", "04. Results & Matrix (1440 × 1400)", "Score, tier, perception bias & 15-round breakdown"),
    ("05_about_study.svg", "05. About / The Study (1440 × 980)", "Infinite spiral 3D column + study statement"),
    ("06_contact_discussions.svg", "06. Contact & Discussions (1440 × 940)", "Inquiry form & project disclosures card"),
]

svg_data = {}
for fname, title, desc in files:
    path = os.path.join(svg_dir, fname)
    with open(path, "r", encoding="utf-8") as f:
        svg_data[fname] = f.read()

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HUMAN OR AI? — Editable Figma Frames</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Poppins', sans-serif;
      background-color: #ECEBE5;
      color: #111111;
    }}
    .artboard-container {{
      width: 100%;
      max-width: 1440px;
      margin-bottom: 60px;
    }}
    .svg-canvas {{
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
      background: #F5F4EF;
      overflow: hidden;
    }}
    #toast {{
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: #111111;
      color: #FFFFFF;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 20px 30px rgba(0,0,0,0.3);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      transform: translateY(16px);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    #toast.show {{
      opacity: 1;
      transform: translateY(0);
    }}
  </style>
</head>
<body class="py-10 px-6 flex flex-col items-center">

  <div id="toast">
    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
    <span id="toast-text">Copied to clipboard! Switch to Figma and press Ctrl+V / ⌘V.</span>
  </div>

  <!-- Header Banner -->
  <header class="sticky top-4 z-50 bg-white/95 backdrop-blur-md border border-[#D9D9D4] rounded-2xl p-5 shadow-lg mb-10 max-w-[1440px] w-full flex flex-wrap items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2">
        <span class="bg-[#111111] text-white text-xs font-bold px-2 py-0.5 rounded tracking-wide">FIGMA READY</span>
        <h1 class="text-base font-bold text-[#111111] uppercase tracking-wide">HUMAN OR AI? — Direct Vector Frames</h1>
      </div>
      <p class="text-xs text-[#666666] mt-1">
        <strong>No plugins needed:</strong> Click <em>"Copy for Figma"</em> below any screen, then in Figma press <strong>Ctrl+V</strong> (or <strong>⌘V</strong> on Mac). Figma automatically turns it into native vector shapes, auto-layout frames, and editable text layers!
      </p>
    </div>
    <div class="flex items-center gap-3">
      <a href="/figma-export.zip" download="figma-export.zip" class="bg-[#2A4365] hover:bg-[#1E3250] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download All (.zip)
      </a>
      <a href="/" class="bg-white border border-[#D9D9D4] hover:bg-gray-50 text-[#111] text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2">
        ← Back to Live Preview
      </a>
    </div>
  </header>

  <!-- Screens Container -->
  <div class="w-full flex flex-col items-center">
"""

for fname, title, desc in files:
    svg_content = svg_data[fname]
    # Encode for safe javascript string
    b64_content = base64.b64encode(svg_content.encode("utf-8")).decode("utf-8")
    
    html += f"""
    <div class="artboard-container">
      <div class="flex items-center justify-between pb-3 border-b border-[#D5D4CE] mb-4">
        <div>
          <h2 class="text-base font-bold text-[#111111]">{title}</h2>
          <p class="text-xs text-[#777777]">{desc}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="copySvgToClipboard('{b64_content}', '{title}')" class="bg-[#111111] hover:bg-[#2A4365] text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            Copy for Figma (Ctrl+V)
          </button>
          <a href="/figma-export/{fname}" download="{fname}" class="bg-white border border-[#D9D9D4] hover:bg-gray-50 text-[#111] text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download SVG
          </a>
        </div>
      </div>
      <div class="svg-canvas">
        {svg_content}
      </div>
    </div>
    """

html += """
  </div>

  <script>
    function copySvgToClipboard(b64, title) {
      try {
        const svgText = atob(b64);
        
        // Write as text/plain and text/html so Figma's vector parser immediately triggers
        if (navigator.clipboard && navigator.clipboard.write) {
          const textBlob = new Blob([svgText], { type: 'text/plain' });
          const htmlBlob = new Blob([svgText], { type: 'text/html' });
          const item = new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob
          });
          navigator.clipboard.write([item]).then(() => {
            showToast('Copied ' + title + '! Switch to Figma and press Ctrl+V / ⌘V.');
          }).catch(err => {
            // fallback
            fallbackCopy(svgText, title);
          });
        } else {
          fallbackCopy(svgText, title);
        }
      } catch (e) {
        console.error(e);
      }
    }

    function fallbackCopy(text, title) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied ' + title + '! Switch to Figma and press Ctrl+V / ⌘V.');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied ' + title + '! Switch to Figma and press Ctrl+V / ⌘V.');
      });
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const text = document.getElementById('toast-text');
      text.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  </script>
</body>
</html>
"""

with open("public/figma-screens.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Generated updated public/figma-screens.html with inline SVGs and direct copy buttons!")
