---
name: 'XeVoice — Phase 7: Operations'
tagline: >-
  XeVoice ka complete delivery, onboarding, client health, SOP aur retention
  system — client close hone ke baad yahan se shuru karo
category: Xevoice Ai Agency 2026
tags:
  - operations
date: '2026-09-22'
level: INTERMEDIATE
difficulty: INTERMEDIATE
---

# XeVoice — Phase 7: Operations
**Agency: XeVoice | Founder: Malik Muhammad Atif Iqbal**
**Sources: "Agency Building in 2026" (Saad Munir, Furqan Aziz) + "AI Voice Agency Resources" (Carmel Hernandez, Jeremy Camilloni, Kip Hernandez, Ayal & Yoav)**

---

## RULE #0 — "Recurring is Growth" aur Delivery is the Hardest Part

**Framework: Saad Munir + Carmel Hernandez**

> *"Sales is the easiest part. Service delivery is the difficult part."* — Saad Munir

**The Leaky Bucket Problem:**
New sales ($20,000/mo) + Client Churn ($15,000/mo) = Zero net growth.

Agar delivery aur communication poor hai → chahe kitni bhi sales lo → agency grow nahi karegi.

**Carmel Hernandez ka fatal flaw:**
- One-time setup fee + agent hand-off → client emails for months → thinks product failed → churns
- Next month: **$0 revenue**
- *"You would not take a corporate 9-to-5 if your salary was $10K one month and $1K the next."*

**XeVoice Standard Delivery Model:**
- Lower/zero setup fee
- **$1,000–$2,000/month recurring retainer**
- **3–6 month commitment**
- White-glove: agency monitors every call, fixes every edge case, optimizes every week

---

## STEP 1: Client Onboarding — 3-Meeting Cadence

**Framework: Saad Munir (Agency Building in 2026)**

XeVoice client deal close hone ke 24 hours ke andar yeh 3-meeting cadence execute karo:

### Meeting 1: Contract Signoff + Payment (Sales/Malik)
- Contract finalize, payment secure, project scope lock karo
- Stripe invoice send karo, NDA sign karo

### Meeting 2: Welcome + Onboarding Call (Malik ya Account Executive)
- **White-Glove Experience:** Client ko luxury analogy dene wala experience do — "glide and guide"
- Walk through **XeVoice Welcome Funnel** (GHL landing page ya onboarding doc)
- Collect all assets:
  - Business phone system credentials (RingCentral/Vonage/Dialpad login)
  - Brand voice document (tone, terminology, FAQs)
  - Calendar access (Calendly/Cal.com/Google Calendar)
  - CRM credentials (GHL/ServiceTitan/Zoho)
- Establish **SLA** — response time (Slack: 1–24 hour window), revision limits, timeline
- Move client to **dedicated paid Slack workspace**
- Share: Loom welcome video + Onboarding Intake Form

### Meeting 3: Project Kick-Off (Technical Execution)
- Re-iterate exact deliverables, sprint roadmap, timelines
- Assign project in ClickUp
- Confirm all access credentials received

### Internal Handshake Meeting (Before Client Kick-off)
**Framework: Saad Munir**
- Sales/Malik formally transfers all discovery notes, recorded call insights, client nuances to technical team
- Prevents knowledge gaps between sales promises and delivery reality

### 80% Automated Welcome Funnel (Saad Munir)
Payment received → auto-trigger via GHL/Zapier/n8n:
1. Auto-create dedicated Slack channel + invite client
2. Auto-generate ClickUp project + assign tasks to team
3. Send welcome email with: CEO Loom video + SLA doc + onboarding intake form

---

## STEP 2: XeVoice Voice Agent Delivery — Four Facets of Integration

**Framework: Ayal & Yoav — YouFound AI (AI Voice Agency Resources)**

Har voice agent deployment mein 4 facets properly implement karo:

### Facet 1: Phone System Integration

**Why critical:** Bina proper phone routing ke agent calls intercept nahi kar sakta.

**Supported platforms:** RingCentral, Vonage, Dialpad

| Function | What to Configure |
|----------|------------------|
| **Call Forwarding** | After-hours + overflow + missed calls → XeVoice AI agent |
| **Warm Transfers** | Irate callers ya specific requests → human staff |
| **Call Tracking** | Answered, missed, transferred calls → push to CRM |

### Facet 2: Scripts & Brand Reflection

**Rule:** Agent = extension of client's brand — not a generic bot.

**What to do:**
- Client ki exact tone, language, service terminology use karo
- Empathy loops for stressed/irate callers: *"I understand, let me help you or connect you with someone right away"*
- AI ko wahi training manual do jo human receptionist ko dete hain
- Avoid: robotic loops that frustrate callers

### Facet 3: Schedule & Calendar Mapping

**Platforms:** Calendly, Cal.com, Google Calendar

| Setup | Details |
|-------|---------|
| **Service Mapping** | Specific services → specific employee calendars (correct tech for correct job) |
| **Employee Mapping** | HVAC tech, plumber, doctor — each gets own calendar slots |
| **Cancellation → Reschedule** | Agent asks reason → if fixable → attempts to reschedule instead of just cancelling |

### Facet 4: CRM & Data Structure Integration

**Supported CRMs:** GoHighLevel, ServiceTitan, Zoho, Follow Up Boss, Folk CRM

**Data captured per call:** Caller name, phone, email, service requested, call summary

**Integration Priority Ladder (Ayal & Yoav):**
1. Check if CRM has direct integration on **Make.com** (preferred — more powerful, lower cost)
2. If not → check **Zapier** (fallback — easier, more expensive)
3. If not on either → CRM developer portal → find **REST API documentation**
4. Build **custom Webhook** connection via Make.com
5. No API at all → advise client to switch CRM

**Performance Benchmarking:**
- Track AI booked appointments vs. drop-off rates
- Compare AI performance vs. human front-desk conversion

---

## STEP 3: Multi-Tenant Database + Automated Optimization Loop

**Framework: Kip Hernandez (AI Voice Agency Resources)**

### Master Backend Database (Supabase)

**Old Way (Wrong):** Build separate n8n + GHL automations per client → time-consuming, inconsistent.

**XeVoice Way:** Single Supabase master database — all deployed agents connect to it.

**How it works:**
- New client signed → uploaded to Supabase database
- Agent automatically uses shared automation pipeline
- Books appointments directly into client's isolated GHL account
- No need to rebuild automations per client

*Kip: "I don't have to build the n8n automation, the GHL automations — I get a client, they get uploaded to the database, they all use the same automation."*

### Weekly Automated Prompt Optimization Loop (Claude API)

**Step 1 — Data Collection:**
All call transcripts + outcomes automatically route from Retell AI → Supabase

**Outcomes tracked per call:**
- Booked appointment ✓
- Did not book ✗
- Tool failure during call
- Attempted booking but failed
- Call transferred to human
- Caller requested booking link

**Step 2 — Claude API Analysis:**
- Cloud Code (Claude API) runs weekly schedule
- Analyzes all call logs against quality criteria
- Generates weekly diagnostic report: conversion drops + prompt adjustment recommendations

**Step 3 — Global Update:**
- Adjust master system prompt in Supabase ONCE
- **Automatically updates EVERY deployed client agent simultaneously**

*Kip: "The cool thing about how we set it up is we adjust the prompt one time and it automatically updates to every single agent we have deployed."*

---

## STEP 4: Vertical Templatization — Scale Faster

**Framework: Jeremy Camilloni (AI Voice Agency Resources)**

### Same Vertical = Same Master Prompt

For high-volume verticals (e.g., junk removal, HVAC):
- Standardized master system prompt
- Only swap variables per client during onboarding:
  - Business name
  - Operating hours
  - Service areas
  - Pricing tiers

*Jeremy: "Junk removal companies are almost all the same — their calls are almost all the same."*

### New Vertical Onboarding Protocol

When entering new vertical (e.g., party buses, dental):
1. Trial-and-error testing during first client build
2. Client feedback in first 30 days → refines core call logic
3. Build reusable template for future vertical clients
4. *"Their feedback is allowing us to set up call flows for future clients — they don't even realize it."*

---

## STEP 5: Client Dashboard & Reporting

**Framework: Jeremy Camilloni (AI Voice Agency Resources)**

### Voice AI Wrapper Dashboard

Deploy **Voice AI Wrapper** (BI tool):
- RingCentral-style management portal per client
- Client can view:
  - Real-time call logs
  - Call recordings (playback)
  - Full transcripts
  - Automated call summaries
  - Booking outcomes

### Two-Tier Client Behavior Model (Jeremy Camilloni)

| Client Type | Behavior | XeVoice Service Approach |
|-------------|----------|-------------------------|
| **Field Owner-Operators** (junk removal, landscaping, power washing) | Never log into dashboard — on trucks all day | Real-time SMS/email notifications post-call + CRM auto-push |
| **Office-Based SMBs** (multi-crew companies, medical practices) | Log into portal daily — manage from office | Full dashboard access + weekly call reviews + team metrics |

---

## STEP 6: Weekly Check-In Protocol & Testimonial System

**Framework: Carmel Hernandez (AI Voice Agency Resources)**

### Weekly Check-In (First Month)
- Frequency: **Every week** during month 1
- Duration: 30 minutes
- Agenda: Review call logs, listen to recordings, refine prompts

### Week 3 — 20% Testimonial Incentive (Carmel Hernandez)

Jab results positive hain → Week 3 check-in call pe:

> *"Everything is going really well! I can give you 20% off next month's retainer if you do a quick 5-minute video review with me right now on this call."*

**Process:**
- Record immediately on call via **Riverside**
- Cut into short clips
- Add text hook overlay with their exact quote
- Use as: Meta ad creative + landing page social proof + pre-call email sequence

**Why it locks in retention:**
- Client feels rewarded → stays longer
- Agency gets high-converting testimonial → closes more future clients

---

## STEP 7: Control Tower — Client Health Tracking

**Framework: Saad Munir (Agency Building in 2026)**

### XeVoice Control Tower Sheet

Build in AirTable ya Google Sheets — har client ki yeh info track karo:

| Column | What to Track |
|--------|--------------|
| Client Name + Business | Basic info |
| Service Tier | Starter/Growth/Dominate |
| MRR | Monthly recurring amount |
| Retainer Month | Month 1, 2, 3... |
| Emotional Health Status | See below |
| Personal Notes | Birthdays, hobbies, preferences |
| Next Check-in Date | Calendar link |
| Results This Month | Calls answered, bookings made |

### Emotional Health Status Framework (Saad Munir)

| Status | Trigger | XeVoice Action |
|--------|---------|---------------|
| **Happy / Healthy** | Positive feedback, results exceeding expectations | Sales team → upsell sequence, ask for referral, schedule video testimonial |
| **Curious / Uncertain** | Frequent status questions, minor doubts | Proactive 15-min alignment call, share interim data |
| **Unhappy / At-Risk** | Complaints, slow responses from client | Immediate intervention — scope clarification, extra support |
| **Super Angry** | Serious complaints, threatening to cancel | Malik (CEO) personally calls within 24 hours — churn prevention call |

**Key Rule:** Catch dissatisfaction BEFORE client raises it. Proactive always beats reactive.

---

## STEP 8: SOPs — 5-Step Creation Protocol

**Framework: Saad Munir (Agency Building in 2026)**

Every XeVoice operational task must follow this 5-step documentation:

| Step | Action |
|------|--------|
| **1. Identify** | Document recurring operational tasks + delivery bottlenecks |
| **2. Write** | Step-by-step instructions in Google Doc ya Notion |
| **3. Record** | Comprehensive Loom (paid) screen walkthrough — Why, How, edge-cases |
| **4. Map** | Visual flowchart on Miro (paid) for complex multi-step processes |
| **5. Index** | Store in centralized LMS: Google Doc + Loom link + Miro PDF + Drive folder |

**SOP Accountability:**
- Assign Operations Lead/PM to enforce SOP compliance
- SOPs are living documents — update whenever process improves
- New hires should be able to execute role from LMS within 48 hours

**XeVoice SOPs needed (in order):**
1. Voice Agent Build SOP (per vertical)
2. Client Onboarding SOP (3-meeting cadence)
3. Weekly Prompt Optimization SOP
4. Call Log Review SOP
5. Client Health Check SOP
6. Change Order / Scope Creep SOP
7. Testimonial Collection SOP
8. Upsell Trigger SOP

---

## STEP 9: Scope Creep & Change Orders

**Framework: Saad Munir + Furqan Aziz (Agency Building in 2026)**

**Rule:** Kabhi bhi free mein extra work mat karo. Scope creep = fastest way to destroy margins.

**Change Order Script (Saad Munir):**
> *"That integration is outside our current project scope. Our team can implement this in [X hours]. Would you like me to add that to this month's invoice?"*

**Never say:**
- "Haan ho jaayega" (yes it'll happen — no charge)
- "Main tujhe favor kar raha hun" (I'm doing you a favor)

**How to frame included extras (Saad Munir):**
> *"These two things are already covered under your current scope — no additional charge."*
> (Don't say "favor" — say "already included")

---

## STEP 10: Communication Stack — XeVoice Standard

**Framework: Saad Munir + Arham Abid**

| Channel | Use |
|---------|-----|
| **Slack (Paid Workspace)** | Client-facing: all updates, feedback, approvals |
| **ClickUp** | Project tasks, deliverables, sprint timelines |
| **Loom (Paid)** | Async SOPs, onboarding walkthroughs, update videos |
| **Miro (Paid)** | Process flowcharts, agent architecture diagrams |
| **Zoom ($5/month)** | Client calls + recording |
| **Riverside** | Video testimonial recording (weekly check-ins) |
| **Stripe** | Automated monthly billing + overage prorating |
| **GHL** | Client pipelines, appointment booking, automated sequences |

**NEVER use:**
- WhatsApp for team management (agency killer)
- Email for real-time project updates (too slow)
- Personal phone numbers for client support

---

## STEP 11: Upsell Trigger System

**Framework: Saad Munir (Agency Building in 2026)**

When client Control Tower status = **Happy + Results Delivering:**

1. Document exact results (calls answered, bookings made, revenue recovered)
2. Present upsell at next check-in:
   - Tier 1 → Tier 2 (add outbound agent + dashboard)
   - Add AI automation (secondary service)
   - Add AI website + chatbot + SEO (third service)
3. Frame as natural extension: *"Since your AI receptionist is already capturing every call, let's now make sure every person who lands on your website converts too."*
4. Never upsell during month 1 (too early) — start at month 2–3

---

## Complete XeVoice Operational Tech Stack

| Category | Tools |
|----------|-------|
| **Voice Orchestration** | Vapi (most popular, developer-friendly, raised $50M), Retell AI (lower latency) |
| **Voice Providers** | ElevenLabs + 8+ additional voice providers |
| **Cloud Infrastructure** | AWS + Supabase (database) + Claude API (weekly analysis) |
| **Middleware / Automation** | Make.com (preferred), Zapier (fallback), Custom REST APIs + Webhooks |
| **CRM & Scheduling** | GHL, ServiceTitan, Zoho, Follow Up Boss, Calendly, Cal.com, Google Calendar |
| **Client Portal** | Voice AI Wrapper (RingCentral-style BI dashboard) |
| **Project Management** | ClickUp + Slack (client) / ClickUp + WhatsApp (internal team) |
| **Payments** | Stripe (automated monthly billing + overage prorating) |
| **SOPs & Training** | Loom (async video SOPs) + Miro (visual flowcharts) + Google Drive (LMS) |
| **Reporting** | Looker Studio dashboards + Loom summary videos |
| **Testimonials** | Riverside (5-min client video reviews on check-in calls) |
| **Contracts** | PandaDoc ya DocuSign |

---

## Operations Mistakes to Avoid — XeVoice

| # | Mistake | Source | Fix |
|---|---------|--------|-----|
| 1 | One-time setup fee + hand-off model | Carmel Hernandez | Always recurring retainer (3–6 month) |
| 2 | Client left to manage agent themselves | Carmel Hernandez | White-glove fully managed always |
| 3 | Building separate automations per client | Kip Hernandez | Supabase master database — one update all agents |
| 4 | No weekly call log review / optimization | Kip Hernandez | Weekly Claude API analysis loop |
| 5 | WhatsApp for team management | Saad Munir | Slack + ClickUp mandatory |
| 6 | No internal handshake meeting after sales | Saad Munir | Sales → technical team full handoff |
| 7 | CEO directly managing every client | Saad Munir | Account Executive shields CEO |
| 8 | No SOPs — tribal knowledge only | Saad Munir | 5-step SOP protocol for every process |
| 9 | No Control Tower — blind to client health | Saad Munir | AirTable health tracking always |
| 10 | Scope creep without Change Orders | Saad Munir | Change Order script every time |
| 11 | Upsell too early (month 1) | Saad Munir | Wait for Happy status + results first |
| 12 | No testimonial system in place | Carmel Hernandez | Week 3 check-in + Riverside recording |

