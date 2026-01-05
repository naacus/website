# Stripe Integration Guide

This guide explains how to integrate Stripe payments into your NAACUS website.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Frontend Setup](#frontend-setup)
5. [Backend Setup](#backend-setup)
6. [Using the StripeCheckout Component](#using-the-stripecheckout-component)
7. [Testing](#testing)
8. [Webhook Handling](#webhook-handling)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- Stripe account ([Create one here](https://stripe.com))
- Node.js 14+ (for backend)
- React 16.8+ (for frontend)
- npm or yarn package manager

## Installation

### Frontend Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Backend Dependencies

```bash
npm install stripe dotenv express
```

## NAACUS Membership Pricing

### Individual Membership
- **Price**: $20.00 per person
- **Billing Period**: Annual
- **Stripe Price ID**: `REACT_APP_STRIPE_PRICE_ID_INDIVIDUAL`

### Group Membership (2-100 Members)
- **Price**: $200.00 (one-time fee)
- **Members**: 2 to 100 people
- **Stripe Price ID**: `REACT_APP_STRIPE_PRICE_ID_GROUP_SMALL`

### Group Membership (100+ Members)
- **Price**: $300.00 (one-time fee)
- **Members**: 100+ people
- **Stripe Price ID**: `REACT_APP_STRIPE_PRICE_ID_GROUP_LARGE`

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Stripe Public Key (frontend)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY

# Stripe Secret Key (backend only - never expose to frontend)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Frontend URL (for checkout redirects)
FRONTEND_URL=http://localhost:3000

# API Base URL
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Individual Membership Price IDs
REACT_APP_STRIPE_PRODUCT_ID_INDIVIDUAL=prod_YOUR_INDIVIDUAL_ID
REACT_APP_STRIPE_PRICE_ID_INDIVIDUAL=price_YOUR_INDIVIDUAL_PRICE_ID

# Group Small (2-100) Price IDs
REACT_APP_STRIPE_PRODUCT_ID_GROUP_SMALL=prod_YOUR_GROUP_SMALL_ID
REACT_APP_STRIPE_PRICE_ID_GROUP_SMALL=price_YOUR_GROUP_SMALL_PRICE_ID

# Group Large (100+) Price IDs
REACT_APP_STRIPE_PRODUCT_ID_GROUP_LARGE=prod_YOUR_GROUP_LARGE_ID
REACT_APP_STRIPE_PRICE_ID_GROUP_LARGE=price_YOUR_GROUP_LARGE_PRICE_ID
```

### Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy your **Publishable Key** and **Secret Key**
4. Store them in your `.env` file

### Creating Products and Prices in Stripe

1. Go to **Products** in your Stripe Dashboard
2. Create products:
   - **Starter Plan** ($20/month)
   - **Premium Plan** ($50/month)
3. For each product, create prices
4. Copy the **Price IDs** and add them to `.env`

## Frontend Setup

### 1. Add Stripe Script to HTML

Add the Stripe.js library to your `public/index.html`:

```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2. Initialize Stripe in Your App

```jsx
import React, { useEffect } from 'react';
import StripeCheckout from './components/StripeCheckout';
import { initializeStripe } from './services/stripeService';

function App() {
  useEffect(() => {
    // Initialize Stripe when app loads
    initializeStripe().catch(err => console.error('Failed to initialize Stripe:', err));
  }, []);

  return (
    <div className="App">
      <StripeCheckout plan="Starter Plan" price={20} billingPeriod="month" />
    </div>
  );
}

export default App;
```

### 3. Using the MembershipRegistration Component

The `MembershipRegistration` component is a complete registration and payment flow:

```jsx
import MembershipRegistration from './components/MembershipRegistration';

export default function MembershipPage() {
  return (
    <div>
      <h1>Join NAACUS</h1>
      <MembershipRegistration />
    </div>
  );
}
```

**Features:**
- User information collection (name, email, phone)
- Membership type selection (Individual or Group)
- Organization details for group memberships
- Plan selection with pricing display
- Form validation
- Automatic integration with Stripe checkout

### 4. Using the StripeCheckout Component

The `StripeCheckout` component is a standalone payment form:

```jsx
<StripeCheckout planId="individual" />
<StripeCheckout planId="group_small" />
<StripeCheckout planId="group_large" />
```

**Component Props:**

```jsx
<StripeCheckout
  planId="individual"  // 'individual', 'group_small', or 'group_large'
/>
```

## Registration Form Data Flow

### Form Validation

The registration form validates:
- **First Name**: Required, non-empty
- **Last Name**: Required, non-empty
- **Email**: Required, valid email format
- **Phone**: Required, non-empty
- **Organization**: Required for group memberships
- **Member Count**: Required for group memberships, minimum 2
- **Terms Agreement**: Must be checked

### Data Storage

After validation, registration data is stored in browser sessionStorage:

```javascript
const membershipData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  organization: "ACME Corporation", // Group only
  organizationType: "individual" | "group",
  planId: "individual" | "group_small" | "group_large",
  groupMemberCount: "50", // Group only
  agreeTerms: true
};

// Retrieve in checkout:
const data = JSON.parse(sessionStorage.getItem('membershipData'));
```

### Backend Integration

When creating a checkout session, include registration data:

```javascript
// Frontend - MembershipRegistration component
const membershipData = JSON.parse(sessionStorage.getItem('membershipData'));
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lookupKey: plan.lookupKey,
    planId: plan.id,
    email: membershipData.email,
    firstName: membershipData.firstName,
    lastName: membershipData.lastName,
    organization: membershipData.organization,
  }),
});

// Backend (Express) - Example
app.post('/api/create-checkout-session', async (req, res) => {
  const { email, firstName, lastName, organization } = req.body;
  
  // Store registration data in Dataverse
  const registration = await dataverseClient.storeRegistration({
    firstName,
    lastName,
    email,
    organization,
    status: 'pending_payment'
  });

  // Create Stripe session with metadata
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    metadata: {
      registrationId: registration.id,
      firstName,
      lastName,
      organization,
    },
    // ... rest of session creation
  });

  res.json({ sessionId: session.id });
});
```

## Backend Setup

### 1. Install Stripe Package

```bash
npm install stripe dotenv express
```

### 2. Create Stripe API Routes

Copy the contents of `STRIPE_API_ENDPOINTS.js` to your Express app:

```javascript
const express = require('express');
const stripeRoutes = require('./routes/stripe');

const app = express();

app.use(express.json());

// Mount Stripe routes
app.use('/api', stripeRoutes);

// Webhook endpoint (must be unencrypted JSON)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### 3. Set Up Environment Variables

Create a `.env` file in your backend directory:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
FRONTEND_URL=http://localhost:3000
STRIPE_PRICE_ID_STARTER_MONTH=price_xxx
STRIPE_PRICE_ID_STARTER_YEAR=price_xxx
STRIPE_PRICE_ID_PREMIUM_MONTH=price_xxx
STRIPE_PRICE_ID_PREMIUM_YEAR=price_xxx
```

## Using the StripeCheckout Component

### Basic Example

```jsx
import StripeCheckout from './components/StripeCheckout';

export default function MembershipPage() {
  return (
    <div>
      <h1>NAACUS Membership</h1>
      {/* Individual Membership */}
      <StripeCheckout planId="individual" />
      
      {/* Group Membership (Small) */}
      <StripeCheckout planId="group_small" />
      
      {/* Group Membership (Large) */}
      <StripeCheckout planId="group_large" />
    </div>
  );
}
```

### Available Plan IDs

The component accepts a `planId` prop with the following values:

| Plan ID | Name | Price | Billing |
|---------|------|-------|---------|
| `individual` | Individual Membership | $20.00 | Annual |
| `group_small` | Group Membership (2-100) | $200.00 | One-time |
| `group_large` | Group Membership (100+) | $300.00 | One-time |

## Testing

### Test Card Numbers

Use these card numbers in test mode:

| Card Type | Number | Expiration | CVC |
|-----------|--------|------------|-----|
| Visa | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Visa (debit) | 4000 0566 5566 5556 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| American Express | 3782 822463 10005 | Any future date | Any 4 digits |

### Test Payment Scenarios

- **Successful payment**: Use any test card above
- **Declined payment**: Use card `4000 0000 0000 0002`
- **Requires authentication**: Use card `4000 0025 0000 3155`

## Webhook Handling

### Set Up Webhooks in Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add to `.env`

### Webhook Event Handlers

The `STRIPE_API_ENDPOINTS.js` file includes handlers for:

- **checkout.session.completed**: When a customer completes checkout
- **customer.subscription.created**: When a new subscription starts
- **customer.subscription.updated**: When a subscription is modified
- **customer.subscription.deleted**: When a subscription is canceled
- **invoice.payment_succeeded**: When payment is successfully collected
- **invoice.payment_failed**: When payment fails

Implement these handlers in your database to:
- Create/update user records
- Send confirmation emails
- Log payment events
- Update membership status

## API Endpoints

### Create Checkout Session

```
POST /api/create-checkout-session
Content-Type: application/json

{
  "lookupKey": "individual_membership_year",
  "planId": "individual",
  "planName": "Individual Membership",
  "amount": 2000,
  "billingPeriod": "year"
}

Response:
{
  "sessionId": "cs_test_...",
  "clientSecret": "..."
}
```

### Create Portal Session

```
POST /api/create-portal-session
Content-Type: application/json

{
  "sessionId": "cs_test_..."
}

Response:
{
  "url": "https://billing.stripe.com/...",
  "sessionId": "bps_..."
}
```

### Get Subscription Details

```
GET /api/subscriptions/:subscriptionId

Response:
{
  "id": "sub_...",
  "customerId": "cus_...",
  "status": "active",
  "currentPeriodStart": 1234567890,
  "currentPeriodEnd": 1234567890,
  "items": [...],
  "nextInvoiceDate": 1234567890
}
```

### Update Subscription

```
PUT /api/subscriptions/:subscriptionId
Content-Type: application/json

{
  "priceId": "price_..."
}
```

### Cancel Subscription

```
DELETE /api/subscriptions/:subscriptionId

Response:
{
  "id": "sub_...",
  "status": "canceled",
  "canceledAt": 1234567890
}
```

## Troubleshooting

### Issue: "Stripe is not loaded"

**Solution**: Ensure Stripe.js is loaded in your HTML:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Issue: "Failed to create checkout session"

**Possible causes**:
1. `REACT_APP_STRIPE_PUBLISHABLE_KEY` is not set
2. Backend is not running
3. Invalid price ID in environment variables

**Solution**: 
- Check all environment variables are set correctly
- Verify backend is running on correct port
- Confirm price IDs exist in Stripe Dashboard

### Issue: Webhook events not received

**Solution**:
1. Verify webhook endpoint is publicly accessible
2. Check webhook signing secret is correct
3. Review webhook logs in Stripe Dashboard
4. Ensure all required events are selected

### Issue: "Invalid priceId"

**Solution**:
- Go to Stripe Dashboard → Products
- Click on your product
- Copy the correct Price ID (starts with `price_`)
- Add to `.env` file

### Issue: Test cards not working

**Solution**:
1. Ensure you're in test mode (check Stripe Dashboard top-left)
2. Use valid test card numbers from the [Testing section](#testing)
3. Use any future expiration date
4. Use any CVC (3-4 digits)

## Security Best Practices

1. **Never expose Secret Key**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate webhook signatures**: Always verify webhook signatures
4. **Store minimal data**: Don't store full card details
5. **Use environment variables**: Never hardcode API keys
6. **Implement rate limiting**: Protect your API endpoints

## Production Checklist

- [ ] Update keys to live (production) keys
- [ ] Change `FRONTEND_URL` to production domain
- [ ] Set up webhook endpoint with production URL
- [ ] Enable webhook events in production
- [ ] Test with live cards
- [ ] Set up email notifications
- [ ] Configure refund policies
- [ ] Set up invoice email templates
- [ ] Enable customer portal customization
- [ ] Review security settings

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)

## Support

For issues or questions:
1. Check [Stripe Documentation](https://stripe.com/docs)
2. Review [Troubleshooting section](#troubleshooting)
3. Check your Stripe Dashboard logs
4. Contact Stripe Support

---

**Last Updated**: December 2024
**Version**: 1.0.0
