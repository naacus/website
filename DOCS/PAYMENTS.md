# Payment Integration

## Payment Methods Supported

- 💳 Stripe (credit/debit cards)
- 🏦 Bank transfers
- ₿ Cryptocurrency (Coinbase Commerce)
- 📲 Cash App

## Configuration

Edit `naacus-website/src/config/paymentConfig.js`:

```javascript
export const paymentConfig = {
  general: {
    apiBaseUrl: 'https://your-api.com', // Optional backend
    demoMode: true, // Set to false in production
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

## Donation Tracking

Successful donations automatically:
- ✅ Send `purchase` event to GA4
- ✅ Include amount, currency, payment method
- ✅ Enable revenue tracking in GA4 Monetization reports

## Testing

1. Local testing: `npm start` → Use demo mode
2. Stripe test cards: See Stripe dashboard
3. Check GA4 DebugView for purchase events

## Troubleshooting

**Payment button disabled?**
- Check config.js has valid settings
- Try demo mode (`demoMode: true`)

**No GA tracking for donations?**
- Confirm GA initialized (see GA4_SETUP.md)
- Check paymentService tracks on success
