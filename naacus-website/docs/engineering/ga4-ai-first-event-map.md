# GA4 AI-First Event Mapping

> **Category:** Engineering | **Audience:** Analytics and development
> **Last Updated:** July 17, 2026 | [<- Docs Index](../readme.md)

---

## Purpose

Standardize event names and parameters used to measure AI-first mission outcomes across the entire website.

---

## Required Events

1. page_view
2. chat_opened
3. chat_quick_action_clicked
4. intent_next_step_clicked
5. journey_understand_clicked
6. journey_connect_clicked
7. journey_act_clicked
8. form_start
9. form_submit
10. donation_started
11. donation_completed
12. ai_handoff_triggered

---

## Required Parameters

Common parameters (all mission events):

- page_path
- locale
- route_group
- journey_stage (understand|connect|act)
- intent_route (from page intent config)

Action parameters:

- action_type (membership|volunteer|donation|contact|events|resources)
- action_target
- source_component (header|chat|page_cta|footer)

AI parameters:

- ai_context_route
- ai_response_source (copilot-studio|local-faq)
- ai_confidence_band (high|medium|low)
- handoff_target (contact|feedback|none)

---

## KPI Mapping

Audience Fit Score:

- Numerator events: journey_*_clicked where journey aligns with route intent
- Denominator: page_view

Understanding Score:

- Numerator: journey_understand_clicked, faq interactions, route progression to about/leadership/faq, deep scroll
- Denominator: page_view

Next-Step Execution Score:

- Numerator: intent_next_step_clicked followed by target completion event in same session
- Denominator: page_view

Mission Index categories:

- Understand: understanding-aligned event bundle
- Connect: contact/newsletter/events conversion bundle
- Act: membership/volunteer/donation conversion bundle
- Trust: return rate + handoff + parity bundle

---

## Data Contract Notes

- Keep event names stable; add new parameters instead of renaming events.
- All conversion-critical events must include locale for EN/FR parity checks.
- Keep route_group derivation consistent with app route definitions.
