APEX OS Investor Pitch Deck Generator
Clean, minimal, professional design inspired by OpenAI / top-tier startup decks.
$200K Pre-Beta Angel Round.
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
BG_PRIMARY = HexColor("#0F1117")       # Near-black background
BG_CARD = HexColor("#1A1D27")          # Card background
ACCENT = HexColor("#4F8CFF")           # Blue accent (professional, trustworthy)
ACCENT_GREEN = HexColor("#34D399")     # Green for positive metrics
ACCENT_AMBER = HexColor("#FBBF24")     # Amber for highlights
TEXT_PRIMARY = HexColor("#F8FAFC")      # White text
TEXT_SECONDARY = HexColor("#94A3B8")    # Muted text
TEXT_MUTED = HexColor("#64748B")        # Very muted
BORDER = HexColor("#2A2D3A")           # Subtle border
RED_METRIC = HexColor("#EF4444")       # Red for problem stats

MARGIN = 60
CONTENT_WIDTH = WIDTH - 2 * MARGIN

# ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

def draw_bg(c):
    """Draw the dark background."""
    c.setFillColor(BG_PRIMARY)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

def draw_top_bar(c):
    """Draw a subtle top accent bar."""
    c.setFillColor(ACCENT)
    c.rect(0, HEIGHT - 3, WIDTH, 3, fill=1, stroke=0)

def draw_footer(c, page_num, total_pages):
    """Draw footer with page number and confidential notice."""
    c.setFont("Helvetica", 7)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, 25, "CONFIDENTIAL  |  APEX OS  |  February 2026")