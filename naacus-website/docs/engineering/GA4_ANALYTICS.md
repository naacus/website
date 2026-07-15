# GA4 Setup & Analytics Guide

## Quick Start

### GA4 Already Configured
- ✅ Measurement ID: `G-0PWQTGEVJ6`
- ✅ Events tracking: form_submit, form_start, cta_click, purchase, file_download, scroll
- ✅ User properties: preferred_language, visitor_type, engagement_level, session_count
- ✅ Ministry tracking: ministry_interest (card_click, email_click, view)

### What Gets Tracked
| Event | When | Use Case |
|-------|------|----------|
| page_view | Page loads / route changes | Acquisition analysis |
| form_start, form_submit | User starts/completes form | Form abandonment |
| cta_click | User clicks CTA button | Engagement |
| purchase | Donation completed | Revenue tracking |
| ministry_interest | Ministry card clicked/viewed | Popular ministries |
| scroll_depth | User scrolls 25%, 50%, 75%, 100% | Content engagement |

## Register Custom Dimensions (5 min, Required for Reports)

### Event Parameters
Go to **GA4 → Admin → Custom definitions → Create custom dimension**

1. **ministry_name** (Event parameter)
   - Name: "Ministry Name"
   - Event parameter: `ministry_name`

2. **ministry_action** (Event parameter)
   - Name: "Ministry Action"
   - Event parameter: `ministry_action`

### User Properties
1. **preferred_language** → Scope: User
2. **visitor_type** → Scope: User
3. **engagement_level** → Scope: User
4. **session_count** → Scope: User

## View Reports

**Acquisition**
- GA4 → Reports → Acquisition → User acquisition
- See traffic sources (organic, direct, referral)

**Engagement**
- Reports → Engagement → Events
- Filter by event name (form_submit, ministry_interest, purchase)

**Ministry Interest**
- Reports → Explore → Free form
- Add `ministry_name` (custom dimension) as dimension
- Add `Event count` as metric
- Sort by count to see popular ministries

**User Properties**
- Reports → User → User attributes
- See breakdown by language, visitor type, engagement level

**Donations (Monetization)**
- Reports → Monetization → Overview
- Track revenue by donation amount, payment method

## Test Locally

```bash
cd naacus-website
npm start
```

1. Open http://localhost:3000
2. Accept cookies (page reloads)
3. Open console (F12)
4. Look for: `✓ Google Analytics initialized with user properties`
5. Click ministries, forms, CTAs
6. Check GA4 → Admin → DebugView for real-time events

## Mark Key Events

To see conversions in "Key events by Event name":

1. GA4 → Admin → Events
2. Find `form_submit`, `purchase`, `form_start`
3. Toggle "Mark as key event"

## Troubleshooting

**No data in DebugView?**
- Confirm cookie consent is accepted
- Check Measurement ID in index.html: `G-0PWQTGEVJ6`
- Try incognito (ad blockers can block gtag)

**User properties not showing?**
- Must register custom dimensions first (Admin → Custom definitions)
- Wait 24-48 hours after registration for data to populate

**Language not tracking?**
- Switch language using flag icon in header
- Check console: `📊 GA Language property updated: fr`

## Next Steps
- [ ] Register custom dimensions in GA4
- [ ] Mark key events as conversions
- [ ] Set up weekly email reports (Admin → Insights)
- [ ] Create custom dashboard (Looker Studio)
