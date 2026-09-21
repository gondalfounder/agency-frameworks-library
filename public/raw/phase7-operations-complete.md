# Phase 7 — Operations: Complete Framework Reference
**Sources: "Agency Building in 2026 | 6-Hr Session" (Saad Munir, Afroz Khan, Furqan Aziz) + "AI Voice Agency Specific Resources" (Carmel Hernandez, Jeremy Camilloni, Kip Hernandez, Shadab Omer, Arham Abid, Ayal & Yoav)**

---

## 1. Delivery Model — Retainer vs. One-Time Setup Fee

**Source: Carmel Hernandez, Jeremy Camilloni (AI Voice Agency Resources)**

### The Fatal Flaw of Setup-Only Delivery (Carmel Hernandez)

One-time setup fee ($2,000–$5,000) + agent hand-off = rapid agency churn.

**Why it fails:**
- Voice agents require constant call monitoring, prompt tweaking, technical troubleshooting
- Non-technical clients cannot maintain prompts or manage APIs themselves
- They will email/text for months → think product failed → churn
- Next month: $0 revenue. Starting from zero. Every single month.

*"You would not take a corporate 9-to-5 job if your salary was $10K one month and $1K the next."*

### The Retainer Standard (Carmel Hernandez)

- **Setup fee:** Lower or $0 upfront
- **Monthly retainer:** $1,000–$2,000/month
- **Commitment:** 3–6 month contract minimum

**The Onboarding/Maintenance Curve:**
- Months 1–2: Heavy developer time, manual oversight, prompt tuning, edge case fixing
- Month 3+: Agent runs smoothly → minimal manual intervention → predictable, high-margin recurring revenue

*"If your fulfillment and your customer service is really good, customers will not leave you."*

### 10x Markup — Maintenance Bundled In (Jeremy Camilloni)

- Raw tech stack: $0.09–$0.12/minute (Vapi/Retell + LLM + Transcriber)
- Client charge: $0.95–$1.00/minute (**90% margin**)
- **What's bundled inside per-minute rate:**
  - Continuous prompt optimization
  - Call log monitoring
  - Agent retraining on live edge cases
  - Ongoing proactive maintenance
  - White-glove handoff management

**Seasonal/Volume Scaling (Jeremy Camilloni):**
- Bring clients on at low minimum tier ($95–$100/month for 100 mins)
- As business grows or seasonal spikes hit → billing automatically jumps to $300–$500+/month
- No renegotiation needed — Stripe auto-charges per agreement

### Founder-Led Fulfillment Mastery Rule (Carmel Hernandez)

*"You or a co-founder MUST know how to build the agents yourselves, how to set up the integrations, test them properly, and how to handle onboarding — before outsourcing fulfillment to external contractors."*

---

## 2. The Four Facets of Integration Framework

**Source: Ayal & Yoav — YouFound AI (AI Voice Agency Resources)**

When implementing a Voice AI agent as an enterprise digital employee, structure fulfillment across 4 operational facets:

### Facet 1: Phone System Integration

**Why critical:** Without proper phone routing, the agent cannot intercept calls.

**Telephony platforms supported:**
- RingCentral, Vonage, Dialpad (most common)

**Capabilities to configure:**
- **Call Forwarding:** After-hours, overflow, missed calls route to agent
- **Warm Transfers:** Agent transfers irate callers or specific inquiries to live human staff
- **Call Tracking:** Track missed calls, answered calls, call volume — push structured data to secondary software

### Facet 2: Scripts & Brand Reflection Integration

*"When an AI is speaking to your customers you want to make sure it doesn't sound like some bland copy-and-paste agent."*

**Components:**
- **Brand Alignment:** Prompt agent to reflect company's specific tone, language, customer service style
- **Empathy Loops for Stressed Callers:** Program explicit empathy and delicacy loops — irate or stressed callers → offer message-taking or warm transfer, NOT robotic loops
- **Human-Equivalence Prompting:** Train the AI using the exact same training manuals and scripts provided to human front-desk employees

### Facet 3: Schedule & Calendar Mapping Integration

**Why separate from CRM:** Schedule is so integral to voice AI that it deserves its own facet.

**Scheduling tools:** Calendly, Cal.com, Google Calendar

**Action-Oriented Scheduling:**
- Map specific services strictly to qualified employee calendars
- e.g., specific trade technicians or medical staff assigned ONLY to jobs they are certified to service
- Employee mix-up prevention: wrong tech for wrong job = frustrated staff + failed delivery

**Cancellation-to-Reschedule Conversion:**
When caller asks to cancel → AI asks for reason → if fixable → converts to rescheduled slot
*"A lot of the time that works if they're just looking to cancel."*

### Facet 4: CRM & Data Structure Integration

**CRMs supported:** ServiceTitan, Zoho, Follow Up Boss, Folk CRM, GoHighLevel (GHL), Google Calendar

**Data captured per call:** Caller name, phone number, email, service requested, call summary

**Integration Priority Ladder:**
1. Check if CRM has **direct integration on Make.com** (preferred — more powerful, lower cost)
2. If not → check **Zapier** (more user-friendly, more expensive)
3. If not on Make or Zapier → go to CRM's developer portal → find **REST API documentation**
4. Build **custom Webhook** connection via Make.com
5. If no API at all → this CRM cannot be connected; advise client to switch

**Performance Benchmarking via CRM Data:**
- Structure data to measure AI drop-off rates vs. booked appointment percentages
- Compare AI performance vs. human front-desk staff conversion rates

---

## 3. Multi-Tenant Database Architecture & Automated Optimization Loop

**Source: Kip Hernandez (AI Voice Agency Resources)**

### Master Backend Database (Multi-Tenant Setup)

**The Old Way:** Build separate n8n + GHL automations from scratch for every new client.
**Problem:** Time-consuming, inconsistent quality, no learning across clients.

**Kip's Solution — Supabase Master Database:**
- All deployed Voice AI agents (Retell AI) connect to one single Supabase master database
- New client uploaded to database → their agent automatically uses shared automation pipeline
- Books appointments directly into their isolated GHL accounts
- *"I don't have to build the n8n automation, I don't have to build the GHL automations — I get a client, they get uploaded to the database, and now they all use the same automation."*

### Weekly Automated Prompt Optimization Loop (Kip Hernandez)

**Step 1 — Data Collection:**
All call transcripts + call outcomes routed from Retell AI → Supabase automatically

**Outcomes tracked per call:**
- Booked appointment ✓
- Did not book ✗
- Tool failure during call
- Attempted booking but failed
- Call transferred to human
- Caller requested booking link

**Step 2 — AI Skill Evaluation:**
Cloud Code (Claude API) runs on a weekly schedule → analyzes all call logs against set quality criteria

**Step 3 — Global Prompt Update:**
Cloud Code generates weekly diagnostic report:
- Conversion drop areas
- Specific prompt adjustment recommendations
- Edge cases the agent couldn't handle

**Step 4 — One Update, All Agents Updated:**
Adjust the master system prompt in Supabase once → automatically updates every deployed client agent simultaneously

*"The cool thing about how we set it up is we adjust the prompt one time and it automatically updates to every single agent we have deployed."*

---

## 4. Client Onboarding Process & Delivery Workflows

**Source: Jeremy Camilloni, Carmel Hernandez, Kip Hernandez (AI Voice Agency Resources) + Saad Munir, Afroz Khan (Agency Building in 2026)**

### Vertical Templatization & Variable Management (Jeremy Camilloni)

**For high-volume verticals (e.g., junk removal):**
- One standardized master system prompt
- During onboarding: only swap specific client variables:
  - Business name
  - Operating hours
  - Service areas
  - Pricing tiers
- *"Junk removal companies are almost all the same — their calls are almost all the same."*

**New Vertical Onboarding (e.g., party bus/limo):**
- Trial-and-error testing during first client onboarding
- Client feedback during initial 30 days → refines core call logic for all future vertical clients
- *"Their feedback during onboarding is allowing us to set up call flows for future clients — they don't even realize this."*

### Post-Sale Handoff — 24-Hour Welcome Funnel (Saad Munir + Afroz Khan)

Within 24 hours of deal closing:

1. **Automated Welcome Email** + short founder Loom video
2. **SLA Document** shared: exact deliverables, timelines, revision limits
3. **Dedicated Slack Workspace** created — NOT WhatsApp/personal email
4. **Structured Onboarding Doc** shared: access requirements, integrations needed, what client needs to provide
5. **Kick-off Call Scheduled:** Agenda defined, discovery requirements listed

### Client Communication Protocol (Arham Abid + Saad Munir)

| Channel | Use |
|---------|-----|
| **Slack** | Client-facing: all project updates, feedback, approvals |
| **ClickUp** | Client project management, task tracking, deliverable management |
| **ClickUp + WhatsApp** | Internal team communication |
| **Loom** | Async SOP recordings, training walkthroughs, update videos |
| **Zoom** ($5/mo) | Client calls (unlimited US recording) |
| **Close.com** | CRM + team calling (preferred over GHL for calling) |

### Weekly Check-in Call Protocol (Carmel Hernandez)

- **Frequency:** Weekly during first month
- **Agenda:** Review call logs, listen to recordings, refine prompts together
- **Week 3 Check-in (20% Testimonial Incentive):**

  When results are positive:
  > *"Everything is going well! I can give you 20% off next month's retainer if you do a quick 5-minute video review with me right now on this call."*

  - Record immediately via **Riverside** on that same call
  - Cut into clips → use as Meta ad creative + landing page social proof

---

## 5. Client Reporting Tiers & Dashboard System

**Source: Jeremy Camilloni (AI Voice Agency Resources)**

### Client Dashboard Tool: Voice AI Wrapper

- BI tool that connects to backend voice orchestration engines
- Creates RingCentral-style management portal per client
- Client can log in and view:
  - Real-time call logs
  - Call recordings (playback)
  - Full transcripts
  - Automated call summaries
  - Booking outcomes

### Two-Tier Client Behavior Model (Jeremy Camilloni)

| Client Type | Behavior | Service Model |
|-------------|----------|---------------|
| **Field Owner-Operators** (solo tradesmen, truck drivers) | Never log into dashboard — too busy | Real-time SMS/email post-call notifications; CRM auto-push |
| **Corporate / Office-Based SMBs** (office managers, multi-crew companies) | Log into portal daily — manage from managerial level | Full dashboard access, weekly call reviews, team-level metrics |

---

## 6. Control Tower — Client Health Tracking System

**Source: Saad Munir, Afroz Khan (Agency Building in 2026)**

### Emotional Health Tracker (AirTable or Google Sheet)

Track every client's current emotional/satisfaction status:

| Client Status | Action Protocol |
|---------------|----------------|
| **Happy / Healthy** | Sales team → upsell sequence trigger; ask for referral; schedule video testimonial |
| **Curious / Uncertain** | Account Executive → proactive scope clarification, additional support |
| **Unhappy / At-Risk** | Immediate Account Manager intervention → satisfaction recovery protocol |
| **Super Angry** | Immediately escalate to senior leadership / CEO → churn prevention call |

**Key Rule:** Catch dissatisfaction BEFORE the client brings it up. Proactive beats reactive.

### Upsell Trigger System (Saad Munir)

When client status = Happy + results are delivering:
1. Document exact results delivered (revenue gained, leads booked, calls handled)
2. Present upsell: additional agent, new vertical, outbound layer
3. Frame as natural extension of existing success — not a new sale
4. *"The best upsell is delivered when the client is already winning."*

---

## 7. SLA Architecture & Scope Protection

**Source: Saad Munir, Furqan Aziz, Afroz Khan (Agency Building in 2026)**

### Service Document → SLA Mapping

Every item in the pre-defined Internal Service Document becomes a contractual SLA:

| Component | SLA Specification |
|-----------|------------------|
| Deliverable Scope | Exactly what is delivered — no ambiguity |
| Revision Limits | Exact number of revision rounds included |
| Timelines | Milestone dates — not "ASAP" |
| Communication Standards | Response time SLA (e.g., 24hr Slack response) |
| Ownership / Access | Who owns accounts, assets, data |

**Scope Creep Prevention (Saad Munir):**
- Any client request outside signed SLA = Change Order
- Change Order = separate invoice line item
- *"Scope creep unpaid = the fastest way to destroy margins."*

### Paid Discovery Workshop → Clean Delivery Transition (Furqan Aziz)

- Discovery Workshop deliverables (SRS + Architecture + Roadmap) signed off BEFORE development begins
- This document becomes the binding SLA for the full project
- Prevents endless scope negotiation mid-delivery

---

## 8. CEO Operational Discipline & Team Management

**Source: Arham Abid, Saad Munir, Shadab Omer (AI Voice Agency Resources + Agency Building in 2026)**

### Single Point of Contact EA Model (Arham Abid)

- CEO NEVER directly communicates with individual developers, video editors, funnel designers
- ONE Executive Assistant (EA) receives all strategy/offer direction from CEO
- EA translates CEO strategy into execution tasks for each team member
- EA knows: which funnel designer matches CEO's style, which video editor, which graphic designer

*"My point of contact is ONE person. If I talked to 6-7 people, my time wouldn't be enough to explain to one, review the funnel, explain to another, review the video."*

### CFO / Finance Manager Boundary Shielding (Arham Abid)

- Dedicated finance manager handles ALL internal team financial requests:
  - Salary advances, personal loans, family emergencies
  - Payroll delays, payment issues, team complaints
- CEO NEVER directly receives these requests
- **Why:** CEO will be emotionally guilted into poor financial decisions — *"Yaar meri bahan ki shaadi hai, kuch paise chahiye"* — and will approve it out of politeness
- Finance manager can say no without emotional damage to relationship

*"If I'm the front face and someone comes to me, I'll say 'give it to them' out of murabbat. My finance manager says 'budget nahi hai.'"*

### "Outsource Only What You Know" Rule (Shadab Omer + Arham Abid)

- NEVER outsource any skill until you understand the process yourself
- Knowing the technical details ("ones and zeros") allows you to:
  - Set accurate expectations
  - Manage timelines realistically
  - Detect fabricated progress reports
  - Communicate precisely with contractors
- *"If you don't know GHL automations, the contractor can submit fake reports and you won't know."*

### Hire Beginners, Train Internally (Arham Abid)

**Do NOT hire:** Expensive "highly trained" external executives for core positions
- External experts: *"They will either make you or break you — and if they break you, you cannot afford that."*

**DO hire:** Ambitious, teachable beginners — train from scratch
- They own the role because they grew into it in your presence
- They understand your style, clients, systems
- Loyalty and alignment far higher than external "expert" hires

**Arham Abid's Team:** CMO, CEO, CFO — all trained from basic hires. None were external experts.

### "Firefighter Monday–Friday" + Strict Weekend Disconnect (Arham Abid)

- Weekday mindset: CEO is a firefighter — solving daily operational chaos (12–14 hours/day)
- *"Roz uthte hain jang larne ke liye."*
- **Saturday + Sunday: 100% strict disconnect — no compromise**
- Even if millions of dollars on the line: *"Weekend meri chutti hai — nahi karta."*
- Goes into mountains/nature — completely offline

---

## 9. Project Management Systems & Tools

**Source: Saad Munir, Afroz Khan, Arham Abid (Agency Building in 2026 + AI Voice Agency Resources)**

### Onboarding & Delivery Workflow Stack (Saad Munir + Afroz Khan)

| Tool | Purpose |
|------|---------|
| **Slack** | Client-facing workspace — dedicated per client |
| **ClickUp** | Project tracking, task assignment, deliverable deadlines |
| **Loom** | Async SOPs, onboarding walkthroughs, internal training |
| **Miro** | Process maps, frameworks visualization, client architecture diagrams |
| **Riverside** | Video testimonial recording in weekly check-ins |
| **Zoom** ($5/mo) | Client calls + recording |
| **Close.com** | CRM + multi-line calling for team |
| **GHL (GoHighLevel)** | Client funnels, pipelines, appointment booking |

### "Assign Dedicated Resource" Rule (Arham Abid)

- Rather than "service delivery department" model → assign specific team members to specific clients
- Client-attached model: team member moves with the client relationship
- Prevents knowledge gaps, handoff errors, client confusion

*"Hum service nahi dete — hamare preferred partners hain. Hum unhe client ke saath attach karte hain."*

---

## 10. Complete Operational Tech Stack

**Source: Jeremy Camilloni, Kip Hernandez, Ayal & Yoav, Carmel Hernandez (AI Voice Agency Resources)**

| Category | Tools |
|----------|-------|
| **Voice Orchestration** | Vapi (most popular, dev-friendly, raised $50M), Retell AI (lower latency), custom multi-provider stack |
| **Voice Providers** | ElevenLabs + 8+ additional voice providers (variety over mass-market SaaS) |
| **Cloud Infrastructure** | AWS, Supabase (database), Cloud Code / Claude API (weekly analysis) |
| **Middleware / Automation** | Make.com (preferred — more powerful, cheaper), Zapier (fallback — more user-friendly, expensive), Custom REST APIs + Webhooks |
| **CRM & Scheduling** | GoHighLevel, ServiceTitan, Zoho, Follow Up Boss, Folk CRM, Calendly, Cal.com, Google Calendar |
| **Client Portal** | Voice AI Wrapper (BI dashboard — RingCentral-style portal for clients) |
| **Calling Infrastructure** | Zoom $5/mo (solo), GoHighLevel (team), Close.com (preferred for team calling) |
| **Project Management** | ClickUp + Slack (client) / ClickUp + WhatsApp (internal) |
| **Payments** | Stripe (automated monthly billing + overage prorating) |
| **Social Proof Collection** | Riverside (5-min video testimonials on weekly check-in calls) |
| **Content & SOPs** | Loom (async training, onboarding docs) |
| **Visual Frameworks** | Miro (architecture, process maps) |

---

## 11. Operations Mistakes to Avoid

| # | Mistake | Source |
|---|---------|--------|
| 1 | One-time setup fee model — no recurring delivery component | Carmel Hernandez |
| 2 | Handing agent ownership to non-technical client post-setup | Carmel Hernandez |
| 3 | Outsourcing fulfillment before founder understands the build | Carmel Hernandez |
| 4 | Using WhatsApp/personal email for client communication — no structure | Saad Munir |
| 5 | CEO directly managing all developers, editors, designers individually | Arham Abid |
| 6 | CEO receiving internal team financial requests directly | Arham Abid |
| 7 | Outsourcing skills you haven't mastered yourself | Shadab Omer |
| 8 | Hiring experienced external executives for core positions | Arham Abid |
| 9 | Working weekends — no recovery/disconnect | Arham Abid |
| 10 | Building separate automations per client instead of master database | Kip Hernandez |
| 11 | Allowing scope creep without Change Orders | Saad Munir |
| 12 | No client health tracking — churn surprises you | Saad Munir |
| 13 | Delivering without signed SLA / scope doc | Saad Munir, Furqan Aziz |
| 14 | Rebuilding system prompt per client — no global update system | Kip Hernandez |

