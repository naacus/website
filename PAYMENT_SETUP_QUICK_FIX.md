# Payment Services Fix Checklist

## Current Issues

Your application is showing 4 payment integration errors on startup. The good news: the error handling is working correctly—services fail gracefully without crashing the app.

### Error Status Overview

```
✅ WORKING:  Bank Transfer Service (no SDK required)
⚠️  WARNING: Stripe (works in dev, HTTPS required for prod)
❌ FAILED:   PayPal (invalid sandbox_client_id placeholder)
❌ FAILED:   Square/Cash App (invalid sq_app_example placeholder)
❌ FAILED:   Coinbase Crypto (DNS resolution failure)
```

---

## Fix Priority

### Priority 1: PayPal (CRITICAL) 🔴
**Why:** Single line fix to get a working payment provider

**Steps:**
1. Go to https://developer.paypal.com/dashboard/
2. Find your **Sandbox Client ID** (looks like `Axx...` or similar)
3. Open `naacus-website/.env`
4. Replace this line:
   ```bash
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
   ```
   With your actual ID:
   ```bash
   REACT_APP_PAYPAL_CLIENT_ID=Axx1234567890123456789012345
   ```
5. Save the file
6. Restart your dev server: `npm start`
7. ✅ PayPal errors should disappear

**Time to fix:** 5 minutes

---

### Priority 2: Square/Cash App (OPTIONAL) 🟠
**Why:** Only fix if you want to support Cash App donations

**Steps:**
1. Go to https://developer.squareup.com/apps/
2. Get your **Application ID** (starts with `sq_`)
3. Get your **Location ID** (numeric or GUID)
4. Open `naacus-website/.env`
5. Replace:
   ```bash
   REACT_APP_SQUARE_APPLICATION_ID=sq_app_your_application_id
   REACT_APP_SQUARE_LOCATION_ID=your_location_id
   ```
6. Restart dev server
7. ✅ Square errors should disappear

**Time to fix:** 5 minutes

**Alternative:** If you don't need Cash App, disable it in [paymentConfig.js](naacus-website/src/config/paymentConfig.js):
```javascript
// Line 89
cashApp: {
  enabled: false,  // Add this line
  applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sq_app_example',
  ...
}
```

---

### Priority 3: Coinbase Crypto (OPTIONAL) 🟠
**Why:** DNS error indicates network/connectivity issue

**Diagnosis:**
```bash
# Check if you can reach Coinbase
curl -I https://js.coinbase.com/v1/checkout.js

# Should return HTTP 200 or 301 (redirect)
# If you get "Could not resolve host", it's a network issue
```

**Options:**

**Option A: Check your network**
- Verify internet connection
- Check if firewall allows coinbase.com
- Try on a different network

**Option B: Disable Crypto (Recommended if not using)**
Edit [paymentConfig.js](naacus-website/src/config/paymentConfig.js) line 82:
```javascript
crypto: {
  enabled: false,  // Add this line
  provider: 'coinbase',
  ...
}
```

**Time to fix:** 2 minutes (disable) or troubleshoot network

---

### Priority 4: Stripe HTTPS Warning (INFO) 🟢
**Status:** ⚠️ This is NORMAL and EXPECTED

**Details:**
- Stripe intentionally warns about HTTP usage
- Localhost (`http://localhost:3000`) testing is fully supported
- ✅ No action needed for development
- ✅ Automatically works once deployed to HTTPS domain

**For Production:**
```bash
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_production_key
```

---

## Quick Fix Script

If you want to get everything working quickly, run these steps:

### Step 1: Get PayPal Client ID
```
1. Visit: https://developer.paypal.com/dashboard/
2. Log in with your account
3. Click on "Apps & Credentials" tab
4. Copy your "Sandbox Client ID"
```

### Step 2: Update .env file
```bash
# Edit naacus-website/.env
# Find this line:
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id

# Replace with your actual Client ID:
REACT_APP_PAYPAL_CLIENT_ID=YOUR_COPIED_CLIENT_ID_HERE
```

### Step 3: Restart dev server
```bash
cd naacus-website
npm start
```

### Step 4: Verify
- Open browser console (F12)
- Errors should be gone or reduced
- PayPal button should appear in Donation Dialog

---

## Detailed Documentation

For complete setup instructions, see: [PAYMENT_ERRORS_RESOLUTION.md](PAYMENT_ERRORS_RESOLUTION.md)

---

## File Locations

| File | What to do |
|------|-----------|
| [naacus-website/.env](naacus-website/.env) | Update with your credentials |
| [naacus-website/src/config/paymentConfig.js](naacus-website/src/config/paymentConfig.js) | Disable services you don't use |
| [naacus-website/src/components/DonationDialog.js](naacus-website/src/components/DonationDialog.js) | Component using payment services |
| [naacus-website/src/services/](naacus-website/src/services/) | Payment service implementations |

---

## Testing Checklist

After making changes:

- [ ] Restart dev server (`npm start`)
- [ ] Open browser console (F12 → Console tab)
- [ ] Check for payment-related errors
- [ ] Open Donation Dialog component
- [ ] Verify payment buttons appear
- [ ] Test with working payment method

---

## Support Resources

- **Stripe:** https://stripe.com/docs
- **PayPal:** https://developer.paypal.com/docs
- **Square:** https://developer.squareup.com/docs
- **Coinbase:** https://commerce.coinbase.com/docs

---

## Notes

- All errors are **non-blocking** - app continues to work
- Services fail gracefully with `Promise.allSettled()`
- Only initialized services are available for donations
- Bank Transfer is always available (no SDK required)
- You can test with mock data using Bank Transfer method

---

## Next Steps (Optional)

Once PayPal is working:

1. **Add Apple Pay** (requires merchant setup)
2. **Add Google Pay** (requires merchant ID)
3. **Enable webhooks** for production processing
4. **Switch to production credentials** when ready to go live
