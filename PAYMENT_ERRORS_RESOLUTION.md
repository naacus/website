# Payment Integration Errors - Resolution Guide

## Overview
The application has multiple payment providers configured, but they are failing to initialize due to missing or placeholder API credentials. The errors are non-fatal (wrapped in `Promise.allSettled`), but some payment methods won't be available until properly configured.

## Errors Summary

| Error | Source | Cause | Severity |
|-------|--------|-------|----------|
| Stripe HTTPS Warning | `stripePaymentService.js` | Using HTTP in development; expected for localhost | ⚠️ Warning |
| Square Invalid Application ID | `cashAppPaymentService.js` | Using placeholder: `sq_app_example` | 🔴 Critical |
| Coinbase DNS Resolution Failure | `cryptoPaymentService.js` | SDK URL not resolvable; offline/blocked | 🔴 Critical |
| PayPal 400 Bad Request | `paypalPaymentService.js` | Using placeholder: `sandbox_client_id` | 🔴 Critical |

---

## Detailed Issue Breakdown

### 1. **Stripe Integration** ⚠️
**Error Message:**
```
You may test your Stripe.js integration over HTTP. However, live Stripe.js integrations must use HTTPS.
```

**Status:** ✅ Functional for local development

**Location:** [stripePaymentService.js](naacus-website/src/services/stripePaymentService.js#L35)

**Details:**
- Stripe intentionally warns about HTTP usage in development
- Uses placeholder key: `pk_test_example`
- **No action needed** for local testing; HTTPS required only for production

**For Production:**
```bash
# Set environment variable
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_YOUR_REAL_KEY
```

---

### 2. **Square/Cash App Integration** 🔴
**Error Message:**
```
InvalidApplicationIdError: The Payment 'applicationId' option is not in the correct format.
```

**Status:** ❌ Not functional

**Location:** [cashAppPaymentService.js](naacus-website/src/services/cashAppPaymentService.js#L18-L20)

**Root Cause:**
```javascript
// Current config (paymentConfig.js line 91)
cashApp: {
  applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sq_app_example',  // ❌ Invalid placeholder
  locationId: process.env.REACT_APP_SQUARE_LOCATION_ID || 'location_id_example',
  ...
}
```

**Solution:**
1. Get credentials from [Square Dashboard](https://developer.squareup.com/apps)
2. Set environment variables:
```bash
REACT_APP_SQUARE_APPLICATION_ID=sq_real_application_id
REACT_APP_SQUARE_LOCATION_ID=real_location_id
```

3. Alternatively, disable Cash App in [paymentConfig.js](naacus-website/src/config/paymentConfig.js#L89):
```javascript
cashApp: {
  enabled: false,  // Disable if not using
  ...
}
```

---

### 3. **Coinbase Crypto Integration** 🔴
**Error Messages:**
```
GET https://js.coinbase.com/v1/checkout.js net::ERR_NAME_NOT_RESOLVED
Coinbase Commerce SDK failed to load. Cryptocurrency payments may not be available.
```

**Status:** ❌ Not functional

**Location:** [cryptoPaymentService.js](naacus-website/src/services/cryptoPaymentService.js#L22)

**Root Cause:**
- DNS resolution failure for `js.coinbase.com`
- Typically caused by:
  - No internet connection
  - Firewall/network blocking Coinbase domain
  - Coinbase service temporarily unavailable

**Solutions:**

**Option A: Check Network Connectivity**
```bash
# Test connectivity
ping js.coinbase.com
curl -I https://js.coinbase.com/v1/checkout.js
```

**Option B: Disable Crypto Payments**
Edit [paymentConfig.js](naacus-website/src/config/paymentConfig.js#L82):
```javascript
crypto: {
  enabled: false,  // Disable crypto payments
  provider: 'coinbase',
  ...
}
```

**Option C: Use Alternative Provider**
Switch to BitPay in [paymentConfig.js](naacus-website/src/config/paymentConfig.js#L82):
```javascript
crypto: {
  provider: 'bitpay',  // Switch from 'coinbase' to 'bitpay'
  ...
}
```

---

### 4. **PayPal Integration** 🔴
**Error Messages:**
```
GET https://www.paypal.com/sdk/js?client-id=sandbox_client_id&... net::ERR_ABORTED 400 (Bad Request)
PayPal SDK failed to load. PayPal payments may not be available.
```

**Status:** ❌ Not functional

**Location:** [paypalPaymentService.js](naacus-website/src/services/paypalPaymentService.js#L19)

**Root Cause:**
```javascript
// Current config (paymentConfig.js line 20)
paypal: {
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sandbox_client_id',  // ❌ Invalid placeholder
  ...
}
```

PayPal SDK rejects the request with 400 error because `sandbox_client_id` is not a valid client ID format.

**Solution:**

1. **Get PayPal Credentials:**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com)
   - Create/access your app
   - Copy the **Client ID** (sandbox or production)

2. **Set Environment Variables:**
```bash
# For Sandbox (testing)
REACT_APP_PAYPAL_CLIENT_ID=sandbox_abc123def456
REACT_APP_PAYPAL_ENV=sandbox

# For Production
REACT_APP_PAYPAL_CLIENT_ID=production_abc123def456
REACT_APP_PAYPAL_ENV=production
```

3. **Verify in .env file:**
```env
REACT_APP_PAYPAL_CLIENT_ID=your_real_client_id
REACT_APP_PAYPAL_ENV=sandbox
```

4. **Restart Development Server:**
```bash
npm start
```

---

## Configuration File Locations

| File | Purpose |
|------|---------|
| [paymentConfig.js](naacus-website/src/config/paymentConfig.js) | Centralized payment configuration |
| [DonationDialog.js](naacus-website/src/components/DonationDialog.js#L321) | Component that initializes payment services |
| [paymentService.js](naacus-website/src/services/paymentService.js) | Payment service aggregator |
| [.env](naacus-website/.env) | Environment variables (create if needed) |

---

## Environment Variables Template

Create a `.env` file in `naacus-website/` directory:

```env
# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
REACT_APP_STRIPE_WEBHOOK_SECRET=whsec_test_your_secret

# PayPal
REACT_APP_PAYPAL_CLIENT_ID=your_client_id
REACT_APP_PAYPAL_ENV=sandbox
REACT_APP_PAYPAL_WEBHOOK_ID=your_webhook_id

# Square/Cash App
REACT_APP_SQUARE_APPLICATION_ID=sq_real_application_id
REACT_APP_SQUARE_LOCATION_ID=real_location_id
REACT_APP_SQUARE_WEBHOOK_SECRET=your_webhook_secret

# Apple Pay
REACT_APP_APPLE_PAY_MERCHANT_ID=merchant.com.naacus

# Google Pay
REACT_APP_GOOGLE_PAY_MERCHANT_ID=your_merchant_id
REACT_APP_GOOGLE_PAY_ENV=TEST

# Crypto
REACT_APP_CRYPTO_WEBHOOK_SECRET=your_webhook_secret

# API
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
```

---

## Quick Fix Steps

### To get a minimal working setup:

1. **PayPal (Quickest to set up):**
   ```bash
   # Add to naacus-website/.env
   REACT_APP_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
   REACT_APP_PAYPAL_ENV=sandbox
   ```

2. **Stripe (Already works for testing):**
   - Keep default `pk_test_example` for local dev
   - Works as-is for testing

3. **Disable problematic services temporarily:**
   - Edit [paymentConfig.js](naacus-website/src/config/paymentConfig.js)
   - Set `enabled: false` for Square and Crypto

---

## Testing Payment Methods

The application gracefully handles initialization failures:
- Uses `Promise.allSettled()` to allow partial failures
- Payment method buttons appear only for successfully initialized services
- Console warnings are informational, not blocking

**Current Status:**
- ✅ Stripe: Functional (test mode)
- ❌ PayPal: Requires real Client ID
- ❌ Square: Requires real credentials
- ❌ Crypto: Network/DNS issue
- ✅ Bank Transfer: Always available (no SDK required)

---

## Recommended Action Plan

1. **Immediate (Stop errors):**
   - Add `.env` file with valid PayPal Client ID
   - Restart development server

2. **Short-term (Enable more methods):**
   - Add Square credentials if using Cash App
   - Add Apple Pay merchant ID if supporting Apple Pay

3. **Future (Production setup):**
   - Switch to production API keys
   - Set up webhook endpoints
   - Enable HTTPS for all services

---

## Related Documentation

- [PAYMENT_INTEGRATION_GUIDE.md](../PAYMENT_INTEGRATION_GUIDE.md) - Full integration guide
- [Stripe Docs](https://stripe.com/docs)
- [PayPal Developer Docs](https://developer.paypal.com/docs)
- [Square Developer Docs](https://developer.squareup.com/docs)
- [Coinbase Commerce Docs](https://commerce.coinbase.com/docs)
