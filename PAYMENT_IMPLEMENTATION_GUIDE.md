# Payment Services Implementation Examples

## Getting Started with Real Credentials

### Step 1: Obtain Credentials

#### PayPal (EASIEST - Start Here)
```
1. Go to: https://developer.paypal.com/dashboard/
2. Log in or create account
3. Navigate to "Apps & Credentials" tab
4. Under "Sandbox", find "Client ID"
5. Copy the value (looks like: AeqyzV8f7...)
```

#### Square (If using Cash App)
```
1. Go to: https://developer.squareup.com/apps/
2. Log in or create account
3. Click on your application
4. Find "Production" or "Sandbox" credentials
5. Copy Application ID (starts with sq_)
6. Copy Location ID
```

#### Stripe (Already working)
```
1. Go to: https://dashboard.stripe.com/apikeys
2. Log in or create account
3. Copy "Publishable key" (starts with pk_test_)
4. Already using test key - no action needed for dev
```

---

## Implementation Approaches

### Approach 1: Environment Variables (RECOMMENDED)

**File: `naacus-website/.env`**

Add or update these lines with your real credentials:

```bash
# ========== MINIMUM SETUP (Just PayPal) ==========
REACT_APP_PAYPAL_CLIENT_ID=AeqyzV8f7abc123def456ghi789jkl
REACT_APP_PAYPAL_ENV=sandbox

# ========== FULL SETUP ==========
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_abc123def456ghi789jkl
REACT_APP_PAYPAL_CLIENT_ID=AeqyzV8f7abc123def456ghi789jkl
REACT_APP_PAYPAL_ENV=sandbox
REACT_APP_SQUARE_APPLICATION_ID=sq_app_abc123def456ghi789jkl
REACT_APP_SQUARE_LOCATION_ID=L1234567890ABC
```

**Then restart:**
```bash
cd naacus-website
npm start
```

**Pros:**
- ✅ Recommended by React best practices
- ✅ Easy to switch between environments
- ✅ Secure (not in version control)
- ✅ Works with build tools

**Cons:**
- Requires restarting dev server
- Multiple files to maintain

---

### Approach 2: Hardcode in paymentConfig.js (QUICK TEST ONLY)

**File: `naacus-website/src/config/paymentConfig.js`**

```javascript
export const paymentConfig = {
  // Stripe Configuration
  stripe: {
    publishableKey: 'pk_test_abc123def456ghi789jkl',  // Replace with your test key
    // ... rest stays same
  },

  // PayPal Configuration
  paypal: {
    clientId: 'AeqyzV8f7abc123def456ghi789jkl',  // Replace with your Client ID
    environment: 'sandbox',
    // ... rest stays same
  },

  // Square Configuration
  cashApp: {
    applicationId: 'sq_app_abc123def456ghi789jkl',  // Replace with your App ID
    locationId: 'L1234567890ABC',  // Replace with your Location ID
    // ... rest stays same
  },

  // ... rest of config
};
```

**Pros:**
- ✅ Instant effect (no server restart)
- ✅ Good for testing
- ✅ Easy to verify which value is being used

**Cons:**
- ❌ NOT secure for production
- ❌ Credentials in source code
- ❌ Easy to accidentally commit secrets
- ❌ Different setup for each developer

**⚠️ WARNING:** Only use this for local testing. Always use .env for real work.

---

### Approach 3: Disable Unused Services

If you don't need certain payment methods, disable them to eliminate errors:

**File: `naacus-website/src/config/paymentConfig.js`**

Find the services you don't want and set `enabled: false`:

```javascript
export const paymentConfig = {
  // ... other config ...

  // Bank Transfer Configuration
  bankTransfer: {
    enabled: true,  // Keep this - works without SDK
    // ...
  },

  // Bitcoin/Crypto Configuration
  crypto: {
    enabled: false,  // Disable if not using crypto
    provider: 'coinbase',
    // ...
  },

  // Cash App Configuration (Square)
  cashApp: {
    enabled: false,  // Disable if not using Cash App
    applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sq_app_example',
    // ...
  },
};
```

Then update payment service initialization to respect the `enabled` flag:

**File: `naacus-website/src/services/paymentService.js`**

```javascript
async initialize() {
  if (this.initialized) return;

  try {
    const results = await Promise.allSettled([
      paymentConfig.stripe?.enabled !== false && stripePaymentService.initialize(),
      paymentConfig.paypal?.enabled !== false && paypalPaymentService.initialize(),
      paymentConfig.crypto?.enabled !== false && cryptoPaymentService.initialize(),
      paymentConfig.cashApp?.enabled !== false && cashAppPaymentService.initialize(),
    ].filter(v => v)); // Remove false values

    // ... rest of code
  }
}
```

**Pros:**
- ✅ Simple - just set enabled: false
- ✅ No environment variables needed
- ✅ Works immediately
- ✅ Good for testing

**Cons:**
- Requires code change
- Have to modify multiple files

---

## Complete Working Examples

### Example 1: PayPal Only (Minimal)

```bash
# File: naacus-website/.env
REACT_APP_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
REACT_APP_PAYPAL_ENV=sandbox
```

This alone will:
- ✅ Fix PayPal 400 error
- ✅ Make PayPal button available
- ✅ Bank transfer still works
- ❌ Square and Crypto will still error (but not block app)

---

### Example 2: PayPal + Square

```bash
# File: naacus-website/.env
REACT_APP_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
REACT_APP_PAYPAL_ENV=sandbox
REACT_APP_SQUARE_APPLICATION_ID=sq_YOUR_APP_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_LOCATION_ID
```

This enables:
- ✅ PayPal payments
- ✅ Cash App payments
- ✅ Bank transfer
- ❌ Crypto will still error (but disabled)

---

### Example 3: Full Setup (All Services)

```bash
# File: naacus-website/.env

# STRIPE
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY

# PAYPAL
REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_PAYPAL_ENV=sandbox

# SQUARE
REACT_APP_SQUARE_APPLICATION_ID=sq_YOUR_APP_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_LOCATION_ID

# APPLE PAY
REACT_APP_APPLE_PAY_MERCHANT_ID=merchant.com.naacus

# GOOGLE PAY
REACT_APP_GOOGLE_PAY_MERCHANT_ID=YOUR_MERCHANT_ID
REACT_APP_GOOGLE_PAY_ENV=TEST

# CRYPTO
REACT_APP_CRYPTO_WEBHOOK_SECRET=YOUR_SECRET
```

This enables:
- ✅ Stripe credit/debit card
- ✅ Apple Pay
- ✅ Google Pay
- ✅ PayPal
- ✅ Cash App
- ✅ Crypto (if network available)
- ✅ Bank transfer

---

## Common Configuration Patterns

### Pattern 1: Quick Development Setup

```bash
# Just get basic payments working
REACT_APP_PAYPAL_CLIENT_ID=YOUR_SANDBOX_ID
REACT_APP_PAYPAL_ENV=sandbox
```

Result:
- 🟢 PayPal works
- 🟢 Bank transfer works
- 🟡 Others disabled or not working
- ✅ Good for testing core functionality

---

### Pattern 2: Full Feature Testing

```bash
# Test all payment methods before production
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
REACT_APP_PAYPAL_CLIENT_ID=YOUR_SANDBOX_ID
REACT_APP_PAYPAL_ENV=sandbox
REACT_APP_SQUARE_APPLICATION_ID=sq_YOUR_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_LOCATION_ID
```

Result:
- 🟢 All major payment methods work
- 🟡 Crypto might fail (network dependent)
- ✅ Good for QA testing

---

### Pattern 3: Production Deployment

```bash
# Switch all keys to production
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_YOUR_PROD_KEY
REACT_APP_PAYPAL_CLIENT_ID=YOUR_PROD_CLIENT_ID
REACT_APP_PAYPAL_ENV=production
REACT_APP_SQUARE_APPLICATION_ID=sq_prod_YOUR_ID
REACT_APP_SQUARE_LOCATION_ID=YOUR_PROD_LOCATION
```

Result:
- 🟢 Real money accepted
- ✅ Ready for customers

---

## Verification Code

After setting up credentials, use this code to verify:

**File: `naacus-website/src/services/paymentService.js`**

Add this verification function:

```javascript
/**
 * Verify payment configuration
 * Call this after initialize() to check which services are ready
 */
verifyConfiguration() {
  const status = {
    stripe: this.services.card?.stripe ? '✅ Ready' : '❌ Not loaded',
    paypal: this.services.paypal?.initialized ? '✅ Ready' : '❌ Not loaded',
    cashapp: this.services.cashapp?.squarePayments ? '✅ Ready' : '❌ Not loaded',
    crypto: this.services.crypto?.initialized ? '✅ Ready' : '❌ Not loaded',
    bank: '✅ Always available',
  };
  
  console.table(status);
  return status;
}
```

Then in your component:

```javascript
useEffect(() => {
  const initPayments = async () => {
    await paymentService.initialize();
    paymentService.verifyConfiguration();  // Add this line
    // ... rest of code
  };
  
  if (open) {
    initPayments();
  }
}, [open]);
```

This will log a table showing which services are ready.

---

## Troubleshooting During Setup

### Issue: "ENOENT: no such file or directory, open '.env'"
**Solution:**
```bash
cd naacus-website
touch .env
# Then add your variables
```

### Issue: Changes to .env not taking effect
**Solution:**
```bash
# Kill the dev server (Ctrl+C)
# Wait 2 seconds
npm start
# It will rebuild with new env vars
```

### Issue: Variables showing as "undefined"
**Solution:**
```bash
# Check that variables start with REACT_APP_
# ❌ Wrong: PAYPAL_CLIENT_ID
# ✅ Correct: REACT_APP_PAYPAL_CLIENT_ID

# Restart server after fixing
```

### Issue: Still getting errors after adding credentials
**Solution:**
```bash
# 1. Verify .env is in naacus-website directory (not root)
ls naacus-website/.env

# 2. Restart dev server
npm start

# 3. Check browser console for exact error
# 4. Compare error with credentials format
```

---

## Security Best Practices

✅ **DO:**
- Store credentials in .env files
- Add .env to .gitignore
- Use test keys for development
- Use production keys only on production servers
- Rotate keys regularly
- Keep webhook secrets secure

❌ **DON'T:**
- Commit .env to git
- Share credentials via email or chat
- Use production keys in development
- Hardcode secrets in source code
- Log credentials to console (in production)

---

## Testing Your Setup

### Test 1: Verify Environment Variables Are Loaded

```javascript
// In browser console
console.log(process.env.REACT_APP_PAYPAL_CLIENT_ID);
// Should print your actual Client ID, not undefined
```

### Test 2: Check Payment Service Status

```javascript
// In DonationDialog or any component using paymentService
import paymentService from '../services/paymentService';

console.log('Supported methods:', paymentService.getSupportedPaymentMethods());
```

### Test 3: Monitor SDK Loading

Open DevTools Network tab → Filter by `paypal.com` or `stripe.com` or `squarecdn.com`

Look for:
- ✅ Status 200 = SDK loaded successfully
- ❌ Status 400+ = SDK failed to load

---

## Next Steps After Setup

1. **Test each payment method** in the donation dialog
2. **Setup webhooks** for production processing
3. **Configure backend** to handle payment events
4. **Test with sandbox credentials** thoroughly
5. **Switch to production keys** when ready
6. **Monitor payment processing** in production

---

## Reference: Credential Formats

```
Stripe test key:        pk_test_51Hs6SIBVD...
Stripe production key:  pk_live_51Hs6SIBVD...

PayPal sandbox Client:  AeqyzV8f7Wx2qM6L8N0PqRs9tUvWxYzAbCdEfG...
PayPal production:      A similar format but different hash

Square App ID:          sq_app_y2qM6L8N0PqRsT9wXyZaBc...
Square Location ID:     L1234567890ABCDEF (alphanumeric)
```

---

## Getting Help

If something isn't working:

1. Check the error message in browser console
2. Verify credential format matches expected pattern
3. Confirm .env file exists in `naacus-website/` directory
4. Restart dev server
5. Check that variable names start with `REACT_APP_`
6. Visit the relevant payment provider's documentation
7. Review the main guides:
   - [PAYMENT_ERRORS_RESOLUTION.md](PAYMENT_ERRORS_RESOLUTION.md)
   - [PAYMENT_SETUP_QUICK_FIX.md](PAYMENT_SETUP_QUICK_FIX.md)
