APEX OS Investor Pitch Deck Generator v2
Clean, minimal, professional design inspired by OpenAI / top-tier startup decks.
$200K Pre-Beta Angel Round.
Updated: Defensibility narrative addressing low barrier to entry.
"""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Paragraph, Frame, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
import os

# ─── DESIGN SYSTEM ───────────────────────────────────────────────────────────
WIDTH, HEIGHT = landscape(A4)

# Colors - Professional dark palette
BG_PRIMARY = HexColor("#0F1117")
BG_CARD = HexColor("#1A1D27")
ACCENT = HexColor("#4F8CFF")
ACCENT_GREEN = HexColor("#34D399")
ACCENT_AMBER = HexColor("#FBBF24")
TEXT_PRIMARY = HexColor("#F8FAFC")
TEXT_SECONDARY = HexColor("#94A3B8")
TEXT_MUTED = HexColor("#64748B")
BORDER = HexColor("#2A2D3A")
RED_METRIC = HexColor("#EF4444")
PURPLE = HexColor("#A78BFA")

MARGIN = 60
CONTENT_WIDTH = WIDTH - 2 * MARGIN
TOTAL_PAGES = 14

# ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

def draw_bg(c):
    c.setFillColor(BG_PRIMARY)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

def draw_top_bar(c):
    c.setFillColor(ACCENT)
    c.rect(0, HEIGHT - 3, WIDTH, 3, fill=1, stroke=0)

def draw_footer(c, page_num):
    c.setFont("Helvetica", 7)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, 25, "CONFIDENTIAL  |  APEX OS  |  February 2026")
    c.drawRightString(WIDTH - MARGIN, 25, f"{page_num} / {TOTAL_PAGES}")

def draw_section_label(c, text, y):
    c.setFont("Helvetica", 8)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, y, text.upper())
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(MARGIN, y - 6, MARGIN + 80, y - 6)

def draw_card(c, x, y, w, h, fill=None):
    if fill is None:
        fill = BG_CARD
    c.setFillColor(fill)
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)

def draw_metric_box(c, x, y, w, h, value, label, value_color=ACCENT):
    draw_card(c, x, y, w, h)
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(value_color)
    c.drawCentredString(x + w/2, y + h - 40, value)
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_SECONDARY)
    c.drawCentredString(x + w/2, y + 12, label)

def wrap_text(c, text, x, y, max_width, font="Helvetica", size=11, color=TEXT_SECONDARY, leading=16):
    style = ParagraphStyle(
        'custom',
        fontName=font,
        fontSize=size,
        textColor=color,
        leading=leading,
        alignment=TA_LEFT,
    )
    p = Paragraph(text, style)
    w_used, h_used = p.wrap(max_width, 500)
    p.drawOn(c, x, y - h_used)
    return h_used

# ─── SLIDE 1: TITLE ──────────────────────────────────────────────────────────

def slide_title(c):
    draw_bg(c)
    draw_top_bar(c)

    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, HEIGHT - 50, "APEX OS")