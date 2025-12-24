/**
 * Cryptocurrency Payment Service
 * Handles Bitcoin and other cryptocurrency donations
 */

import paymentConfig from '../config/paymentConfig';

class CryptoPaymentService {
  constructor() {
    this.initialized = false;
    this.provider = paymentConfig.crypto.provider; // 'coinbase' or 'bitpay'
  }

  /**
   * Initialize cryptocurrency payment provider
   */
  async initialize() {
    if (this.initialized) return;

    try {
      if (this.provider === 'coinbase') {
        const script = document.createElement('script');
        script.src = 'https://js.coinbase.com/v1/checkout.js';
        script.async = true;
        script.onerror = () => {
          throw new Error('Failed to load Coinbase Commerce SDK');
        };
        document.head.appendChild(script);
      } else if (this.provider === 'bitpay') {
        // BitPay SDK initialization if needed
      }
      this.initialized = true;
    } catch (error) {
      console.error('Crypto payment initialization error:', error);
      throw error;
    }
  }

  /**
   * Create cryptocurrency payment charge
   */
  async createCharge(donationData) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/create-charge`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationData.amount.toFixed(2),
            currency: paymentConfig.general.currency,
            email: donationData.email,
            name: donationData.fullName,
            description: donationData.message || 'NAACUS Donation',
            metadata: {
              donorName: donationData.fullName,
              donorEmail: donationData.email,
              message: donationData.message,
            },
            provider: this.provider,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create crypto charge');
      return await response.json();
    } catch (error) {
      console.error('Crypto charge creation error:', error);
      throw error;
    }
  }

  /**
   * Get cryptocurrency pricing and conversion rates
   */
  async getCryptoPricing(currency = 'USD') {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/rates?currency=${currency}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch crypto rates');
      return await response.json();
    } catch (error) {
      console.error('Get crypto rates error:', error);
      throw error;
    }
  }

  /**
   * Generate payment address for cryptocurrency transfer
   */
  async generatePaymentAddress(chargeId, cryptoType = 'BTC') {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/address/${chargeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to generate payment address');
      return await response.json();
    } catch (error) {
      console.error('Generate address error:', error);
      throw error;
    }
  }

  /**
   * Get charge status and payment details
   */
  async getChargeStatus(chargeId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/charge/${chargeId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch charge status');
      const data = await response.json();
      
      return {
        chargeId: data.id,
        status: data.status, // 'new', 'pending', 'confirmed', 'completed', 'expired'
        amount: data.pricing.local.amount,
        currency: data.pricing.local.currency,
        payments: data.payments.map(payment => ({
          blockchain: payment.blockchain,
          network: payment.network,
          address: this.maskAddress(payment.address),
          amount: payment.amount.amount,
          currency: payment.amount.currency,
          status: payment.status,
          txId: payment.transaction_id,
          confirmations: payment.confirmations,
        })),
        timeline: data.timeline,
        expiresAt: data.expire_at,
        redirectUrl: data.redirect_url,
      };
    } catch (error) {
      console.error('Get charge status error:', error);
      throw error;
    }
  }

  /**
   * Mask cryptocurrency address for privacy
   */
  maskAddress(address) {
    if (!address || address.length < 16) return address;
    const firstPart = address.slice(0, 8);
    const lastPart = address.slice(-8);
    return `${firstPart}...${lastPart}`;
  }

  /**
   * Verify payment received on blockchain
   */
  async verifyPayment(chargeId, blockchainTxId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chargeId,
            transactionId: blockchainTxId,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to verify payment');
      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get supported cryptocurrencies
   */
  getSupportedCryptos() {
    return {
      BTC: {
        name: 'Bitcoin',
        symbol: '₿',
        decimals: 8,
        networks: ['bitcoin'],
      },
      ETH: {
        name: 'Ethereum',
        symbol: 'Ξ',
        decimals: 18,
        networks: ['ethereum'],
      },
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        networks: ['ethereum', 'polygon'],
      },
      USDT: {
        name: 'Tether',
        symbol: 'USDT',
        decimals: 6,
        networks: ['ethereum', 'polygon', 'tron'],
      },
      DOGE: {
        name: 'Dogecoin',
        symbol: 'Ð',
        decimals: 8,
        networks: ['dogecoin'],
      },
      LTC: {
        name: 'Litecoin',
        symbol: 'Ł',
        decimals: 8,
        networks: ['litecoin'],
      },
    };
  }

  /**
   * Create webhook for payment confirmation
   */
  async registerWebhook(webhookUrl) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/webhook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: webhookUrl,
            events: ['charge.created', 'charge.confirmed', 'charge.failed'],
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to register webhook');
      return await response.json();
    } catch (error) {
      console.error('Webhook registration error:', error);
      throw error;
    }
  }

  /**
   * Get estimated transaction fees
   */
  async getTransactionFees(amount, cryptoType = 'BTC') {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/fees?amount=${amount}&crypto=${cryptoType}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch fees');
      return await response.json();
    } catch (error) {
      console.error('Get fees error:', error);
      throw error;
    }
  }

  /**
   * Cancel or refund crypto charge
   */
  async cancelCharge(chargeId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/crypto/charge/${chargeId}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to cancel charge');
      return await response.json();
    } catch (error) {
      console.error('Cancel charge error:', error);
      throw error;
    }
  }
}

export default new CryptoPaymentService();
