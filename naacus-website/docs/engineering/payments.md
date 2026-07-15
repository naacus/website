# Payment Integration Guide

> **Category:** 🔧 Engineering | **Audience:** Developers & IT Team
> **Last Updated:** July 15, 2026 | [← Docs Index](../readme.md)

---

## Table of Contents

1. [Payment Methods Overview](#payment-methods-overview)
2. [Stripe Integration](#stripe-integration)
3. [Non-Stripe Payment Methods](#non-stripe-payment-methods)
4. [NAACUS Membership Pricing](#naacus-membership-pricing)
5. [Donation Tracking & Analytics](#donation-tracking--analytics)
6. [Testing](#testing)
7. [Webhook Handling](#webhook-handling)
8. [Troubleshooting](#troubleshooting)
9. [Security & Production Checklist](#security--production-checklist)

---

## Payment Methods Overview

| Method | Provider | Integration Type | Status |
|--------|----------|-----------------|--------|
| Credit/Debit Cards | Stripe | Frontend (Stripe.js) | Live |
| PayPal | PayPal SDK | Frontend (direct) | UI Ready |
| Apple Pay / Google Pay | Stripe | Frontend (Stripe.js) | UI Ready |
| Bank Transfer | Manual | Instructions displayed | UI Ready |
| Cryptocurrency | Coinbase Commerce | Hosted payment link | UI Ready |
| Cash App | Square | Web Payments SDK | UI Ready |

**Architecture:** All payment providers are called directly from the frontend using publishable/client-side keys. The backend only stores donation records after successful payment.

---

## Stripe Integration

### Prerequisites

- Stripe account ([Create one here](https://stripe.com))
- Node.js 14+ (for backend webhook handling)

### Installation

**Frontend:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Backend (for webhooks):**
```bash
npm install stripe dotenv express
```

### Environment Variables

```env
# Frontend (publishable key only)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY

# Backend only (NEVER expose to frontend)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
FRONTEND_URL=http://localhost:3000

# Membership Price IDs
REACT_APP_STRIPE_PRODUCT_ID_INDIVIDUAL=prod_YOUR_INDIVIDUAL_ID
REACT_APP_STRIPE_PRICE_ID_INDIVIDUAL=price_YOUR_INDIVIDUAL_PRICE_ID
REACT_APP_STRIPE_PRODUCT_ID_GROUP_SMALL=prod_YOUR_GROUP_SMALL_ID
REACT_APP_STRIPE_PRICE_ID_GROUP_SMALL=price_YOUR_GROUP_SMALL_PRICE_ID
REACT_APP_STRIPE_PRODUCT_ID_GROUP_LARGE=prod_YOUR_GROUP_LARGE_ID
REACT_APP_STRIPE_PRICE_ID_GROUP_LARGE=price_YOUR_GROUP_LARGE_PRICE_ID
```

### Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy **Publishable Key** and **Secret Key**

### Creating Products & Prices

1. Go to **Products** in Stripe Dashboard
2. Create products for each membership tier
3. Create prices for each product
4. Copy **Price IDs** to your `.env`

### Frontend Setup

Add Stripe.js to `public/index.html`:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Using the StripeCheckout Component

```jsx
import StripeCheckout from './components/StripeCheckout';

// Individual Membership
<StripeCheckout planId="individual" />

// Group Membership (Small)
<StripeCheckout planId="group_small" />

// Group Membership (Large)
<StripeCheckout planId="group_large" />
```

### Using MembershipRegistration Component

```jsx
import MembershipRegistration from './components/MembershipRegistration';

export default function MembershipPage() {
  return <MembershipRegistration />;
}
```

Features: user info collection, membership type selection, plan selection with pricing, form validation, automatic Stripe checkout integration.

### Registration Data Flow

1. User fills registration form (name, email, phone, organization)
2. Data validated and stored in `sessionStorage`
3. On checkout, data sent to backend with Stripe session
4. Backend stores in Dataverse with `status: pending_payment`
5. Stripe webhook confirms payment → status updated

### Backend Stripe Routes

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { lookupKey, planId, email, firstName, lastName } = req.body;
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    metadata: { firstName, lastName },
    // ... session config
  });
  res.json({ sessionId: session.id });
});

// Webhook (raw body required)
app.post('/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  webhookHandler
);
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-checkout-session` | POST | Create Stripe checkout session |
| `/api/create-portal-session` | POST | Create customer billing portal |
| `/api/subscriptions/:id` | GET | Get subscription details |
| `/api/subscriptions/:id` | PUT | Update subscription plan |
| `/api/subscriptions/:id` | DELETE | Cancel subscription |
| `/api/webhooks/stripe` | POST | Handle Stripe webhook events |

---

## Non-Stripe Payment Methods

### Configuration

Edit `naacus-website/src/config/paymentConfig.js`:

```javascript
export const paymentConfig = {
  general: {
    apiBaseUrl: 'https://your-api.com',
    demoMode: true, // Set false in production
  },
  stripe: {
    enabled: true,
    publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  },
  bank: {
    enabled: true,
    accountDetails: 'Your bank details here',
  },
  crypto: {
    enabled: true,
    chargeId: 'your-coinbase-charge-id',
  },
  cashApp: {
    enabled: true,
    cashtag: '$YourCashTag',
  },
};
```

### Frontend Environment Variables

```bash
REACT_APP_PAYPAL_CLIENT_ID=xxxxx
REACT_APP_COINBASE_PUBLIC_KEY=xxxxx
REACT_APP_SQUARE_APP_ID=xxxxx
REACT_APP_SQUARE_LOCATION_ID=xxxxx
```

---

## NAACUS Membership Pricing

| Plan | Plan ID | Price | Billing |
|------|---------|-------|---------|
| Individual Membership | `individual` | $20.00 | Annual |
| Group Membership (2-100) | `group_small` | $200.00 | One-time |
| Group Membership (100+) | `group_large` | $300.00 | One-time |

---

## Donation Tracking & Analytics

Successful donations automatically:
- Send `purchase` event to GA4 via gtag.js
- Include amount, currency, and payment method
- Enable revenue tracking in GA4 Monetization reports

See [ga4_analytics.md](ga4_analytics.md) for analytics configuration.

---

## Testing

### Test Card Numbers

| Card Type | Number | Expiration | CVC |
|-----------|--------|------------|-----|
| Visa | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Visa (debit) | 4000 0566 5566 5556 | Any future date | Any 3 digits |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits |
| American Express | 3782 822463 10005 | Any future date | Any 4 digits |

### Test Scenarios

- **Successful payment**: Use any test card above
- **Declined payment**: Use `4000 0000 0000 0002`
- **Requires authentication**: Use `4000 0025 0000 3155`

### Local Testing

1. `npm start` → use demo mode (`demoMode: true`)
2. Use Stripe test cards in test mode
3. Check GA4 DebugView for purchase events

---

## Webhook Handling

### Setup in Stripe Dashboard

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `.env`

### Event Handlers

Implement handlers in your backend to:
- Create/update user records on `checkout.session.completed`
- Send confirmation emails on `invoice.payment_succeeded`
- Update membership status on subscription changes
- Log payment failures for monitoring

---

## Troubleshooting

### Stripe Not Loaded
Ensure Stripe.js is in `public/index.html`:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Failed to Create Checkout Session
- Check `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set
- Verify backend is running
- Confirm price IDs exist in Stripe Dashboard

### Webhook Events Not Received
- Verify endpoint is publicly accessible
- Check signing secret is correct
- Review webhook logs in Stripe Dashboard

### Invalid Price ID
- Go to Stripe Dashboard → Products → copy correct Price ID (`price_...`)

### Test Cards Not Working
- Ensure you're in test mode (check Dashboard top-left toggle)
- Use valid test card numbers from the table above

### Payment Button Disabled
- Check `paymentConfig.js` has valid settings
- Try demo mode (`demoMode: true`)

### No GA Tracking for Donations
- Confirm GA initialized (see [ga4_analytics.md](ga4_analytics.md))
- Check `paymentService` tracks on success

---

## Security & Production Checklist

### Security Best Practices
1. **Never expose Secret Key** — keep `STRIPE_SECRET_KEY` server-side only
2. **Use HTTPS** — always in production
3. **Validate webhook signatures** — always verify
4. **Store minimal data** — never store full card details
5. **Use environment variables** — never hardcode API keys
6. **Implement rate limiting** — protect API endpoints

### Production Checklist
- [ ] Update to live (production) Stripe keys
- [ ] Change `FRONTEND_URL` to production domain
- [ ] Set up webhook endpoint with production URL
- [ ] Enable webhook events in production
- [ ] Test with live cards
- [ ] Set up email notifications for payments
- [ ] Configure refund policies
- [ ] Set `demoMode: false` in paymentConfig.js
- [ ] Review security settings

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [PayPal Developer](https://developer.paypal.com)
- [Coinbase Commerce](https://commerce.coinbase.com/docs)

---

Last Updated: December 2025
