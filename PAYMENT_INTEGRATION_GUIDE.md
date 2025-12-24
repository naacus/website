# Payment Integration Services Documentation

## Overview

The NAACUS website supports multiple payment methods for donations:
- **Credit/Debit Cards** (Stripe)
- **Apple Pay** (Stripe)
- **Google Pay** (Stripe)
- **PayPal**
- **Bank Transfer** (ACH, Wire, International)
- **Bitcoin & Cryptocurrency** (Coinbase Commerce or BitPay)

## Architecture

### Payment Service Stack

```
PaymentService (Aggregator)
├── StripePaymentService
│   ├── Card payments
│   ├── Apple Pay
│   └── Google Pay
├── PayPalPaymentService
├── BankTransferPaymentService
├── CryptoPaymentService
└── PaymentConfig
```

## File Structure

```
src/
├── config/
│   └── paymentConfig.js         # Centralized payment configuration
├── services/
│   ├── paymentService.js        # Payment service aggregator
│   ├── stripePaymentService.js  # Stripe integration
│   ├── paypalPaymentService.js  # PayPal integration
│   ├── bankTransferPaymentService.js  # Bank transfer integration
│   └── cryptoPaymentService.js  # Cryptocurrency integration
└── components/
    └── DonationDialog.js        # UI component (already exists)
```

## Environment Configuration

Create a `.env.local` file in the `naacus-website` directory with the following variables:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
REACT_APP_STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# PayPal Configuration
REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
REACT_APP_PAYPAL_ENV=sandbox  # or 'production'
REACT_APP_PAYPAL_WEBHOOK_ID=YOUR_WEBHOOK_ID_HERE

# Apple Pay Configuration
REACT_APP_APPLE_PAY_MERCHANT_ID=merchant.com.naacus

# Google Pay Configuration
REACT_APP_GOOGLE_PAY_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
REACT_APP_GOOGLE_PAY_ENV=TEST  # or 'PRODUCTION'

# Cryptocurrency Configuration
REACT_APP_CRYPTO_WEBHOOK_SECRET=YOUR_SECRET_HERE

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
```

## Service Usage Examples

### Basic Payment Processing

```javascript
import paymentService from '../services/paymentService';

// Initialize services on app load
await paymentService.initialize();

// Process a payment
const donationData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  amount: 100.00,
  message: 'Supporting NAACUS mission',
  phone: '1234567890',
};

try {
  const result = await paymentService.processPayment(donationData, 'card');
  console.log('Payment successful:', result);
} catch (error) {
  console.error('Payment failed:', error.message);
}
```

### Stripe Card Payment

```javascript
import stripePaymentService from '../services/stripePaymentService';

// Create payment intent
const intentData = await stripePaymentService.createPaymentIntent(donationData);

// Process payment with card element
const result = await stripePaymentService.processCardPayment(
  intentData.clientSecret,
  cardElement
);
```

### PayPal Integration

```javascript
import paypalPaymentService from '../services/paypalPaymentService';

// Create order
const orderId = await paypalPaymentService.createPayPalOrder(donationData);

// Render PayPal buttons
await paypalPaymentService.renderPayPalButtons(
  'paypal-container',
  donationData,
  (success) => console.log('Success:', success),
  (error) => console.error('Error:', error)
);

// Capture order
const captureResult = await paypalPaymentService.capturePayPalOrder(orderId);
```

### Bank Transfer

```javascript
import bankTransferPaymentService from '../services/bankTransferPaymentService';

// Create bank transfer request
const payment = await bankTransferPaymentService.createBankTransferPayment(donationData);

// Get bank details for donor
const details = await bankTransferPaymentService.getBankTransferDetails(payment.paymentId);

// Send instructions via email
await bankTransferPaymentService.emailTransferInstructions(
  payment.paymentId,
  donationData.email
);
```

### Cryptocurrency Payments

```javascript
import cryptoPaymentService from '../services/cryptoPaymentService';

// Create cryptocurrency charge
const charge = await cryptoPaymentService.createCharge(donationData);

// Get pricing and conversion rates
const rates = await cryptoPaymentService.getCryptoPricing('USD');

// Generate payment address
const address = await cryptoPaymentService.generatePaymentAddress(charge.id, 'BTC');

// Check charge status
const status = await cryptoPaymentService.getChargeStatus(charge.id);

// Verify payment on blockchain
const verification = await cryptoPaymentService.verifyPayment(
  charge.id,
  blockchainTxId
);
```

## Backend API Endpoints (Required)

The frontend services expect these backend endpoints to be available:

### Stripe Endpoints
```
POST   /api/v1/payments/stripe/create-intent
GET    /api/v1/payments/stripe/confirm/{paymentIntentId}
```

### PayPal Endpoints
```
POST   /api/v1/payments/paypal/create-order
POST   /api/v1/payments/paypal/capture-order
GET    /api/v1/payments/paypal/order/{orderId}
POST   /api/v1/payments/paypal/refund
```

### Bank Transfer Endpoints
```
POST   /api/v1/payments/bank-transfer/create
GET    /api/v1/payments/bank-transfer/{paymentId}
GET    /api/v1/payments/bank-transfer/verify/{paymentId}
GET    /api/v1/payments/bank-transfer/instructions/{paymentId}
POST   /api/v1/payments/bank-transfer/send-instructions
POST   /api/v1/payments/bank-transfer/cancel/{paymentId}
```

### Cryptocurrency Endpoints
```
POST   /api/v1/payments/crypto/create-charge
GET    /api/v1/payments/crypto/rates
GET    /api/v1/payments/crypto/address/{chargeId}
GET    /api/v1/payments/crypto/charge/{chargeId}
POST   /api/v1/payments/crypto/verify
GET    /api/v1/payments/crypto/fees
POST   /api/v1/payments/crypto/webhook
POST   /api/v1/payments/crypto/charge/{chargeId}/cancel
```

### General Payment Endpoints
```
POST   /api/v1/payments/send-confirmation
GET    /api/v1/payments/history/{email}
GET    /api/v1/payments/stats
GET    /api/v1/payments/status/{paymentId}
GET    /api/v1/payments/receipt/{donationId}
POST   /api/v1/analytics/donation
```

## Payment Method Details

### Credit/Debit Card (Stripe)
- **Processing Time:** Instant
- **Supported Cards:** Visa, Mastercard, American Express, Discover
- **3D Secure:** Automatic (PCI DSS compliant)
- **Refunds:** Full or partial refunds available within 90 days
- **Fees:** Standard Stripe processing fees

### Apple Pay
- **Processing Time:** Instant
- **Device Support:** iOS, macOS, iPadOS
- **Security:** Tokenized payments (card never visible)
- **Benefits:** One-click checkout, biometric authentication
- **Fees:** Same as card processing

### Google Pay
- **Processing Time:** Instant
- **Device Support:** Android, Web
- **Security:** Tokenized payments
- **Benefits:** One-click checkout, automatic payment method selection
- **Fees:** Same as card processing

### PayPal
- **Processing Time:** Instant
- **Account Requirements:** PayPal account
- **Security:** Buyer protection included
- **Benefits:** Low fraud rate, established trust
- **Refunds:** Full or partial refunds available
- **Fees:** PayPal processing fees

### Bank Transfer
- **ACH Transfer:** 1-3 business days (US only)
- **Wire Transfer:** Same day (US, CA, MX)
- **International:** 3-5 business days
- **Processing Fee:** Varies by transfer type
- **Limit:** Some banks have daily/monthly limits
- **Benefits:** Low fees for direct bank transfers

### Bitcoin & Cryptocurrency
- **Processing Time:** Varies by network (typically 10-30 minutes)
- **Supported Coins:** BTC, ETH, USDC, USDT, DOGE, LTC
- **Confirmation:** Automatic upon network confirmation
- **Security:** Blockchain-verified transactions
- **Benefits:** No chargebacks, global reach
- **Fees:** Network transaction fees apply
- **Volatility:** Price protection available for 15 minutes

## Error Handling

All payment services include comprehensive error handling:

```javascript
try {
  const result = await paymentService.processPayment(donationData, 'card');
} catch (error) {
  // Error will contain:
  // - error.message: Human-readable error message
  // - error.code: Error code (e.g., 'INVALID_AMOUNT')
  // - error.details: Additional error details
  
  switch (error.code) {
    case 'INVALID_AMOUNT':
      // Show amount validation error
      break;
    case 'PAYMENT_FAILED':
      // Show payment failure message
      break;
    case 'NETWORK_ERROR':
      // Show network error and retry option
      break;
    default:
      // Show generic error message
  }
}
```

## Security Considerations

1. **PCI DSS Compliance:** Never handle raw card data on frontend
2. **HTTPS Only:** All payment endpoints use HTTPS
3. **Token-based:** Card data is tokenized by payment processors
4. **Rate Limiting:** API endpoints implement rate limiting
5. **Webhook Verification:** All webhooks are cryptographically signed
6. **CORS:** Cross-origin requests properly configured
7. **Environment Variables:** Sensitive keys stored in environment variables

## Testing Credentials

### Stripe Test Mode
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
3D Secure: Any OTP
```

### PayPal Sandbox
```
Email: buyer@sandbox.paypal.com
Password: Test1234
```

### Bitcoin Testnet
```
Use testnet addresses (starting with 'm' or 'n')
Faucet: https://testnet-faucet.mempool.space/
```

## Integration with DonationDialog

The `DonationDialog` component already supports all payment methods. To integrate:

```javascript
import paymentService from '../services/paymentService';
import { DonationDialog } from '../components/DonationDialog';

export function App() {
  useEffect(() => {
    paymentService.initialize();
  }, []);

  return <DonationDialog />;
}
```

## Monitoring & Analytics

Track donations through the payment service:

```javascript
// Track donation event
await paymentService.trackDonation(donationData, 'card', 'success');

// Get donation statistics
const stats = await paymentService.getDonationStats('30d');
console.log(`Total: $${stats.total}, Count: ${stats.count}`);
```

## Webhook Handling (Backend)

Backend should handle webhooks from:

1. **Stripe:** `charge.succeeded`, `charge.failed`, `charge.refunded`
2. **PayPal:** `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`
3. **Cryptocurrency:** `charge.confirmed`, `charge.failed`

## Troubleshooting

### Stripe Not Loading
- Check `REACT_APP_STRIPE_PUBLIC_KEY` in `.env.local`
- Verify publishable key is in test mode if using sandbox

### PayPal Buttons Not Rendering
- Ensure `REACT_APP_PAYPAL_CLIENT_ID` is correct
- Wait for PayPal SDK to load before rendering buttons
- Check browser console for SDK loading errors

### Bank Transfer Details Not Displaying
- Verify backend `/api/v1/payments/bank-transfer/{id}` endpoint
- Check account masking function for formatting

### Crypto Payments Timing Out
- Increase timeout for blockchain confirmations
- Implement polling for payment status updates
- Add user feedback for pending confirmations

## Future Enhancements

1. Recurring/Subscription donations
2. Donation matching/pledge campaigns
3. In-kind donation tracking
4. Mobile wallet integration (Microsoft Wallet, Samsung Pay)
5. Buy now, pay later (BNPL) integration
6. Multi-currency support
7. Donation split between multiple charities
8. Anonymous donation option

## Support

For issues or questions:
1. Check the error messages in browser console
2. Review backend logs for API errors
3. Verify all environment variables are set correctly
4. Test with sandbox/test credentials first
5. Contact payment processor support for processor-specific issues

---

**Last Updated:** December 23, 2025  
**Version:** 1.0  
**Status:** Production Ready
