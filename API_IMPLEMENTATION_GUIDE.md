# API Implementation Guide

## Quick Reference: What Calls What?

### ✅ Frontend Calls DIRECTLY (No Backend Needed)
| Service | Frontend Library | Purpose |
|---------|-----------------|---------|
| **Google Analytics 4** | gtag.js | Event tracking & analytics |
| **Stripe** | Stripe.js | Card payments |
| **PayPal** | PayPal SDK | PayPal payments |
| **Coinbase Commerce** | Hosted payment link | Cryptocurrency payments |
| **Square** | Web Payments SDK | Cash App / credit card payments |

**Frontend Configuration:**
- Stripe: `REACT_APP_STRIPE_PUBLISHABLE_KEY` (publishable key only)
- PayPal: `REACT_APP_PAYPAL_CLIENT_ID` (client ID only)
- GA4: `REACT_APP_GA4_MEASUREMENT_ID` (measurement ID only)
- Coinbase: `REACT_APP_COINBASE_PUBLIC_KEY` (public key only)
- Square: `REACT_APP_SQUARE_APP_ID` + `REACT_APP_SQUARE_LOCATION_ID`

### 📱 Backend APIs Required

| Endpoint | Purpose | Data Stored |
|----------|---------|-------------|
| **POST /v1/contact** | Submit contact form | Contact inquiries in Dataverse |
| **POST /v1/memberships** | Create membership | Member records in Dataverse |
| **POST /v1/volunteers** | Submit volunteer application | Volunteer records in Dataverse |
| **POST /v1/newsletter/subscribe** | Newsletter subscription | Subscriber list in Dataverse |
| **POST /v1/donations** | Record donation after payment | Donation records in Dataverse |
| **GET /v1/data/** | Retrieve read-only data | Leadership, events, FAQs, etc. |

---

## Frontend Flow Examples

### Donation Flow
```
1. User fills DonationDialog
2. Frontend calls Stripe.js directly (NOT backend)
3. Stripe returns payment confirmation
4. Frontend POST /v1/donations with transaction ID
5. Backend stores in Dataverse + sends receipt
```

### Contact Form Flow
```
1. User submits contact form
2. Frontend POST /v1/contact
3. Backend stores in Dataverse + sends email
4. Frontend shows success message
```

### Analytics Tracking Flow
```
1. User interacts with site
2. Frontend sends directly to GA4 via gtag.js (NOT backend)
3. GA4 records the event
```

---

## Backend Environment Variables

Store ONLY in backend `.env` (NEVER in frontend):

```bash
# Microsoft Dataverse
DATAVERSE_ENVIRONMENT_URL=https://orgxxxxx.crm.dynamics.com
DATAVERSE_CLIENT_ID=xxx
DATAVERSE_CLIENT_SECRET=xxx

# Email Service (SendGrid, Azure Communication Services, etc.)
EMAIL_SERVICE_API_KEY=xxx
EMAIL_FROM_ADDRESS=noreply@naacus.org

# JWT/Auth
JWT_SECRET=xxx
JWT_EXPIRY=24h

# Database
DATABASE_URL=xxx (if using separate DB instead of Dataverse)

# Logging
SENTRY_DSN=xxx (error tracking)

# Webhook Secrets (from payment providers)
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_WEBHOOK_ID=xxx
COINBASE_WEBHOOK_SECRET=xxx
SQUARE_WEBHOOK_SIGNATURE_KEY=xxx
```

---

## Frontend Environment Variables

```bash
# Backend API
REACT_APP_USE_BACKEND_API=true
REACT_APP_BACKEND_URL=https://api.naacus.org

# Frontend-accessible services ONLY
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXX
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
REACT_APP_PAYPAL_CLIENT_ID=xxxxx
REACT_APP_COINBASE_PUBLIC_KEY=xxxxx
REACT_APP_SQUARE_APP_ID=xxxxx
```

---

## Implementation Checklist

### Backend Setup
- [ ] Choose backend framework (Node.js, Python, .NET, Java)
- [ ] Set up Microsoft Dataverse connection
- [ ] Configure SharePoint access (if needed)
- [ ] Implement JWT authentication
- [ ] Set up CORS policy

### Required Endpoints
- [ ] POST /v1/contact
- [ ] GET /v1/contact
- [ ] POST /v1/memberships
- [ ] GET /v1/memberships
- [ ] POST /v1/volunteers
- [ ] GET /v1/volunteers
- [ ] POST /v1/newsletter/subscribe
- [ ] GET /v1/newsletter/subscribers
- [ ] POST /v1/donations
- [ ] GET /v1/donations
- [ ] GET /v1/data/leadership
- [ ] GET /v1/data/events
- [ ] GET /v1/data/faq

### Security
- [ ] Store all secrets in environment variables (NEVER in code)
- [ ] Implement request validation on all endpoints
- [ ] Add rate limiting to prevent spam
- [ ] Implement CORS properly (only allow naacus.org origin)
- [ ] Use HTTPS only
- [ ] Add request/response logging (without secrets)

### Testing
- [ ] Unit tests for each endpoint
- [ ] Integration tests with Dataverse
- [ ] Load testing for rate limits
- [ ] Error scenario testing

### Frontend Integration
- [ ] Set `REACT_APP_USE_BACKEND_API=true` in .env
- [ ] Set `REACT_APP_BACKEND_URL=https://api.naacus.org` in .env
- [ ] Test all contact/membership/volunteer submissions
- [ ] Test donation recording after Stripe/PayPal payments
- [ ] Verify error handling for failed API calls

---

## Transition Timeline

### Phase 1: Local Development (Current)
- Frontend uses mock data from `mockData.js`
- `REACT_APP_USE_BACKEND_API=false`
- Services fall back to mock data if backend unavailable

### Phase 2: Backend Development
- Backend team implements required endpoints
- Backend connected to Dataverse
- Test with `REACT_APP_USE_BACKEND_API=true` on staging

### Phase 3: Production
- Switch `REACT_APP_USE_BACKEND_API=true`
- Use production Dataverse environment
- Monitor error logs and performance
- Gradually deprecate mock data

---

## Support & Questions

Refer to [BACKEND_API_CONTRACT.md](./BACKEND_API_CONTRACT.md) for detailed API specifications.
