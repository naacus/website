# Payment Services Architecture & Error Resolution

## System Architecture

```
DonationDialog.js (Component)
    ↓
    └─→ paymentService.js (Aggregator)
            ↓
            ├─→ stripePaymentService ✅ (Works with test key)
            ├─→ paypalPaymentService ❌ (Needs valid Client ID)
            ├─→ cashAppPaymentService ❌ (Needs Square credentials)
            ├─→ cryptoPaymentService ❌ (Network/DNS issue)
            └─→ bankTransferPaymentService ✅ (No SDK needed)
```

---

## Error Flow Diagram

```
Application Start
    ↓
DonationDialog mounts
    ↓
paymentService.initialize() [Promise.allSettled]
    ↓
    ├─── Stripe ──→ Script loads ──→ Valid test key ✅
    ├─── PayPal ──→ Script request ──→ 400 Bad Request (invalid client_id) ❌
    ├─── Square ──→ Script loads ──→ SDK initializes ──→ Invalid App ID error ❌
    ├─── Crypto ──→ Script request ──→ DNS Failure (ERR_NAME_NOT_RESOLVED) ❌
    └─── Bank ──→ No SDK needed ✅
    
All errors logged to console
App continues running ✅
Only working services available for donations
```

---

## Configuration Hierarchy

```
Environment Variables (.env)
        ↓
        │
        └─→ paymentConfig.js
                ↓
                ├─→ Uses env values OR fallback placeholders
                │
                └─→ Payment Services
                    ├─→ stripePaymentService
                    ├─→ paypalPaymentService
                    ├─→ cashAppPaymentService
                    ├─→ cryptoPaymentService
                    └─→ bankTransferPaymentService
```

**Key Issue:** Missing/invalid environment variables cause services to use placeholder values that fail validation.

---

## Error Root Causes

### 1. PayPal 400 Bad Request
```
Expected: 
  REACT_APP_PAYPAL_CLIENT_ID=REAL_CLIENT_ID

Current:
  REACT_APP_PAYPAL_CLIENT_ID=sandbox_client_id
  
Result:
  https://www.paypal.com/sdk/js?client-id=sandbox_client_id&...
  → PayPal API rejects as invalid format
  → HTTP 400 Bad Request
```

### 2. Square InvalidApplicationIdError
```
Expected:
  REACT_APP_SQUARE_APPLICATION_ID=sq_[real_id]

Current:
  REACT_APP_SQUARE_APPLICATION_ID=sq_app_example

Result:
  window.Square.payments('sq_app_example', 'location_id_example')
  → Square SDK validates ID format
  → Rejects because 'sq_app_example' is not real
  → Throws InvalidApplicationIdError
```

### 3. Coinbase DNS Failure
```
Script Load:
  <script src="https://js.coinbase.com/v1/checkout.js"></script>
  
Network Issue:
  → Cannot resolve hostname 'js.coinbase.com'
  → ERR_NAME_NOT_RESOLVED
  
Causes:
  - Network down
  - Firewall blocking
  - Coinbase service down
```

### 4. Stripe HTTPS Warning
```
Stripe Policy:
  - HTTP allowed: localhost development ✅
  - HTTP allowed: 127.0.0.1 ✅
  - HTTP blocked: Production domains ❌
  
Current:
  - Running on localhost ✅
  - Using test key ✅
  - Behavior: Warns but works ✅
```

---

## Resolution Priority Matrix

| Issue | Severity | Impact | Fix Time | Importance |
|-------|----------|--------|----------|------------|
| PayPal | 🔴 High | No payments | 5 min | 🔴 Critical |
| Square | 🟠 Medium | Optional payment | 5 min | 🟡 Optional |
| Coinbase | 🟠 Medium | Optional payment | 2-5 min | 🟡 Optional |
| Stripe | 🟢 Low | Dev warning only | 0 min | 🟢 N/A |

---

## Implementation Checklist

### Minimal Setup (Get Working)
```
[ ] 1. Visit PayPal Developer Dashboard
[ ] 2. Copy Sandbox Client ID
[ ] 3. Update .env file with Client ID
[ ] 4. Restart npm start
[ ] 5. Verify no PayPal errors in console
```

### Complete Setup (All Services)
```
[ ] 1. Setup PayPal (above)
[ ] 2. Setup Square account
[ ] 3. Setup Stripe account
[ ] 4. Setup Coinbase Commerce (optional)
[ ] 5. Update all .env variables
[ ] 6. Test each payment method
[ ] 7. Setup webhooks for production
```

### Disable Unused Services
```
[ ] 1. Edit paymentConfig.js
[ ] 2. Set enabled: false for unused services
[ ] 3. Restart dev server
[ ] 4. Verify errors gone
```

---

## Code Changes Needed

### Option 1: Add Valid Credentials (Recommended)

**File:** `naacus-website/.env`
```bash
# Get real values and update:
REACT_APP_PAYPAL_CLIENT_ID=YOUR_REAL_CLIENT_ID
REACT_APP_SQUARE_APPLICATION_ID=YOUR_REAL_APP_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_REAL_LOCATION_ID
```

### Option 2: Disable Services Programmatically

**File:** `naacus-website/src/config/paymentConfig.js`
```javascript
// Add enabled: false to services you don't want to initialize

paypal: {
  enabled: false,  // Add this
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sandbox_client_id',
  ...
},

cashApp: {
  enabled: false,  // Add this
  applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sq_app_example',
  ...
},

crypto: {
  enabled: false,  // Add this
  provider: 'coinbase',
  ...
},
```

### Option 3: Update Service Initialization Logic

**File:** `naacus-website/src/services/paymentService.js`
```javascript
// Add enabled check:
async initialize() {
  const results = await Promise.allSettled([
    paymentConfig.stripe?.enabled && stripePaymentService.initialize(),
    paymentConfig.paypal?.enabled && paypalPaymentService.initialize(),
    paymentConfig.crypto?.enabled && cryptoPaymentService.initialize(),
    paymentConfig.cashApp?.enabled && cashAppPaymentService.initialize(),
  ].filter(Boolean)); // Filter out false values
  
  // ... rest of code
}
```

---

## Testing Verification

### After Applying Fixes

```bash
# 1. Restart dev server
npm start

# 2. Open browser console (F12)
# 3. Look for these messages:

✅ EXPECTED (should NOT see these errors):
- ERR_ABORTED 400 PayPal errors
- InvalidApplicationIdError
- ERR_NAME_NOT_RESOLVED (if network is good)

⚠️ OK (expected warning):
- "You may test your Stripe.js integration over HTTP..."

✅ EXPECTED (to see):
- Payment methods initialized
- Donation dialog renders with available buttons
```

---

## Rollback Plan

If changes break something:

```bash
# 1. Restore original .env
git checkout naacus-website/.env

# 2. Or delete .env and rebuild
rm naacus-website/.env
npm start

# 3. Services will use placeholders but app still works
# (some payment methods won't be available)
```

---

## Related Files Reference

| File | Line | Issue | Fix |
|------|------|-------|-----|
| DonationDialog.js | 321 | Calls initPayments() | Provide credentials |
| paymentService.js | 30-47 | Promise.allSettled | Current design is good |
| paymentConfig.js | 8-103 | Placeholder values | Replace with real IDs |
| stripePaymentService.js | 35 | Stripe warning | Expected for localhost |
| paypalPaymentService.js | 19 | Invalid client ID | Update .env variable |
| cashAppPaymentService.js | 18 | Invalid app ID | Update .env variable |
| cryptoPaymentService.js | 22 | DNS resolution | Check network or disable |

---

## FAQ

**Q: Can the app work without these credentials?**
A: Yes! Bank transfer method works without any SDK. Other methods simply won't appear.

**Q: Will these errors break the app?**
A: No. Error handling uses `Promise.allSettled` which allows failures.

**Q: Do I need all payment methods?**
A: No. Disable ones you don't use in paymentConfig.js.

**Q: Can I use this in production with placeholders?**
A: No. Production requires real credentials and HTTPS.

**Q: Why does Stripe work but PayPal doesn't?**
A: Stripe test keys work. PayPal validates client ID format strictly.

**Q: How do I know which service is failing?**
A: Check browser console during startup. Each error identifies which service.

---

## Performance Impact

The current implementation:
- ✅ Uses `Promise.allSettled()` - doesn't block app
- ✅ Logs warnings only - no console errors blocking
- ✅ Graceful degradation - works with any available service
- ✅ Lazy loading - SDKs load when needed
- ✅ No impact on app startup time

---

## Security Notes

- ✅ Test keys are safe to share (prefixed with pk_test_, sk_test_)
- ✅ Public keys can be in .env (not secrets)
- ✅ Secret keys should NEVER be in .env (use backend only)
- ✅ Webhook secrets should be environment variables only
- ⚠️ DO NOT commit .env file to git

---

## Production Checklist

Before deploying to production:

- [ ] Switch to production API keys
- [ ] Set up HTTPS certificate
- [ ] Configure webhook endpoints
- [ ] Update .env with production values
- [ ] Test all payment methods in production
- [ ] Verify SSL certificate validity
- [ ] Setup payment processor accounts
- [ ] Test webhook deliveries
- [ ] Document credentials location
- [ ] Setup alerts for failed payments
