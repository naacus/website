/**
 * Payment Configuration
 * Centralized configuration for all payment processors and integrations
 */

export const paymentConfig = {
  // Stripe Configuration
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_example',
    buyButtonId: process.env.REACT_APP_STRIPE_BUY_BUTTON_ID || 'buy_btn_example',
    apiVersion: '2023-10-16',
    locale: 'en',
    features: {
      creditDebit: true,
      applePay: true,
      googlePay: true,
    },
  },

  // Apple Pay Configuration
  applePay: {
    merchantId: process.env.REACT_APP_APPLE_PAY_MERCHANT_ID || 'merchant.com.naacus',
    displayName: 'NAACUS',
    countryCode: 'US',
    currencyCode: 'USD',
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
  },

  // Google Pay Configuration
  googlePay: {
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantId: process.env.REACT_APP_GOOGLE_PAY_MERCHANT_ID || '12345678901234567890',
    merchantName: 'NAACUS',
    environment: process.env.REACT_APP_GOOGLE_PAY_ENV || 'TEST', // 'TEST' or 'PRODUCTION'
    gatewayId: 'stripe',
    gatewayMerchantId: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_example',
  },

  // Bank Transfer Configuration
  bankTransfer: {
    enabled: true,
    currency: 'USD',
    countries: ['US', 'CA', 'GB', 'EU'],
    processingTime: '3-5 business days',
  },

  // Bitcoin/Crypto Configuration
  crypto: {
    enabled: true,
    provider: 'coinbase', // or 'bitpay'
    acceptedCurrencies: ['BTC', 'ETH', 'USDC'],
    confirmationRequired: 1,
    webhookSecret: process.env.REACT_APP_CRYPTO_WEBHOOK_SECRET || '',
  },

  // Cash App Configuration (Square)
  cashApp: {
    applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'sq_app_example',
    locationId: process.env.REACT_APP_SQUARE_LOCATION_ID || 'location_id_example',
    enabled: true,
    currency: 'USD',
    supportedCountries: ['US'],
  },

  // General Configuration
  general: {
    currency: 'USD',
    locale: 'en-US',
    timeZone: 'America/New_York',
    minAmount: 1,
    maxAmount: 999999.99,
    // Use environment variable if set, otherwise empty string (triggers demo mode)
    // Set REACT_APP_API_BASE_URL=http://localhost:3001/api/v1 to use backend
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
    // Payment processing mode - set to true when ready to go live
    // When false, all payment submissions will succeed without actual processing
    liveMode: false,
  },

  // Webhook Configuration
  webhooks: {
    stripe: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET || '',
    crypto: process.env.REACT_APP_CRYPTO_WEBHOOK_SECRET || '',
    square: process.env.REACT_APP_SQUARE_WEBHOOK_SECRET || '',
  },

  // Error Handling
  errors: {
    invalidAmount: 'Please enter a valid donation amount',
    invalidEmail: 'Please enter a valid email address',
    paymentFailed: 'Payment processing failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    timeout: 'Payment request timed out. Please try again.',
  },
};

export default paymentConfig;
