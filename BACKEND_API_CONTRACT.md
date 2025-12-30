# Backend API Contract - Microsoft Dataverse/SharePoint Architecture

## Overview

This document defines the backend API endpoints needed to support the NAACUS website frontend.

### Frontend-Callable Services (NO Backend API Needed)
✅ **Google Analytics 4** - Frontend calls directly via gtag.js  
✅ **Stripe** - Frontend calls directly via Stripe.js with publishable key  
✅ **PayPal** - Frontend calls directly via PayPal SDK  
✅ **Coinbase Commerce** - Frontend calls directly via hosted payment link  
✅ **Square** - Frontend calls directly via Web Payments SDK  

### Services Requiring Backend APIs
The backend provides REST APIs for:
1. **Contact Inquiries** - Form submissions
2. **Membership Management** - Create, read, update membership records
3. **Volunteer Applications** - Manage volunteer submissions
4. **Newsletter Subscriptions** - Subscribe/unsubscribe management
5. **Donation Recording** - Store donation records after payment completion
6. **Data Retrieval** - Leadership, ministries, resources, testimonials, events, FAQs

### Architecture
- **Data Storage:** Microsoft Dataverse (primary), SharePoint (documents/content)
- **Frontend:** Calls backend REST APIs OR directly to external payment/analytics services
- **Backend:** Manages Dataverse/SharePoint access, stores business data, handles email/SMS notifications

---

## Architecture Notes

### Data Storage
- **Primary Data:** Microsoft Dataverse (members, volunteers, donations, events, contacts)
- **Content/Documents:** SharePoint (resources, newsletters, FAQs, event materials)

### Frontend-Callable Services
Frontend **CAN call directly** (no backend proxy needed):
- ✅ Google Analytics 4 (GA4) via gtag.js
- ✅ Stripe via Stripe.js (card collection, payment intents)
- ✅ PayPal via PayPal SDK/Checkout
- ✅ Coinbase Commerce via hosted payment link
- ✅ Square Web Payments SDK
- ✅ Email signup via third-party services (if applicable)

### Backend-Only Services
Backend is responsible for:
- ✅ Microsoft Dataverse access (service account with managed identity)
- ✅ SharePoint access (service account with managed identity)
- ✅ Email delivery (SendGrid, Azure Communication Services)
- ✅ SMS delivery (if implemented)
- ✅ Business logic APIs (memberships, volunteer management, contacts, etc.)

### Technology Stack
- **Backend Framework:** Node.js/Express, Python/Django, .NET (Azure), or Java
- **Database:** Microsoft Dataverse (primary data)
- **Content Management:** SharePoint (documents, rich content)
- **Authentication:** Azure AD B2C or OAuth2
- **Hosting:** Azure App Service or Functions
- **Frontend External Services:** Configured with publishable/client-side keys only

---

## 1. Authentication & Authorization

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

## 2. Membership Management

### POST /memberships
**Description:** Create a new membership record

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

**Response (201 Created):**
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
    "joinDate": "ISO-8601 timestamp",
    "createdAt": "ISO-8601 timestamp",
    "updatedAt": "ISO-8601 timestamp"
  },
  "message": "Membership created successfully"
}
```

**Error Response (400/422):**
```json
{
  "success": false,
  "error": "Validation error message",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

### GET /memberships
**Description:** List all memberships with pagination and filtering

**Query Parameters:**
```
?limit=10&offset=0&status=active&year=2024&sortBy=createdAt&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "memberId": "NAACUS-XXXXXX",
      "firstName": "string",
      "email": "string",
      "status": "active",
      "joinDate": "ISO-8601 timestamp"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 10,
    "offset": 0,
    "pages": 50
  }
}
```

---

### GET /memberships/{id}
**Description:** Get single membership by ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "memberId": "NAACUS-XXXXXX",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "status": "active",
    "joinDate": "ISO-8601 timestamp",
    "createdAt": "ISO-8601 timestamp"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Membership not found",
  "status": 404
}
```

---

### PUT /memberships/{id}
**Description:** Update membership record

**Request:**
```json
{
  "phone": "string",
  "address": "string",
  "city": "string",
  "status": "active|inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated membership */ },
  "message": "Membership updated successfully"
}
```

---

### DELETE /memberships/{id}
**Description:** Delete membership record

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Membership deleted successfully"
}
```

---

## 3. Volunteer Management

### POST /volunteers
**Description:** Create volunteer application

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
  "availability": ["string (weekday/weekend/evening)"],
  "backgroundCheckConsent": boolean,
  "referencesConsent": boolean,
  "message": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationId": "VOL-XXXXXX",
    "firstName": "string",
    "email": "string",
    "status": "pending_review|approved|rejected",
    "backgroundCheckStatus": "pending|approved|rejected",
    "createdAt": "ISO-8601 timestamp",
    "submittedAt": "ISO-8601 timestamp"
  },
  "message": "Volunteer application submitted successfully"
}
```

---

### GET /volunteers
**Description:** List all volunteers with filtering

**Query Parameters:**
```
?limit=10&offset=0&status=pending_review&backgroundCheckStatus=approved
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicationId": "VOL-XXXXXX",
      "firstName": "string",
      "email": "string",
      "status": "pending_review",
      "backgroundCheckStatus": "pending",
      "createdAt": "ISO-8601 timestamp"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "pages": 10
  }
}
```

---

### GET /volunteers/{id}
**Description:** Get volunteer details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationId": "VOL-XXXXXX",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "skills": ["string"],
    "status": "pending_review",
    "backgroundCheckStatus": "pending",
    "createdAt": "ISO-8601 timestamp"
  }
}
```

---

### PUT /volunteers/{id}
**Description:** Update volunteer (admin only)

**Request:**
```json
{
  "status": "approved|rejected",
  "backgroundCheckStatus": "approved|rejected",
  "notes": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated volunteer */ },
  "message": "Volunteer record updated successfully"
}
```

---

## 4. Newsletter Management

### POST /newsletter/subscribe
**Description:** Subscribe to newsletter

**Request:**
```json
{
  "email": "string",
  "name": "string",
  "languagePreference": "en|fr",
  "consentGiven": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "status": "active|unsubscribed",
    "subscribedAt": "ISO-8601 timestamp"
  },
  "message": "Successfully subscribed to newsletter"
}
```

---

### GET /newsletter/subscribers
**Description:** List newsletter subscribers (admin only)

**Query Parameters:**
```
?limit=50&offset=0&status=active
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "string",
      "status": "active",
      "subscribedAt": "ISO-8601 timestamp"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "pages": 10
  }
}
```

---

### POST /newsletter/unsubscribe
**Description:** Unsubscribe from newsletter

**Request:**
```json
{
  "email": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

---

## 5. Contact Management

### POST /contact
**Description:** Submit contact inquiry

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

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "inquiryId": "INQ-XXXXXX",
    "email": "string",
    "topic": "string",
    "status": "new|in_progress|responded|closed",
    "submittedAt": "ISO-8601 timestamp"
  },
  "message": "Your inquiry has been submitted successfully"
}
```

---

### GET /contact
**Description:** List contact inquiries (admin only)

**Query Parameters:**
```
?limit=20&offset=0&status=new&topic=membership&sortBy=submittedAt
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "inquiryId": "INQ-XXXXXX",
      "name": "string",
      "email": "string",
      "topic": "string",
      "status": "new",
      "submittedAt": "ISO-8601 timestamp"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "pages": 8
  }
}
```

---

### GET /contact/{id}
**Description:** Get contact inquiry details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "inquiryId": "INQ-XXXXXX",
    "name": "string",
    "email": "string",
    "phone": "string",
    "topic": "string",
    "message": "string",
    "status": "new",
    "notes": "string (admin notes)",
    "submittedAt": "ISO-8601 timestamp",
    "respondedAt": "ISO-8601 timestamp (null if not responded)"
  }
}
```

---

### PUT /contact/{id}
**Description:** Update contact inquiry status (admin only)

**Request:**
```json
{
  "status": "in_progress|responded|closed",
  "notes": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* updated inquiry */ },
  "message": "Contact inquiry updated successfully"
}
```

---

## 6. Event Management

### GET /events
**Description:** List events with filters

**Query Parameters:**
```
?limit=20&offset=0&type=upcoming|past&year=2025&sortBy=date&sortOrder=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "date": "ISO-8601 timestamp",
      "location": "string",
      "type": "conference|workshop|meeting|other",
      "description": "string",
      "imageUrl": "string (optional)",
      "capacity": "integer (optional)"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "pages": 3
  }
}
```

---

### GET /events/{id}
**Description:** Get event details

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "date": "ISO-8601 timestamp",
    "endDate": "ISO-8601 timestamp (optional)",
    "location": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "description": "string",
    "agenda": ["string"],
    "speakers": [
      {
        "name": "string",
        "title": "string",
        "bio": "string"
      }
    ],
    "capacity": "integer",
    "registrationUrl": "string (optional)",
    "imageUrl": "string",
    "type": "conference|workshop|meeting"
  }
}
```

---

### POST /events/{id}/register
**Description:** Register for an event

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "organization": "string (optional)",
  "dietaryRestrictions": "string (optional)",
  "specialNeeds": "string (optional)",
  "message": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "registrationId": "REG-XXXXXX",
    "eventId": "uuid",
    "firstName": "string",
    "email": "string",
    "status": "registered|cancelled",
    "registeredAt": "ISO-8601 timestamp"
  },
  "message": "Successfully registered for event"
}
```

---

### GET /events/{eventId}/registrations
**Description:** Get event registrations (admin only)

**Query Parameters:**
```
?limit=50&offset=0
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "string",
      "email": "string",
      "registeredAt": "ISO-8601 timestamp"
    }
  ],
  "pagination": {
    "total": 200,
    "limit": 50,
    "offset": 0,
    "pages": 4
  }
}
```

---

## 7. Donations (Recording After Payment)

Frontend processes all payments directly via:
- **Stripe** - Stripe.js with publishable key
- **PayPal** - PayPal SDK  
- **Coinbase** - Hosted payment link
- **Square** - Web Payments SDK

Backend only stores donation records AFTER successful payment.

### POST /v1/donations
**Purpose:** Record donation after frontend-processed payment

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

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "donation_uuid",
    "transactionId": "stripe_pi_xxxxx",
    "amount": 100.00,
    "status": "completed",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### GET /v1/donations
List all donations with pagination

**Response:**
```json
{
  "success": true,
  "data": [ /* donation records */ ],
  "pagination": { "total": 250, "limit": 20, "offset": 0 }
}
```

### GET /v1/donations/{id}
Get specific donation details

---

## 8. Data Retrieval (Read-Only APIs)

### GET /v1/data/leadership
Get leadership information (board members, advisers, ministry coordinations)

**Response:**
```json
{
  "success": true,
  "data": {
    "executiveBoard": [ /* leadership members */ ],
    "spiritualAdvisers": [ /* advisers */ ],
    "ministryCoordinations": [ /* coordinations */ ]
  }
}
```

### GET /v1/data/ministries
Get all ministries information

### GET /v1/data/resources
Get resources and quick links

### GET /v1/data/events
Get all events (upcoming and past)

### GET /v1/data/faq
Get all FAQs by category

### GET /v1/data/testimonials
Get member testimonials

---

## 9. Chatbot & Search (Optional Backend APIs)

These can be frontend-only or backend-optional depending on implementation:

### GET /v1/search
**Purpose:** Global search across content (optional - frontend can do client-side search)

**Query Parameters:**
```
?q=search_query&limit=20
```

---

## 10. Error Handling & Response Format

### Standard Response Format
```json
{
  "success": true|false,
  "data": { /* response data */ },
  "error": "string (only if success=false)",
  "pagination": { /* if applicable */ },
  "timestamp": "ISO-8601 timestamp"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## 11. API Requirements & Implementation Checklist

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "status": 403
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "status": 404
}
```

**422 Unprocessable Entity:**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    { "field": "phone", "message": "Phone must be 10 digits" }
  ],
  "status": 422
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "requestId": "uuid",
  "status": 500
}
```

---

## 13. Rate Limiting

All endpoints should implement rate limiting:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60,
  "status": 429
}
```

---

## 14. Security Requirements

### Required Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Authentication
- Implement JWT tokens for authenticated endpoints
- Tokens should expire after 24 hours
- Refresh tokens valid for 30 days
- All sensitive endpoints require authentication

### Data Validation
- Validate all input on server side
- Sanitize HTML inputs
- Validate email addresses
- Validate phone numbers (US format)
- Validate zip codes
- Check file uploads for malware

### CORS Policy
```
Access-Control-Allow-Origin: https://naacus.org
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## 15. Webhook Events

### Payment Webhook (for real-time payment updates)

**Payment Completed:**
```json
{
  "event": "payment.completed",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "paymentId": "string",
    "transactionId": "string",
    "amount": 50.00,
    "donorEmail": "string",
    "paymentMethod": "card|paypal|bank|crypto|cashapp"
  }
}
```

**Payment Failed:**
```json
{
  "event": "payment.failed",
  "timestamp": "ISO-8601 timestamp",
  "data": {
    "paymentId": "string",
    "amount": 50.00,
    "reason": "string (card declined, insufficient funds, etc.)"
  }
}
```

---

## 16. Implementation Checklist for Backend Team

- [ ] Set up API server with chosen framework (Node.js/Express, Python/Django, Java/Spring, etc.)
- [ ] Implement authentication (JWT)
- [ ] Implement all CRUD endpoints
- [ ] Add input validation
- [ ] Add error handling
- [ ] Implement rate limiting
- [ ] Add CORS support
- [ ] Set security headers
- [ ] Add logging
- [ ] Implement pagination
- [ ] Set up environment variables
- [ ] Implement caching (Redis for frequently accessed data)
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Set up automated backups
- [ ] Implement monitoring & alerting
- [ ] Load testing
- [ ] Security audit
- [ ] Deploy to staging
- [ ] Deploy to production

---

## 17. Frontend Integration Notes

The frontend expects:
- All responses with `success` boolean field
- Consistent error format with `error` string
- Pagination data with `total`, `limit`, `offset`, `pages`
- ISO-8601 timestamps throughout
- Proper HTTP status codes
- CORS headers allowing requests from frontend domain

---

## 18. Frontend-Backend Responsibilities

### What Frontend CAN Call Directly
✅ **Google Analytics 4** via gtag.js with property ID  
✅ **Stripe** via Stripe.js with publishable key  
✅ **PayPal** via PayPal SDK with client ID  
✅ **Coinbase Commerce** via hosted payment link  
✅ **Square** via Web Payments SDK with app ID  
✅ **Backend REST APIs** for business logic

### What Backend Handles Only
❌ **Dataverse Access** - service account only  
❌ **SharePoint Access** - service account only  
❌ **Email Delivery** - SendGrid, Azure Communication Services  
❌ **SMS/Notifications** - Twilio, Azure services  
❌ **Webhook Processing** - payment provider webhooks  
❌ **Payment Persistence** - storing donation records in Dataverse  

---

## 19. Security Checklist for Backend Implementation

### Credentials Management
- [ ] Store Dataverse credentials in Azure Key Vault
- [ ] Store SharePoint service account credentials in Key Vault
- [ ] Use managed identity where possible (App Service, Functions)
- [ ] Rotate credentials regularly
- [ ] Never log sensitive data
- [ ] Service accounts with minimal required permissions only

### API Security
- [ ] Implement request signing for sensitive operations
- [ ] Add request rate limiting per IP
- [ ] Add request size limits
- [ ] Validate all inputs server-side
- [ ] Never trust client-provided user IDs (verify with session)
- [ ] Implement CSRF tokens for POST requests

### Payment Security
- [ ] Frontend uses Stripe.js/PayPal SDK with publishable keys only
- [ ] Implement webhook signature verification for all payment processors
- [ ] Implement idempotency keys for payments
- [ ] Store donation records securely in Dataverse
- [ ] Use HTTPS only (enforce with HSTS headers)
- [ ] PCI DSS compliance when handling webhook data

### Data Protection
- [ ] All Dataverse calls through secure service account
- [ ] SharePoint documents retrieved via secure backend endpoints
- [ ] Encrypt sensitive data in transit and at rest
- [ ] Implement data access controls/permissions
- [ ] Log all data access for audit trail
- [ ] Implement data retention policies

### Monitoring & Logging
- [ ] Log all API calls (excluding credentials)
- [ ] Monitor for failed payment attempts
- [ ] Alert on multiple failed login attempts
- [ ] Track GA4 event volume and anomalies
- [ ] Monitor webhook delivery failures
- [ ] Set up error tracking (Sentry, Application Insights)

---

## 22. Environment Variables Required (Backend)

```bash
# Microsoft Azure / Dataverse
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx
DATAVERSE_ENVIRONMENT_URL=https://orgxxxxx.crm.dynamics.com
SHAREPOINT_SITE_URL=https://naacus.sharepoint.com/sites/naacus
SHAREPOINT_CLIENT_ID=xxx
SHAREPOINT_CLIENT_SECRET=xxx

# Email Service (Backend Only)
SENDGRID_API_KEY=xxxxx
SENDGRID_FROM_EMAIL=noreply@naacus.org

# JWT/Auth
JWT_SECRET=xxxxx (strong random string)
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=30d

# CORS
CORS_ORIGIN=https://naacus.org
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS

# Logging
LOG_LEVEL=info
SENTRY_DSN=xxxxx (for error tracking)

# Webhook Secrets (from payment processors)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_WEBHOOK_ID=xxxxx
COINBASE_WEBHOOK_SECRET=xxxxx
SQUARE_WEBHOOK_SIGNATURE_KEY=xxxxx

# Note: Frontend has these (NOT backend)
# - GA4_MEASUREMENT_ID (frontend only)
# - STRIPE_PUBLISHABLE_KEY (frontend only)
# - PAYPAL_CLIENT_ID (frontend only)
# - SQUARE_APP_ID (frontend only)
```

---

## 23. Example Backend Implementation Flow

### Donation Process Flow
```
Frontend User → DonationDialog
    ↓
Frontend collects card details via Stripe.js (NOT backend)
    ↓
Frontend calls Stripe API directly to create payment
    ↓
Frontend receives Stripe payment confirmation
    ↓
Frontend POST /donations (sends donation data to backend)
    ↓
Backend:
  1. Validates donation data
  2. Stores donation record in Dataverse
  3. Sends confirmation email (SendGrid)
  4. Returns success
    ↓
Frontend: Shows confirmation message
```

### Volunteer Application Flow
```
Frontend User → Volunteer form
    ↓
Frontend POST /volunteers/apply {form data}
    ↓
Backend:
  1. Validates form data
  2. Stores in Dataverse
  3. Sends confirmation email
  4. Returns success
    ↓
Frontend: Shows confirmation message
```

### Analytics Event Flow
```
Frontend User interacts with page
    ↓
Frontend sends to GA4 directly via gtag.js (NOT backend)
    ↓
GA4 records event with:
  - User properties (language, location)
  - Event data (action, label, value)
    ↓
Backend can retrieve GA4 reports separately if needed
```

---

## 24. Dataverse Schema Design

### Key Tables to Create in Dataverse

```
naacus_member
- id (GUID)
- member_id (Text, unique)
- first_name (Text)
- last_name (Text)
- email (Text, unique)
- phone (Text)
- status (Choice: active, pending, inactive)
- join_date (DateTime)
- created_on (DateTime, auto)
- modified_on (DateTime, auto)

naacus_donation
- id (GUID)
- transaction_id (Text, unique) // Optional - if tracked by frontend
- amount (Decimal)
- currency (Text)
- payment_method (Choice: card, paypal, bank, crypto, cashapp)
- payment_provider_transaction_id (Text) // Stripe/PayPal/etc ID
- status (Choice: completed, failed, refunded)
- donor_email (Text)
- donor_name (Text)
- donation_type (Choice: one-time, monthly)
- created_on (DateTime, auto)

naacus_contact
- id (GUID)
- inquiry_id (Text, unique)
- name (Text)
- email (Text)
- phone (Text, optional)
- topic (Choice: membership, volunteer, events, donation, partnership, feedback, other)
- subject (Text)
- message (Text)
- status (Choice: new, in_progress, responded, closed)
- notes (Text, optional)
- created_on (DateTime, auto)
- responded_on (DateTime, optional)

naacus_event
- id (GUID)
- title (Text)
- description (Text)
- date_start (DateTime)
- date_end (DateTime, optional)
- location (Text)
- address (Text, optional)
- city (Text)
- state (Text)
- country (Text)
- capacity (Integer, optional)
- registration_url (Text, optional)
- image_url (Text, optional)
- type (Choice: conference, workshop, meeting, other)
- created_on (DateTime, auto)
- modified_on (DateTime, auto)

naacus_volunteer_application
- id (GUID)
- application_id (Text, unique)
- first_name (Text)
- last_name (Text)
- email (Text)
- phone (Text)
- city (Text)
- state (Text)
- skills (Text) // JSON array
- interests (Text) // JSON array
- availability (Text) // JSON array
- status (Choice: pending_review, approved, rejected)
- background_check_status (Choice: pending, approved, rejected)
- created_on (DateTime, auto)
- submitted_on (DateTime)

naacus_newsletter_subscriber
- id (GUID)
- email (Text, unique)
- name (Text, optional)
- language_preference (Choice: en, fr)
- status (Choice: active, unsubscribed)
- subscribed_on (DateTime, auto)
```

---

**Last Updated:** December 2025  
**Version:** 2.0 (Microsoft Dataverse/SharePoint Architecture)  
**Status:** Ready for Implementation
