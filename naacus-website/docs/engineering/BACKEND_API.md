# Backend API Guide

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 15, 2026 | [← Docs Index](../README.md)

---

This document covers the backend API architecture, implementation guide, and full endpoint specification for the NAACUS website.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend vs Backend Responsibilities](#frontend-vs-backend-responsibilities)
3. [Implementation Flow Examples](#implementation-flow-examples)
4. [Environment Variables](#environment-variables)
5. [API Specification](#api-specification)
6. [Error Handling](#error-handling)
7. [Security & Rate Limiting](#security--rate-limiting)
8. [Webhook Events](#webhook-events)
9. [Dataverse Schema](#dataverse-schema)
10. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

- **Data Storage:** Microsoft Dataverse (primary — members, volunteers, donations, events, contacts)
- **Content/Documents:** SharePoint (resources, newsletters, FAQs, event materials)
- **Backend Framework:** Node.js/Express, Python/Django, .NET, or Java
- **Authentication:** Azure AD B2C or OAuth2 (JWT tokens)
- **Hosting:** Azure App Service or Functions

---

## Frontend vs Backend Responsibilities

### Frontend Calls Directly (No Backend Needed)

| Service | Library | Key Type |
|---------|---------|----------|
| Google Analytics 4 | gtag.js | `REACT_APP_GA4_MEASUREMENT_ID` |
| Stripe | Stripe.js | `REACT_APP_STRIPE_PUBLISHABLE_KEY` |
| PayPal | PayPal SDK | `REACT_APP_PAYPAL_CLIENT_ID` |
| Coinbase Commerce | Hosted link | `REACT_APP_COINBASE_PUBLIC_KEY` |
| Square | Web Payments SDK | `REACT_APP_SQUARE_APP_ID` |

### Backend APIs Required

| Endpoint | Purpose | Data Stored In |
|----------|---------|----------------|
| POST /v1/contact | Submit contact form | Dataverse |
| POST /v1/memberships | Create membership | Dataverse |
| POST /v1/volunteers | Submit volunteer app | Dataverse |
| POST /v1/newsletter/subscribe | Newsletter signup | Dataverse |
| POST /v1/donations | Record donation | Dataverse |
| GET /v1/data/* | Retrieve read-only data | SharePoint/Dataverse |

### Backend-Only Services

- Microsoft Dataverse access (service account)
- SharePoint access (service account)
- Email delivery (SendGrid / Azure Communication Services)
- SMS/Notifications (Twilio / Azure)
- Webhook processing (payment providers)
- Payment persistence (storing donation records)

---

## Implementation Flow Examples

### Donation Flow
```
User → DonationDialog
  → Frontend calls Stripe.js directly (NOT backend)
  → Stripe returns payment confirmation
  → Frontend POST /v1/donations (sends data to backend)
  → Backend stores in Dataverse + sends receipt email
  → Frontend shows confirmation
```

### Contact Form Flow
```
User → Contact form
  → Frontend POST /v1/contact
  → Backend stores in Dataverse + sends email notification
  → Frontend shows success message
```

### Analytics Tracking Flow
```
User interacts with page
  → Frontend sends to GA4 directly via gtag.js (NOT backend)
  → GA4 records event with user properties
```

---

## Environment Variables

### Frontend (publishable keys only)

```bash
REACT_APP_USE_BACKEND_API=true
REACT_APP_BACKEND_URL=https://api.naacus.org
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXX
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
REACT_APP_PAYPAL_CLIENT_ID=xxxxx
REACT_APP_COINBASE_PUBLIC_KEY=xxxxx
REACT_APP_SQUARE_APP_ID=xxxxx
REACT_APP_SQUARE_LOCATION_ID=xxxxx
```

### Backend (secrets — NEVER in frontend)

```bash
# Microsoft Azure / Dataverse
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx
DATAVERSE_ENVIRONMENT_URL=https://orgxxxxx.crm.dynamics.com
SHAREPOINT_SITE_URL=https://naacus.sharepoint.com/sites/naacus
SHAREPOINT_CLIENT_ID=xxx
SHAREPOINT_CLIENT_SECRET=xxx

# Email Service
SENDGRID_API_KEY=xxxxx
SENDGRID_FROM_EMAIL=noreply@naacus.org

# JWT/Auth
JWT_SECRET=xxxxx
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=30d

# CORS
CORS_ORIGIN=https://naacus.org

# Logging
LOG_LEVEL=info
SENTRY_DSN=xxxxx

# Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_WEBHOOK_ID=xxxxx
COINBASE_WEBHOOK_SECRET=xxxxx
SQUARE_WEBHOOK_SIGNATURE_KEY=xxxxx
```

---

## API Specification

### Base URL
```
https://api.naacus.org/v1
```

### Headers (All Requests)
```
Content-Type: application/json
Authorization: Bearer {token}  // For authenticated endpoints
X-API-Key: {api-key}          // For service-to-service calls
```

---

### Membership Management

#### POST /memberships
Create a new membership record.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (valid email)",
  "phone": "string",
  "dateOfBirth": "string (YYYY-MM-DD)",
  "gender": "string (male/female/other)",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "country": "string",
  "parish": "string",
  "diocese": "string",
  "languagePreference": "string (en/fr)",
  "interests": ["string"],
  "emergencyContact": "string",
  "emergencyPhone": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "memberId": "NAACUS-XXXXXX",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "status": "active|pending_review|inactive",
    "joinDate": "ISO-8601",
    "createdAt": "ISO-8601",
    "updatedAt": "ISO-8601"
  },
  "message": "Membership created successfully"
}
```

#### GET /memberships
List all memberships with pagination.

**Query:** `?limit=10&offset=0&status=active&year=2024&sortBy=createdAt&sortOrder=desc`

**Response (200):**
```json
{
  "success": true,
  "data": [{ "id": "uuid", "memberId": "NAACUS-XXXXXX", "firstName": "string", "status": "active" }],
  "pagination": { "total": 500, "limit": 10, "offset": 0, "pages": 50 }
}
```

#### GET /memberships/{id}
Get single membership by ID.

#### PUT /memberships/{id}
Update membership record. Body: partial fields to update.

#### DELETE /memberships/{id}
Delete membership record.

---

### Volunteer Management

#### POST /volunteers
Create volunteer application.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "languagesSpoken": ["string"],
  "skills": ["string"],
  "volunteerInterests": ["string"],
  "availability": ["weekday|weekend|evening"],
  "backgroundCheckConsent": true,
  "referencesConsent": true,
  "message": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationId": "VOL-XXXXXX",
    "status": "pending_review|approved|rejected",
    "backgroundCheckStatus": "pending|approved|rejected",
    "createdAt": "ISO-8601"
  },
  "message": "Volunteer application submitted successfully"
}
```

#### GET /volunteers
List with filters: `?limit=10&offset=0&status=pending_review&backgroundCheckStatus=approved`

#### GET /volunteers/{id}
Get volunteer details.

#### PUT /volunteers/{id}
Update volunteer (admin only). Body: `{ "status": "approved", "notes": "string" }`

---

### Newsletter Management

#### POST /newsletter/subscribe
```json
{
  "email": "string",
  "name": "string",
  "languagePreference": "en|fr",
  "consentGiven": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "uuid", "email": "string", "status": "active", "subscribedAt": "ISO-8601" },
  "message": "Successfully subscribed to newsletter"
}
```

#### GET /newsletter/subscribers
List subscribers (admin only): `?limit=50&offset=0&status=active`

#### POST /newsletter/unsubscribe
Body: `{ "email": "string" }`

---

### Contact Management

#### POST /contact
Submit contact inquiry.

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "organization": "string (optional)",
  "topic": "membership|volunteer|events|donation|partnership|feedback|other",
  "subject": "string",
  "message": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "inquiryId": "INQ-XXXXXX",
    "topic": "string",
    "status": "new|in_progress|responded|closed",
    "submittedAt": "ISO-8601"
  },
  "message": "Your inquiry has been submitted successfully"
}
```

#### GET /contact
List inquiries (admin only): `?limit=20&offset=0&status=new&topic=membership`

#### GET /contact/{id}
Get inquiry details.

#### PUT /contact/{id}
Update inquiry status (admin only). Body: `{ "status": "responded", "notes": "string" }`

---

### Event Management

#### GET /events
List events: `?limit=20&offset=0&type=upcoming|past&year=2025&sortBy=date`

**Response (200):**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "title": "string",
    "date": "ISO-8601",
    "location": "string",
    "type": "conference|workshop|meeting|other",
    "capacity": "integer"
  }],
  "pagination": { "total": 50, "limit": 20, "offset": 0, "pages": 3 }
}
```

#### GET /events/{id}
Get event details including agenda, speakers, registration info.

#### POST /events/{id}/register
Register for an event.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "organization": "string (optional)",
  "dietaryRestrictions": "string (optional)",
  "specialNeeds": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "registrationId": "REG-XXXXXX",
    "eventId": "uuid",
    "status": "registered",
    "registeredAt": "ISO-8601"
  }
}
```

#### GET /events/{eventId}/registrations
Get event registrations (admin only).

---

### Donations (Post-Payment Recording)

Frontend processes payments directly via Stripe/PayPal/Coinbase/Square. Backend only stores records after successful payment.

#### POST /v1/donations

**Request:**
```json
{
  "transactionId": "stripe_pi_xxxxx or paypal_order_id",
  "amount": 100.00,
  "currency": "USD",
  "paymentMethod": "card|paypal|crypto|cashapp",
  "paymentProvider": "stripe|paypal|coinbase|square",
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "isAnonymous": false,
  "message": "Supporting NAACUS mission"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "donation_uuid",
    "transactionId": "stripe_pi_xxxxx",
    "amount": 100.00,
    "status": "completed",
    "createdAt": "ISO-8601"
  }
}
```

#### GET /v1/donations
List donations with pagination.

#### GET /v1/donations/{id}
Get specific donation details.

---

### Data Retrieval (Read-Only)

| Endpoint | Returns |
|----------|---------|
| GET /v1/data/leadership | Board members, advisers, ministries |
| GET /v1/data/ministries | All ministries information |
| GET /v1/data/resources | Resources and quick links |
| GET /v1/data/events | All events (upcoming and past) |
| GET /v1/data/faq | FAQs by category |
| GET /v1/data/testimonials | Member testimonials |
| GET /v1/search?q=query | Global search (optional) |

---

## Error Handling

### Standard Response Format
```json
{
  "success": true|false,
  "data": {},
  "error": "string (only if success=false)",
  "pagination": {},
  "timestamp": "ISO-8601"
}
```

### Error Responses

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad Request | `{ "success": false, "error": "Validation failed", "errors": [{ "field": "email", "message": "Invalid email" }] }` |
| 401 | Unauthorized | `{ "success": false, "error": "Authentication required" }` |
| 403 | Forbidden | `{ "success": false, "error": "Insufficient permissions" }` |
| 404 | Not Found | `{ "success": false, "error": "Resource not found" }` |
| 422 | Unprocessable | `{ "success": false, "error": "Validation failed", "errors": [...] }` |
| 429 | Rate Limited | `{ "success": false, "error": "Rate limit exceeded", "retryAfter": 60 }` |
| 500 | Server Error | `{ "success": false, "error": "Internal server error", "requestId": "uuid" }` |

### Frontend Integration Notes

The frontend expects:
- All responses with `success` boolean field
- Consistent error format with `error` string
- Pagination with `total`, `limit`, `offset`, `pages`
- ISO-8601 timestamps throughout
- Proper HTTP status codes
- CORS headers allowing requests from frontend domain

---

## Security & Rate Limiting

### Rate Limiting Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Required Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### CORS Policy
```
Access-Control-Allow-Origin: https://naacus.org
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Authentication
- JWT tokens for authenticated endpoints (24h expiry)
- Refresh tokens valid for 30 days
- All sensitive endpoints require authentication

### Credentials Management
- Store secrets in Azure Key Vault
- Use managed identity where possible
- Rotate credentials regularly
- Service accounts with minimal permissions

### Payment Security
- Frontend uses publishable keys only
- Webhook signature verification for all processors
- Idempotency keys for payments
- HTTPS only (enforced with HSTS)
- PCI DSS compliance for webhook data

---

## Webhook Events

### Payment Completed
```json
{
  "event": "payment.completed",
  "timestamp": "ISO-8601",
  "data": {
    "paymentId": "string",
    "transactionId": "string",
    "amount": 50.00,
    "donorEmail": "string",
    "paymentMethod": "card|paypal|bank|crypto|cashapp"
  }
}
```

### Payment Failed
```json
{
  "event": "payment.failed",
  "timestamp": "ISO-8601",
  "data": {
    "paymentId": "string",
    "amount": 50.00,
    "reason": "card declined, insufficient funds, etc."
  }
}
```

---

## Dataverse Schema

### Key Tables

| Table | Key Fields |
|-------|-----------|
| `naacus_member` | id, member_id, first_name, last_name, email, phone, status, join_date |
| `naacus_donation` | id, transaction_id, amount, currency, payment_method, payment_provider_transaction_id, status, donor_email |
| `naacus_contact` | id, inquiry_id, name, email, topic, subject, message, status |
| `naacus_event` | id, title, description, date_start, date_end, location, type, capacity |
| `naacus_volunteer_application` | id, application_id, first_name, last_name, email, skills, interests, availability, status |
| `naacus_newsletter_subscriber` | id, email, name, language_preference, status |

---

## Implementation Checklist

### Backend Setup
- [ ] Choose framework (Node.js, Python, .NET, Java)
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
- [ ] Store all secrets in environment variables
- [ ] Implement request validation on all endpoints
- [ ] Add rate limiting
- [ ] Implement CORS (only allow naacus.org)
- [ ] Use HTTPS only
- [ ] Add request/response logging (without secrets)
- [ ] Webhook signature verification

### Testing
- [ ] Unit tests for each endpoint
- [ ] Integration tests with Dataverse
- [ ] Load testing for rate limits
- [ ] Error scenario testing

### Frontend Integration
- [ ] Set `REACT_APP_USE_BACKEND_API=true`
- [ ] Set `REACT_APP_BACKEND_URL=https://api.naacus.org`
- [ ] Test all form submissions
- [ ] Test donation recording after payments
- [ ] Verify error handling for failed API calls

### Transition Timeline

**Phase 1 — Current:** Frontend uses mock data (`REACT_APP_USE_BACKEND_API=false`)
**Phase 2 — Development:** Backend implements endpoints, test on staging
**Phase 3 — Production:** Switch to `REACT_APP_USE_BACKEND_API=true`, monitor logs

---

Last Updated: December 2025
Version: 2.0 (Microsoft Dataverse/SharePoint Architecture)
Status: Ready for Implementation
