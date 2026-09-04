#!/usr/bin/env python3
"""Render src/assets/CV/CV.txt into Charles_Goodsir_CV.pdf (the downloadable CV).

Usage:
    pip install reportlab
    python scripts/build_cv_pdf.py

Edit CV.txt, re-run this, commit both. CV.txt format:
  line 1            name
  line 2            contact line (bullet-separated)
  ALL-CAPS line     section heading (must be listed in SECTIONS below)
  "A | B | C"       role / title line; an immediately following "X | Y" line is its meta line
  "• ..."           bullet; continuation lines are indented two spaces, no bullet
  [label](url)      inline hyperlink, rendered in the accent colour (works anywhere)
"""
import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

CV_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "CV"
SRC = CV_DIR / "CV.txt"
OUT = CV_DIR / "Charles_Goodsir_CV.pdf"

SECTIONS = {
    "PROFESSIONAL SUMMARY", "EXPERIENCE", "APPLICATION SECURITY (SELF-DIRECTED)",
    "PROJECTS", "EDUCATION & CERTIFICATIONS", "SKILLS",
}

INK = HexColor("#1a1a1a")
MUTED = HexColor("#555555")
ACCENT = HexColor("#3a3a3a")
LINK = "#1A56A0"

_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")

name = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=19, leading=22,
                      textColor=INK, spaceAfter=2)
contact = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.5, leading=12,
                         textColor=MUTED, spaceAfter=10)
section = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10.5, leading=13,
                         textColor=INK, spaceBefore=11, spaceAfter=3)
role = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=9.5, leading=12,
                      textColor=INK, spaceBefore=6, spaceAfter=0)
meta = ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
                      textColor=MUTED, spaceAfter=3)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=9, leading=12.5,
                      textColor=ACCENT, spaceAfter=3)
bullet = ParagraphStyle("bullet", parent=body, leftIndent=10, bulletIndent=0, spaceAfter=2)
plain = ParagraphStyle("plain", parent=body, spaceAfter=2)


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def fmt(t):
    """Escape text and turn [label](url) into accent-coloured <a> links."""
    out, pos = [], 0
    for m in _LINK_RE.finditer(t):
        out.append(esc(t[pos:m.start()]))
        label, url = esc(m.group(1)), m.group(2).replace('"', "%22")
        out.append(f'<a href="{url}"><font color="{LINK}">{label}</font></a>')
        pos = m.end()
    out.append(esc(t[pos:]))
    return "".join(out)


def build():
    lines = SRC.read_text().splitlines()
    story = [
        Paragraph(esc(lines[0].strip()), name),
        Paragraph(fmt(lines[1].strip()).replace("•", "&nbsp;&nbsp;•&nbsp;&nbsp;"), contact),
    ]
    i = 2
    while i < len(lines):
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        if s in SECTIONS:
            story.append(Spacer(1, 2))
            story.append(Paragraph(esc(s), section))
            story.append(HRFlowable(width="100%", thickness=0.6, color=HexColor("#bbbbbb"),
                                    spaceBefore=1, spaceAfter=3))
            i += 1
        elif s.startswith("•"):
            text = fmt(s[1:].strip())
            j = i + 1
            while (j < len(lines) and lines[j].startswith("  ")
                   and lines[j].strip() and not lines[j].strip().startswith("•")):
                text += " " + fmt(lines[j].strip())
                j += 1
            story.append(Paragraph(text, bullet, bulletText="•"))
            i = j
        elif (" | " in s and i + 1 < len(lines) and "|" in lines[i + 1]
              and lines[i + 1].strip() and not lines[i + 1].strip().startswith("•")):
            story.append(Paragraph(esc(s), role))
            story.append(Paragraph(esc(lines[i + 1].strip()), meta))
            i += 2
        elif " | " in s:
            story.append(Paragraph(esc(s), role))
            i += 1
        else:
            story.append(Paragraph(fmt(s), plain))
            i += 1

    SimpleDocTemplate(str(OUT), pagesize=A4,
                      leftMargin=16 * mm, rightMargin=16 * mm,
                      topMargin=14 * mm, bottomMargin=14 * mm,
                      title="Charles Goodsir CV", author="Charles Goodsir").build(story)
    print("wrote", OUT)


if __name__ == "__main__":
    build()
