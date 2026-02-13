"""
APEX OS Investor Pitch Deck Generator v3
Clean, minimal, professional design inspired by OpenAI / top-tier startup decks.
$200K Pre-Beta Angel Round.
UNIFIED IDENTITY: The Venture Lab.
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
        'custom', fontName=font, fontSize=size, textColor=color,
        leading=leading, alignment=TA_LEFT,
    )
    p = Paragraph(text, style)
    w_used, h_used = p.wrap(max_width, 500)
    p.drawOn(c, x, y - h_used)
    return h_used

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 1: TITLE
# ═══════════════════════════════════════════════════════════════════════════════

def slide_title(c):
    draw_bg(c)
    draw_top_bar(c)

    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, HEIGHT - 50, "APEX OS")

    c.setFont("Helvetica-Bold", 56)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT / 2 + 60, "The Venture Lab")

    c.setFont("Helvetica", 18)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN, HEIGHT / 2 + 10, "We manufacture proprietary deal flow.")
    c.drawString(MARGIN, HEIGHT / 2 - 18, "We don't compete for deals. We create them.")

    c.setFont("Helvetica", 14)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, HEIGHT / 2 - 70, "Pre-Beta Investment Round  |  $200,000  |  February 2026")

    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawString(MARGIN, 50, "Confidential  |  Prepared for Angel Investors & Early-Stage VCs")
    draw_footer(c, 1)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 2: WHAT BUSINESS ARE WE IN
# ═══════════════════════════════════════════════════════════════════════════════

def slide_identity(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "The Business", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "What Business Are We In?")

    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, HEIGHT - 150, "We are in the business of manufacturing proprietary deal flow.")

    wrap_text(c,
        "Traditional venture capital is a game of access and guesswork. VCs spend millions sourcing "
        "deals, and still pick wrong 90% of the time. APEX OS transforms this into a science. "
        "We have constructed a system that systematically identifies, cultivates, and invests in "
        "elite AI-native companies <b>before they ever appear on the open market</b>.",
        MARGIN, HEIGHT - 180, CONTENT_WIDTH, size=13, leading=20)

    # Two core components
    comp_w = (CONTENT_WIDTH - 20) / 2
    comp_h = 180
    comp_y = HEIGHT - 440

    # The Foundry
    draw_card(c, MARGIN, comp_y, comp_w, comp_h)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN + 20, comp_y + comp_h - 25, "COMPONENT 1  |  SAAS REVENUE ENGINE")
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, comp_y + comp_h - 55, "The Foundry")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_SECONDARY)
    wrap_text(c,
        "A high-margin subscription platform that attracts thousands of aspiring AI builders. "
        "It is not an education business. It is a <b>sophisticated filtering mechanism</b> that "
        "surfaces the top 1% of talent and ideas while generating recurring SaaS revenue at 85% gross margins.",
        MARGIN + 20, comp_y + comp_h - 72, comp_w - 40, size=11, leading=15)

    # The Fund
    draw_card(c, MARGIN + comp_w + 20, comp_y, comp_w, comp_h)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT_GREEN)
    c.drawString(MARGIN + comp_w + 40, comp_y + comp_h - 25, "COMPONENT 2  |  VENTURE CAPITAL ENGINE")
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + comp_w + 40, comp_y + comp_h - 55, "The Fund")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_SECONDARY)
    wrap_text(c,
        "A 30-day intensive accelerator that invests in the elite companies born from our Foundry. "
        "15% equity stake. <b>Zero deal sourcing cost.</b> We have already observed and measured "
        "every founder's capabilities before we invest a single dollar.",
        MARGIN + comp_w + 40, comp_y + comp_h - 72, comp_w - 40, size=11, leading=15)

    # Bottom insight
    draw_card(c, MARGIN, comp_y - 70, CONTENT_WIDTH, 50)
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(ACCENT_AMBER)
    c.drawString(MARGIN + 20, comp_y - 48, "In one sentence:")
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 160, comp_y - 48, "We are a venture capital firm that has solved its own deal flow problem.")

    draw_footer(c, 2)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 3: THE PROBLEM
# ═══════════════════════════════════════════════════════════════════════════════

def slide_problem(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "The Problem", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "Venture Capital is Broken")

    wrap_text(c,
        "The VC model has a fundamental structural flaw: deal sourcing is expensive, subjective, "
        "and inefficient. Firms spend millions on sourcing, rely on warm introductions, and still "
        "pick wrong the vast majority of the time. Meanwhile, the best founders are invisible "
        "because they cannot afford to be seen.",
        MARGIN, HEIGHT - 140, CONTENT_WIDTH, size=14, leading=22)

    box_w = (CONTENT_WIDTH - 40) / 3
    box_y = HEIGHT - 360
    box_h = 100

    draw_metric_box(c, MARGIN, box_y, box_w, box_h, "92%", "Startup Failure Rate", RED_METRIC)
    draw_metric_box(c, MARGIN + box_w + 20, box_y, box_w, box_h, "$50K+", "Avg. VC Deal Sourcing Cost", RED_METRIC)
    draw_metric_box(c, MARGIN + 2*(box_w + 20), box_y, box_w, box_h, "90%", "VC Investments That Fail", RED_METRIC)

    draw_card(c, MARGIN, box_y - 90, CONTENT_WIDTH, 60)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(ACCENT_AMBER)
    c.drawString(MARGIN + 20, box_y - 52, "The Opportunity:")
    c.setFont("Helvetica", 12)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN + 150, box_y - 52, "What if you could observe a founder's actual capabilities before investing? What if deal flow")
    c.drawString(MARGIN + 150, box_y - 70, "was not sourced, but manufactured? That is what APEX OS does.")

    draw_footer(c, 3)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 4: THE UNFAIR ADVANTAGE
# ═══════════════════════════════════════════════════════════════════════════════

def slide_unfair_advantage(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Our Unfair Advantage", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "32,000 Paying Customers.")
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, HEIGHT - 155, "The Raw Material for Our Lab.")

    wrap_text(c,
        "Through an exclusive partnership with InfoAcademy, we have access to 32,000 paying customers "
        "who have already invested in their technical education. This is the raw material for our "
        "Venture Lab: a captive pipeline of aspiring builders that we can systematically filter, "
        "cultivate, and invest in.",
        MARGIN, HEIGHT - 185, CONTENT_WIDTH * 0.62, size=13, leading=20)

    # Right side metrics
    rx = MARGIN + CONTENT_WIDTH * 0.66
    rw = CONTENT_WIDTH * 0.34
    draw_metric_box(c, rx, HEIGHT - 240, rw, 80, "$0", "Deal Sourcing Cost", ACCENT_GREEN)
    draw_metric_box(c, rx, HEIGHT - 335, rw, 80, "32,000", "Pre-Qualified Pipeline", ACCENT)
    draw_metric_box(c, rx, HEIGHT - 430, rw, 80, "Day 1", "Revenue Generation", ACCENT_GREEN)

    # Left: How the pipeline works
    draw_card(c, MARGIN, HEIGHT - 430, CONTENT_WIDTH * 0.60, 130)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 15, HEIGHT - 320, "The Venture Lab Pipeline")

    data = [
        ("32,000 enter the Foundry", "Attracted by low-cost, high-value AI education"),
        ("~1,600 show high potential", "Identified through proprietary scoring algorithms"),
        ("~80 enter the Fund", "Top 5% invited to 30-day intensive accelerator"),
        ("~8 receive investment", "Elite companies with proven builders and validated ideas"),
    ]
    y_pos = HEIGHT - 348
    for i, (stage, detail) in enumerate(data):
        color = [ACCENT, ACCENT_GREEN, ACCENT_AMBER, PURPLE][i]
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(color)
        c.drawString(MARGIN + 15, y_pos, stage)
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT_MUTED)
        c.drawString(MARGIN + 280, y_pos, detail)
        y_pos -= 22

    draw_footer(c, 4)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 5: HOW THE FOUNDRY WORKS
# ═══════════════════════════════════════════════════════════════════════════════

def slide_foundry(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "The Foundry", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "A SaaS Business That Prints")
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(ACCENT_GREEN)
    c.drawString(MARGIN, HEIGHT - 155, "Revenue and Deal Flow.")

    wrap_text(c,
        "The Foundry is our subscription platform where builders learn AI-native development. "
        "But its true purpose is twofold: it generates high-margin recurring revenue <b>and</b> "
        "it systematically identifies the top 1% of talent for our Fund.",
        MARGIN, HEIGHT - 185, CONTENT_WIDTH, size=13, leading=20)

    # Pricing tiers
    tier_w = (CONTENT_WIDTH - 40) / 3
    tier_h = 150
    tier_y = HEIGHT - 400

    tiers = [
        ("CODESPRINT", "$89/mo", "Emerging Market Entry",
         "6-module AI-native curriculum, community access, project templates. "
         "Designed for high-volume intake from emerging markets.", ACCENT),
        ("BUILDER LAB", "$149/mo", "Momentum Tier",
         "Everything in CodeSprint plus live workshops, AI agent access, "
         "and builder leaderboard. Our core revenue driver.", ACCENT_GREEN),
        ("FOUNDER TRACK", "$249/mo", "High-Intent Builders",
         "Everything in Builder Lab plus 1:1 mentorship, pitch preparation, "
         "and priority access to the Fund. Our talent filter.", ACCENT_AMBER),
    ]

    for i, (name, price, audience, desc, color) in enumerate(tiers):
        x = MARGIN + i * (tier_w + 20)
        draw_card(c, x, tier_y, tier_w, tier_h)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(color)
        c.drawString(x + 15, tier_y + tier_h - 22, name)
        c.setFont("Helvetica-Bold", 22)
        c.setFillColor(TEXT_PRIMARY)
        c.drawString(x + 15, tier_y + tier_h - 48, price)
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT_MUTED)
        c.drawString(x + 15, tier_y + tier_h - 62, audience)
        wrap_text(c, desc, x + 15, tier_y + tier_h - 75, tier_w - 30,
                  size=10, color=TEXT_SECONDARY, leading=13)

    # Key metrics
    box_w = (CONTENT_WIDTH - 60) / 4
    box_y = 50
    box_h = 70
    draw_metric_box(c, MARGIN, box_y, box_w, box_h, "85%", "Gross Margin", ACCENT_GREEN)
    draw_metric_box(c, MARGIN + box_w + 20, box_y, box_w, box_h, "$149", "Blended ARPU", ACCENT)
    draw_metric_box(c, MARGIN + 2*(box_w + 20), box_y, box_w, box_h, "$0", "CAC", ACCENT_GREEN)
    draw_metric_box(c, MARGIN + 3*(box_w + 20), box_y, box_w, box_h, "9.8:1", "LTV:CAC", ACCENT)

    draw_footer(c, 5)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 6: DEFENSIBILITY
# ═══════════════════════════════════════════════════════════════════════════════

def slide_defensibility(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Defensibility", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 105, "Low Entry Barrier =")
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(ACCENT_GREEN)
    c.drawString(MARGIN, HEIGHT - 145, "Our Greatest Strategic Weapon")

    wrap_text(c,
        "Our low price point is deliberate. It maximises intake volume into our Foundry, "
        "which maximises the quality of deal flow into our Fund. The moats that protect us are structural.",
        MARGIN, HEIGHT - 170, CONTENT_WIDTH, size=13, leading=20)

    moat_w = (CONTENT_WIDTH - 20) / 2
    moat_h = 110
    moat_y_top = HEIGHT - 340
    moat_y_bot = moat_y_top - moat_h - 12

    moats = [
        ("1. The Distribution Moat",
         "32,000 paying customers cannot be copied. A competitor must spend $500K-$2M and 18+ months "
         "to build an equivalent pipeline. By then, we will have converted ours and moved to Phase 2.",
         ACCENT),
        ("2. The Data Moat",
         "Every builder interaction generates proprietary data on talent quality, project viability, "
         "and orchestration patterns. With 1,000+ users, we will have pattern libraries no competitor "
         "can replicate. Data compounds. The gap widens every month.",
         ACCENT_GREEN),
        ("3. The Community Moat",
         "Communities are the hardest moat to replicate. Our builders form peer networks, "
         "accountability groups, and co-founder matches. Switching costs become emotional, "
         "not just financial. You can copy features; you cannot copy belonging.",
         ACCENT_AMBER),
        ("4. The Ecosystem Lock-in",
         "Foundry graduates feed the Fund. Fund companies generate B2B licensing revenue. "
         "B2B revenue funds Foundry growth. A competitor must replicate all three simultaneously "
         "to compete. Nobody does that.",
         PURPLE),
    ]

    for i, (title, desc, color) in enumerate(moats):
        row = i // 2
        col = i % 2
        x = MARGIN + col * (moat_w + 20)
        y = moat_y_top if row == 0 else moat_y_bot

        draw_card(c, x, y, moat_w, moat_h)
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(color)
        c.drawString(x + 15, y + moat_h - 22, title)
        wrap_text(c, desc, x + 15, y + moat_h - 38, moat_w - 30,
                  size=9.5, color=TEXT_SECONDARY, leading=13)

    draw_card(c, MARGIN, 45, CONTENT_WIDTH, 50)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN + 20, 72, "The Bottom Line:")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 145, 72, "Anyone can build a course. Nobody can replicate 32K customers + proprietary data + a living")
    c.drawString(MARGIN + 145, 56, "community + a venture pipeline + an 18-month head start. That is our moat.")

    draw_footer(c, 6)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 7: COMPETITIVE LANDSCAPE
# ═══════════════════════════════════════════════════════════════════════════════

def slide_competitive(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Competitive Landscape", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 105, "We Don't Compete on Features.")
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, HEIGHT - 145, "We Compete on Ecosystem.")

    draw_card(c, MARGIN, HEIGHT - 430, CONTENT_WIDTH, 250)

    headers = ["", "Bootcamps", "MOOCs", "Accelerators", "APEX OS"]
    col_positions = [MARGIN + 15, MARGIN + 130, MARGIN + 260, MARGIN + 400, MARGIN + 550]

    c.setFont("Helvetica-Bold", 10)
    header_y = HEIGHT - 200
    for i, h in enumerate(headers):
        color = ACCENT if i == 4 else TEXT_MUTED
        c.setFillColor(color)
        c.drawString(col_positions[i], header_y, h)

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(MARGIN + 15, header_y - 8, MARGIN + CONTENT_WIDTH - 15, header_y - 8)

    rows = [
        ("Price", "$15,000+", "$0-$50/mo", "Free (takes equity)", "$89-$249/mo"),
        ("Deal Sourcing", "None", "None", "$50K+ per deal", "$0 (built-in)"),
        ("Completion Rate", "15%", "6%", "N/A", "78% (projected)"),
        ("Time to Revenue", "6-12 months", "Never", "3-6 months", "30 days"),
        ("Data Moat", "None", "None", "None", "Proprietary patterns"),
        ("Community", "Cohort-only", "None", "Small batch", "32,000+ network"),
        ("Revenue Model", "One-time", "Ads/Certs", "Equity only", "SaaS + Equity + B2B"),
    ]

    for i, (metric, *values) in enumerate(rows):
        ry = header_y - 28 - i * 24
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_PRIMARY)
        c.drawString(col_positions[0], ry, metric)
        for j, val in enumerate(values):
            c.setFont("Helvetica", 9)
            color = ACCENT_GREEN if j == 3 else TEXT_SECONDARY
            c.setFillColor(color)
            c.drawString(col_positions[j + 1], ry, val)

    draw_card(c, MARGIN, 45, CONTENT_WIDTH, 50)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT_AMBER)
    c.drawString(MARGIN + 20, 72, "Key Insight:")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN + 115, 72, "Competitors optimise one dimension. APEX OS is the only player that combines a SaaS revenue")
    c.drawString(MARGIN + 115, 56, "engine with a venture capital pipeline and enterprise licensing into a single Venture Lab.")

    draw_footer(c, 7)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 8: MARKET
# ═══════════════════════════════════════════════════════════════════════════════

def slide_market(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Market Opportunity", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "A $420B Convergence")

    wrap_text(c,
        "Three massive markets are converging: online education, no-code tools, and AI development. "
        "APEX OS sits at the intersection, capturing value from all three.",
        MARGIN, HEIGHT - 140, CONTENT_WIDTH, size=14, leading=22)

    col_w = (CONTENT_WIDTH - 40) / 3
    col_h = 160
    col_y = HEIGHT - 370

    markets = [
        ("TOTAL ADDRESSABLE MARKET", "$420B",
         "Online Education ($350B) + No-Code Tools ($45B) + AI Development ($25B)", ACCENT),
        ("SERVICEABLE ADDRESSABLE MARKET", "$50B",
         "5M+ aspiring builders willing to pay for AI-native education and tools globally.", ACCENT),
        ("SERVICEABLE OBTAINABLE MARKET", "$2.8M",
         "Year 1 target: 1,000 builders at $149 ARPU. Conservative 0.2% of SAM.", ACCENT_GREEN),
    ]

    for i, (label, value, desc, color) in enumerate(markets):
        x = MARGIN + i * (col_w + 20)
        draw_card(c, x, col_y, col_w, col_h)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_MUTED)
        c.drawString(x + 15, col_y + col_h - 25, label)
        c.setFont("Helvetica-Bold", 36)
        c.setFillColor(color)
        c.drawString(x + 15, col_y + col_h - 65, value)
        wrap_text(c, desc, x + 15, col_y + col_h - 80, col_w - 30, size=10, leading=14)

    draw_card(c, MARGIN, col_y - 120, CONTENT_WIDTH, 95)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, col_y - 45, "Why Now: The Convergence of Three Forces")

    forces = [
        ("AI Capability:", "Claude, GPT-4, Gemini can now handle complex development tasks end-to-end."),
        ("Builder Desire:", "Post-pandemic shift toward entrepreneurship and independent work."),
        ("VC Inefficiency:", "Traditional deal sourcing is broken; the market is ready for a new model."),
    ]
    for i, (title, desc) in enumerate(forces):
        fy = col_y - 70 - i * 22
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(ACCENT)
        c.drawString(MARGIN + 20, fy, f"{i+1}. {title}")
        c.setFont("Helvetica", 10)
        c.setFillColor(TEXT_SECONDARY)
        c.drawString(MARGIN + 180, fy, desc)

    draw_footer(c, 8)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 9: GTM
# ═══════════════════════════════════════════════════════════════════════════════

def slide_gtm(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Go-to-Market", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "A Surgical Strike,")
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN, HEIGHT - 155, "Not a Hopeful Prayer.")

    phase_w = (CONTENT_WIDTH - 40) / 3
    phase_h = 220
    phase_y = HEIGHT - 420

    phases = [
        ("PHASE 1", "Months 1-3", "Activate the 32,000",
         "Direct conversion of our captive InfoAcademy audience through targeted email sequences, "
         "exclusive webinars, and early-access offers. Target: 100 paying builders in the Foundry.",
         ACCENT),
        ("PHASE 2", "Months 4-9", "Ignite the Flywheel",
         "Viral 'Show Me The Pitch' campaign incentivizes builders to share projects. "
         "Community-led growth through builder leaderboards and peer referrals. Target: 300 builders.",
         ACCENT_GREEN),
        ("PHASE 3", "Months 10-12", "Launch the Fund",
         "First Accelerator cohort from top Foundry graduates. Enterprise pilot conversations. "
         "Validate the full Venture Lab model end-to-end. Target: Series A ready.",
         ACCENT_AMBER),
    ]

    for i, (phase, timeline, title, desc, color) in enumerate(phases):
        x = MARGIN + i * (phase_w + 20)
        draw_card(c, x, phase_y, phase_w, phase_h)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(color)
        c.drawString(x + 15, phase_y + phase_h - 25, f"{phase}  |  {timeline}")
        c.setFont("Helvetica-Bold", 16)
        c.setFillColor(TEXT_PRIMARY)
        wrap_text(c, title, x + 15, phase_y + phase_h - 40, phase_w - 30,
                  font="Helvetica-Bold", size=16, color=TEXT_PRIMARY, leading=20)
        wrap_text(c, desc, x + 15, phase_y + phase_h - 80, phase_w - 30,
                  size=11, color=TEXT_SECONDARY, leading=15)

    draw_footer(c, 9)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 10: UNIT ECONOMICS
# ═══════════════════════════════════════════════════════════════════════════════

def slide_unit_economics(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Unit Economics", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "The Numbers That Matter")

    box_w = (CONTENT_WIDTH - 60) / 4
    box_h = 90
    box_y = HEIGHT - 230

    draw_metric_box(c, MARGIN, box_y, box_w, box_h, "$149", "Blended ARPU / Month", ACCENT)
    draw_metric_box(c, MARGIN + box_w + 20, box_y, box_w, box_h, "$0", "Deal Sourcing Cost", ACCENT_GREEN)
    draw_metric_box(c, MARGIN + 2*(box_w + 20), box_y, box_w, box_h, "85%", "Gross Margin", ACCENT_GREEN)
    draw_metric_box(c, MARGIN + 3*(box_w + 20), box_y, box_w, box_h, "9.8:1", "LTV:CAC Ratio", ACCENT)

    draw_card(c, MARGIN, HEIGHT - 420, CONTENT_WIDTH, 155)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 15, HEIGHT - 285, "Three Strategic Scenarios (18-Month Horizon)")

    headers = ["Scenario", "M18 Builders", "Conversion", "M18 ARR", "Net Cash Flow"]
    col_x = [MARGIN + 15, MARGIN + 180, MARGIN + 340, MARGIN + 460, MARGIN + 590]

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TEXT_MUTED)
    for i, h in enumerate(headers):
        c.drawString(col_x[i], HEIGHT - 310, h)

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(MARGIN + 15, HEIGHT - 318, MARGIN + CONTENT_WIDTH - 15, HEIGHT - 318)

    rows = [
        ("Bear Case", "201", "0.6%", "$434K", "-$12K/mo", TEXT_SECONDARY),
        ("Base Case", "551", "1.7%", "$1.48M", "+$48K/mo", ACCENT),
        ("Bull Case", "1,542", "4.8%", "$5.0M", "+$180K/mo", ACCENT_GREEN),
    ]

    for i, (scenario, customers, conv, arr, cash, color) in enumerate(rows):
        y = HEIGHT - 340 - i * 25
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(color)
        c.drawString(col_x[0], y, scenario)
        c.setFont("Helvetica", 11)
        c.setFillColor(TEXT_SECONDARY)
        c.drawString(col_x[1], y, customers)
        c.drawString(col_x[2], y, conv)
        c.setFillColor(color)
        c.drawString(col_x[3], y, arr)
        c.drawString(col_x[4], y, cash)

    draw_card(c, MARGIN, 50, CONTENT_WIDTH, 65)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT_AMBER)
    c.drawString(MARGIN + 20, 92, "Note:")
    c.setFont("Helvetica", 11)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN + 65, 92, "These figures represent Foundry (SaaS) revenue only. Fund returns from equity stakes in")
    c.drawString(MARGIN + 65, 75, "portfolio companies represent additional upside not modelled here.")

    draw_footer(c, 10)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 11: TEAM
# ═══════════════════════════════════════════════════════════════════════════════

def slide_team(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "The Team", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "Vision Meets Execution")

    card_w = (CONTENT_WIDTH - 20) / 2
    card_h = 200
    card_y = HEIGHT - 360

    draw_card(c, MARGIN, card_y, card_w, card_h)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT)
    c.drawString(MARGIN + 20, card_y + card_h - 25, "FOUNDER & CEO")
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, card_y + card_h - 55, "Nicolae Fratila")
    wrap_text(c,
        "Technical architect with proven AI-native development velocity. "
        "Built the complete APEX OS infrastructure in 10 days, demonstrating "
        "systems thinking at scale and product-market fit intuition. "
        "Founder of InfoAcademy with 32,000+ paying customers.",
        MARGIN + 20, card_y + card_h - 75, card_w - 40, size=11, leading=16)

    draw_card(c, MARGIN + card_w + 20, card_y, card_w, card_h)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(ACCENT_GREEN)
    c.drawString(MARGIN + card_w + 40, card_y + card_h - 25, "STRATEGIC ADVISOR")
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + card_w + 40, card_y + card_h - 55, "Kevin Obeegadoo")
    wrap_text(c,
        "30+ years consulting experience. Unreasonable Impact UK & Europe 2025 Mentor. "
        "Advised 14+ Unreasonable companies. Expertise in business strategy, "
        "risk mitigation, securitisation, and global scaling from Mauritius IFC.",
        MARGIN + card_w + 40, card_y + card_h - 75, card_w - 40, size=11, leading=16)

    draw_card(c, MARGIN, card_y - 120, CONTENT_WIDTH, 90)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, card_y - 50, "Equity Architecture")

    equity = [
        ("Founders", "~67%", "Vision, technical execution, majority control"),
        ("Seed Investors", "15%", "$1.2M capital injection, strategic guidance"),
        ("InfoAcademy", "10%", "Distribution infrastructure, 32K customer asset"),
        ("Strategic Advisory", "3-5%", "Global expansion & fundraising"),
        ("Builder Pool", "5%", "Co-founder equity for sprint graduates"),
    ]
    for i, (entity, pct, role) in enumerate(equity):
        ey = card_y - 75 - i * 16
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(ACCENT)
        c.drawString(MARGIN + 20, ey, entity)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(TEXT_PRIMARY)
        c.drawString(MARGIN + 140, ey, pct)
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT_MUTED)
        c.drawString(MARGIN + 190, ey, role)

    draw_footer(c, 11)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 12: THE ASK
# ═══════════════════════════════════════════════════════════════════════════════

def slide_ask(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "The Ask", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 48)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 120, "$200,000")
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(MARGIN, HEIGHT - 152, "Pre-Beta Investment Round")

    draw_card(c, MARGIN, HEIGHT - 340, CONTENT_WIDTH * 0.48, 160)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, HEIGHT - 200, "Use of Funds")

    funds = [
        ("Foundry Platform", "50%", "$100,000", ACCENT),
        ("Community & Marketing", "30%", "$60,000", ACCENT_GREEN),
        ("Operations & Legal", "20%", "$40,000", ACCENT_AMBER),
    ]
    for i, (category, pct, amount, color) in enumerate(funds):
        fy = HEIGHT - 230 - i * 30
        c.setFillColor(HexColor("#1E2130"))
        c.roundRect(MARGIN + 20, fy - 5, 300, 12, 3, fill=1, stroke=0)
        bar_width = 300 * float(pct.strip('%')) / 100
        c.setFillColor(color)
        c.roundRect(MARGIN + 20, fy - 5, bar_width, 12, 3, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(TEXT_PRIMARY)
        c.drawString(MARGIN + 20, fy + 12, category)
        c.setFont("Helvetica", 10)
        c.setFillColor(TEXT_SECONDARY)
        c.drawString(MARGIN + 230, fy + 12, f"{pct}  |  {amount}")

    draw_card(c, MARGIN + CONTENT_WIDTH * 0.52, HEIGHT - 340, CONTENT_WIDTH * 0.48, 160)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + CONTENT_WIDTH * 0.52 + 20, HEIGHT - 200, "12-Month Milestones")

    milestones = [
        ("Month 3", "100 builders in Foundry, $10K MRR"),
        ("Month 6", "First Fund cohort launched"),
        ("Month 9", "300 builders, $30K MRR"),
        ("Month 12", "Series A ready, first portfolio exit path"),
    ]
    mx = MARGIN + CONTENT_WIDTH * 0.52 + 20
    for i, (month, milestone) in enumerate(milestones):
        my = HEIGHT - 230 - i * 28
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(ACCENT)
        c.drawString(mx, my, month)
        c.setFont("Helvetica", 11)
        c.setFillColor(TEXT_SECONDARY)
        c.drawString(mx + 80, my, milestone)

    draw_card(c, MARGIN, 50, CONTENT_WIDTH, 75)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN + 20, 100, "What This Investment Enables")
    wrap_text(c,
        "This $200K activates our 32,000-strong pipeline, validates the Foundry-to-Fund model, "
        "and positions APEX OS for a $1.2M+ seed round within 12 months.",
        MARGIN + 20, 85, CONTENT_WIDTH - 40, size=12, leading=16)

    draw_footer(c, 12)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 13: RISK MITIGATION
# ═══════════════════════════════════════════════════════════════════════════════

def slide_risk(c):
    draw_bg(c)
    draw_top_bar(c)
    draw_section_label(c, "Risk Mitigation", HEIGHT - 55)

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(MARGIN, HEIGHT - 110, "Why It Won't Break")

    risks = [
        ("Market Risk", "What if the AI market doesn't grow?",
         "The market is already $420B and growing at 15%+ CAGR. AI adoption is accelerating, "
         "not decelerating. Our 32,000 existing customers prove demand exists today.",
         ACCENT),
        ("Competition Risk", "What if 30 competitors copy our model?",
         "They can copy the model, but not the 32,000-customer pipeline, the proprietary data "
         "from thousands of builder interactions, or the 18-month head start. Our moat is multi-layered.",
         ACCENT_GREEN),
        ("Technology Risk", "What if the AI tools we teach become obsolete?",
         "We teach orchestration principles, not specific tool syntax. Our curriculum evolves with "
         "the technology. We are tool-agnostic by design.",
         ACCENT_AMBER),
        ("Execution Risk", "What if we can't convert the pipeline?",
         "Even our bear case (0.6% conversion) generates $434K ARR. We need less than 1% conversion "
         "to be viable. The risk is asymmetrically in our favor.",
         PURPLE),
    ]

    risk_w = (CONTENT_WIDTH - 20) / 2
    risk_h = 130
    risk_y_top = HEIGHT - 290
    risk_y_bot = risk_y_top - risk_h - 15

    for i, (title, question, answer, color) in enumerate(risks):
        row = i // 2
        col = i % 2
        x = MARGIN + col * (risk_w + 20)
        y = risk_y_top if row == 0 else risk_y_bot

        draw_card(c, x, y, risk_w, risk_h)
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(color)
        c.drawString(x + 15, y + risk_h - 25, title)
        c.setFont("Helvetica-Oblique", 10)
        c.setFillColor(TEXT_MUTED)
        c.drawString(x + 15, y + risk_h - 42, question)
        wrap_text(c, answer, x + 15, y + risk_h - 55, risk_w - 30,
                  size=10, color=TEXT_SECONDARY, leading=14)

    draw_footer(c, 13)

# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE 14: CLOSING
# ═══════════════════════════════════════════════════════════════════════════════

def slide_closing(c):
    draw_bg(c)
    draw_top_bar(c)

    c.setFont("Helvetica-Bold", 44)
    c.setFillColor(TEXT_PRIMARY)
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 + 100, "The Lab is Built.")
    c.setFillColor(ACCENT)
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 + 45, "The Pipeline is Waiting.")
    c.setFillColor(TEXT_PRIMARY)
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 - 10, "The Time is Now.")

    c.setFont("Helvetica", 14)
    c.setFillColor(TEXT_SECONDARY)
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 - 80, "Nicolae Fratila  |  Founder & CEO")
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 - 105, "Kevin Obeegadoo  |  Strategic Advisor")

    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(ACCENT)
    c.drawCentredString(WIDTH / 2, HEIGHT / 2 - 150, "infoacademy.uk")

    c.setFont("Helvetica", 10)
    c.setFillColor(TEXT_MUTED)
    c.drawCentredString(WIDTH / 2, 50, "CONFIDENTIAL  |  APEX OS  |  February 2026")

    draw_footer(c, 14)

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def generate_deck():
    output_path = "/home/ubuntu/apex_analysis/APEX_OS_Pitch_Deck_VentureLab.pdf"
    c = canvas.Canvas(output_path, pagesize=landscape(A4))
    c.setTitle("APEX OS - The Venture Lab ($200K Pre-Beta Round)")
    c.setAuthor("APEX OS")
    c.setSubject("Pre-Beta Investment Round - February 2026")

    slides = [
        slide_title,            # 1 - The Venture Lab
        slide_identity,         # 2 - What Business Are We In
        slide_problem,          # 3 - VC is Broken
        slide_unfair_advantage, # 4 - 32K Pipeline
        slide_foundry,          # 5 - The Foundry (SaaS)
        slide_defensibility,    # 6 - Low Barrier = Weapon
        slide_competitive,      # 7 - Competitive Landscape
        slide_market,           # 8 - Market
        slide_gtm,              # 9 - GTM
        slide_unit_economics,   # 10 - Numbers
        slide_team,             # 11 - Team
        slide_ask,              # 12 - The Ask
        slide_risk,             # 13 - Risk
        slide_closing,          # 14 - Closing
    ]

    for i, slide_fn in enumerate(slides):
        slide_fn(c)
        if i < len(slides) - 1:
            c.showPage()

    c.save()
    print(f"Pitch deck generated: {output_path}")
    print(f"Total slides: {len(slides)}")

if __name__ == "__main__":
    generate_deck()
