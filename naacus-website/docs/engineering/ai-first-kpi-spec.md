# AI-First KPI Specification

> **Category:** Engineering | **Audience:** Product, analytics, engineering
> **Last Updated:** July 17, 2026 | [<- Docs Index](../readme.md)

---

## Objective

Measure whether the whole website fulfills this mission:

- Every page answers implicitly: who this is for, what to understand, what to do next
- NAACUS is trusted as a national place to understand, connect, and act

---

## Page-Level Metrics

### 1) Audience Fit Score

Definition: share of page sessions where first meaningful action aligns with page journey intent.

Formula:

AudienceFit = aligned_first_actions / total_page_sessions

Target:

- Baseline pages: >= 0.70

### 2) Understanding Score

Definition: share of sessions with understanding signals (trust/explainer consumption).

Signals:

- FAQ interaction
- About or leadership route follow-through
- Scroll depth >= 50%
- Session dwell threshold (team-defined)

Formula:

Understanding = sessions_with_understanding_signals / total_page_sessions

Target:

- Baseline pages: >= 0.60

### 3) Next-Step Execution Score

Definition: share of sessions where intended next action is completed from the page.

Formula:

NextStep = sessions_with_intended_next_step / total_page_sessions

Target:

- Informational pages: >= 0.35
- Action pages (membership/volunteer/donation/contact): >= 0.45

---

## Mission-Level Metrics

### 4) Understand

Composite signal from:

- About/Leadership/FAQ engagement
- AI answer usefulness
- Route progression toward trust pages

### 5) Connect

Composite signal from:

- Contact form start and completion
- Newsletter signup conversion
- Event detail engagement

### 6) Act

Composite signal from:

- Membership start/completion
- Volunteer start/completion
- Donation start/completion

### 7) Trust

Composite signal from:

- Return visitor rate
- Consent-aware engagement
- Human handoff success rate
- EN/FR parity

---

## Mission Index

Weighted score:

MissionIndex = 0.30*Trust + 0.25*Understand + 0.20*Connect + 0.25*Act

Release target:

- MissionIndex >= 70 (out of 100)

Guardrails:

- No category below 55
- EN/FR parity delta <= 10 points on conversion-critical metrics

---

## Operational Cadence

Weekly:

1. Compute page-level metrics for top routes
2. Compute mission-level categories and MissionIndex
3. Run threshold checker and publish report

Release gate recommendation:

- Fail release readiness when MissionIndex < 70 or any guardrail fails
