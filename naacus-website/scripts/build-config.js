#!/bin/bash
# scripts/build-config.js
# Builds runtime configuration from environment variables

const fs = require('fs');
const path = require('path');

console.log('🔨 Building runtime configuration...');

// Template configuration
const configTemplate = {
  stripe: {
    publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
    buyButtonId: process.env.REACT_APP_STRIPE_BUY_BUTTON_ID || '',
  },
  paypal: {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || '',
    environment: process.env.REACT_APP_PAYPAL_ENV || 'sandbox',
  },
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001',
    debugPayments: process.env.REACT_APP_DEBUG_PAYMENTS === 'true',
  },
  square: {
    applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || '',
    locationId: process.env.REACT_APP_SQUARE_LOCATION_ID || '',
  },
  features: {
    enableDonations: process.env.REACT_APP_ENABLE_DONATIONS !== 'false',
    enablePayments: process.env.REACT_APP_ENABLE_PAYMENTS !== 'false',
  },
  environment: process.env.NODE_ENV || 'development',
  buildTime: new Date().toISOString(),
};

// Validate required production secrets
if (process.env.NODE_ENV === 'production') {
  const requiredSecrets = [
    'REACT_APP_STRIPE_PUBLIC_KEY',
    'REACT_APP_STRIPE_BUY_BUTTON_ID',
  ];

  const missing = requiredSecrets.filter(
    (secret) => !process.env[secret] || process.env[secret].includes('your_')
  );

  if (missing.length > 0) {
    console.error(
      '❌ Production requires these secrets to be set:',
      missing.join(', ')
    );
    process.exit(1);
  }
}

// Write config file
const configPath = path.join(__dirname, '../public/config.json');
fs.writeFileSync(configPath, JSON.stringify(configTemplate, null, 2));

console.log(`✓ Config written to: ${configPath}`);
console.log(`✓ Environment: ${configTemplate.environment}`);
console.log(`✓ Build time: ${configTemplate.buildTime}`);
