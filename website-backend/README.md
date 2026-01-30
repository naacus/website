# NAACUS Backend API

A Spring Boot backend API for the NAACUS website - Business Logic APIs only.

> **Note:** Content/data retrieval APIs are not needed. Static content is managed in SharePoint/Dataverse and consumed directly by the frontend.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Maven** for build management
- **Lombok** for reducing boilerplate code

## Project Structure

```
website-backend/
├── pom.xml
├── src/main/java/org/naacus/
│   ├── NaacusBackendApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── SecurityHeadersFilter.java
│   ├── controller/
│   │   ├── HealthController.java
│   │   ├── MembershipController.java      # /api/v1/memberships
│   │   ├── VolunteerController.java       # /api/v1/volunteers
│   │   ├── NewsletterController.java      # /api/v1/newsletter
│   │   ├── ContactController.java         # /api/v1/contact
│   │   ├── DonationController.java        # /api/v1/donations
│   │   └── EventManagementController.java # /api/v1/events/*/register
│   ├── data/                              # Mock data providers
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   └── model/
│       ├── dto/                           # Request/Response DTOs
│       └── ... (entity models)
└── src/main/resources/
    └── application.properties
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+

## Running the Application

```bash
cd website-backend
mvn clean install
mvn spring-boot:run
```

Server starts at `http://localhost:8080`

---

## API v1 Endpoints (Full Contract Implementation)

Base URL: `https://api.naacus.org/v1` (production) or `http://localhost:8080/api/v1` (local)

### Standard Response Format

```json
{
  "success": true|false,
  "data": { /* response data */ },
  "error": "string (only if success=false)",
  "pagination": { "total": 100, "limit": 10, "offset": 0, "hasMore": true },
  "timestamp": "ISO-8601 timestamp"
}
```

---

### Membership Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/memberships` | Create new membership |
| GET | `/api/v1/memberships` | List memberships (paginated) |
| GET | `/api/v1/memberships/{id}` | Get membership by ID |
| PUT | `/api/v1/memberships/{id}` | Update membership |
| DELETE | `/api/v1/memberships/{id}` | Delete membership |

**Query Parameters:** `?limit=10&offset=0&status=active&year=2024&sortBy=createdAt&sortOrder=desc`

---

### Volunteer Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/volunteers` | Submit volunteer application |
| GET | `/api/v1/volunteers` | List volunteers (admin) |
| GET | `/api/v1/volunteers/{id}` | Get volunteer details |
| PUT | `/api/v1/volunteers/{id}` | Update volunteer status (admin) |

**Query Parameters:** `?limit=10&offset=0&status=approved&sortBy=createdAt`

---

### Newsletter Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/v1/newsletter/subscribers` | List subscribers (admin) |
| POST | `/api/v1/newsletter/unsubscribe` | Unsubscribe from newsletter |

---

### Contact Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contact` | Submit contact inquiry |
| GET | `/api/v1/contact` | List inquiries (admin) |
| GET | `/api/v1/contact/{id}` | Get inquiry details |
| PUT | `/api/v1/contact/{id}` | Update inquiry status (admin) |

**Query Parameters:** `?limit=20&offset=0&status=new&topic=membership&sortBy=createdAt&sortOrder=desc`

---

### Event Registration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/events/{eventId}/register` | Register for event |
| GET | `/api/v1/events/{eventId}/registrations` | Get registrations (admin) |

> **Note:** Event content (list, details) is managed in SharePoint/Dataverse.

---

### Donations (Recording After Payment)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/donations` | Record donation after payment |
| GET | `/api/v1/donations` | List donations (admin) |
| GET | `/api/v1/donations/{id}` | Get donation details |

**Note:** Frontend processes payments directly via Stripe/PayPal/Coinbase. Backend only stores records.

---

## Testing

```bash
# Health check
curl http://localhost:8080/api/health

# API Info
curl http://localhost:8080/api/v1

# Create membership
curl -X POST http://localhost:8080/api/v1/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "membershipType": "individual",
    "amountPaid": 50.00
  }'

# List memberships
curl "http://localhost:8080/api/v1/memberships?status=active&limit=10"

# Subscribe to newsletter
curl -X POST http://localhost:8080/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "subscriber@example.com", "name": "John"}'

# Submit contact
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "topic": "membership",
    "subject": "Membership Question",
    "message": "How do I renew?"
  }'

# Register for event
curl -X POST http://localhost:8080/api/v1/events/event-001/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "attendees": 2
  }'
```

---

## Configuration

Edit `src/main/resources/application.properties`:

```properties
server.port=8080
app.cors.allowed-origins=http://localhost:3000,https://naacus.org
jwt.secret=${JWT_SECRET:your-secret-key}
```

## Security Headers (Implemented)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## Architecture Notes

### Frontend-Callable Services (NO Backend Needed)
- ✅ Google Analytics 4 via gtag.js
- ✅ Stripe via Stripe.js
- ✅ PayPal via PayPal SDK
- ✅ Coinbase Commerce via hosted link
- ✅ Square via Web Payments SDK

### Backend-Only Services
- ✅ Microsoft Dataverse access
- ✅ SharePoint access
- ✅ Email delivery (SendGrid)
- ✅ Business logic APIs

---

## Next Steps for Production

- [ ] Implement JWT authentication
- [ ] Connect to Microsoft Dataverse
- [ ] Connect to SharePoint
- [ ] Set up SendGrid for email
- [ ] Add rate limiting
- [ ] Add Redis caching
- [ ] Deploy to Azure App Service
