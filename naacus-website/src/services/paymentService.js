/**
 * Payment Service Aggregator
 * Unified interface for all payment methods
 */

import stripePaymentService from './stripePaymentService';
import paypalPaymentService from './paypalPaymentService';
import bankTransferPaymentService from './bankTransferPaymentService';
import cryptoPaymentService from './cryptoPaymentService';
import cashAppPaymentService from './cashAppPaymentService';
import paymentConfig from '../config/paymentConfig';

class PaymentService {
  constructor() {
    this.services = {
      card: stripePaymentService,
      applePay: stripePaymentService,
      googlePay: stripePaymentService,
      paypal: paypalPaymentService,
      bank: bankTransferPaymentService,
      crypto: cryptoPaymentService,
      cashapp: cashAppPaymentService,
    };
    this.initialized = false;
  }

  /**
   * Initialize all payment services
   * Uses Promise.allSettled to allow app to continue even if some SDKs fail
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const results = await Promise.allSettled([
        stripePaymentService.initialize(),
        paypalPaymentService.initialize(),
        cryptoPaymentService.initialize(),
        cashAppPaymentService.initialize(),
      ]);

      // Log any failed initializations but don't throw
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const services = ['Stripe', 'PayPal', 'Crypto', 'Cash App'];
          console.warn(`${services[index]} service initialization failed:`, result.reason);
        }
      });

      this.initialized = true;
    } catch (error) {
      console.warn('Payment service initialization warning:', error);
      // Still mark as initialized to allow app to continue
      this.initialized = true;
    }
  }

  /**
   * Process payment based on payment method
   */
  async processPayment(donationData, paymentMethod) {
    try {
      // Validate donation data
      this.validateDonationData(donationData);

      switch (paymentMethod) {
        case 'card':
          return await stripePaymentService.processCardPayment(
            donationData.clientSecret,
            donationData.cardElement
          );

        case 'applePay':
          return await stripePaymentService.processApplePayment(donationData);

        case 'googlePay':
          return await stripePaymentService.processGooglePayment(donationData);

        case 'paypal':
          return await paypalPaymentService.createPayPalOrder(donationData);

        case 'bank':
          return await bankTransferPaymentService.createBankTransferPayment(donationData);

        case 'crypto':
          return await cryptoPaymentService.createCharge(donationData);

        case 'cashapp':
          return await cashAppPaymentService.processCashAppPayment(donationData);

        default:
          throw new Error(`Unknown payment method: ${paymentMethod}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  /**
   * Validate donation data
   */
  validateDonationData(data) {
    const errors = [];

    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Please provide a valid email address');
    }

    if (!data.amount || data.amount < paymentConfig.general.minAmount) {
      errors.push(
        `Donation amount must be at least $${paymentConfig.general.minAmount}`
      );
    }

    if (data.amount > paymentConfig.general.maxAmount) {
      errors.push(
        `Donation amount cannot exceed $${paymentConfig.general.maxAmount}`
      );
    }

    if (data.message && data.message.length > 5000) {
      errors.push('Message cannot exceed 5000 characters');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get payment method configuration
   */
  getPaymentMethodConfig(method) {
    const configs = {
      card: {
        name: 'Credit/Debit Card',
        icon: '/icons/credit-card.svg',
        supported: true,
        processingTime: 'Instant',
      },
      applePay: {
        name: 'Apple Pay',
        icon: '/icons/apple-pay.svg',
        supported: paymentConfig.stripe.features.applePay,
        processingTime: 'Instant',
      },
      googlePay: {
        name: 'Google Pay',
        icon: '/icons/google-pay.svg',
        supported: paymentConfig.stripe.features.googlePay,
        processingTime: 'Instant',
      },
      paypal: {
        name: 'PayPal',
        icon: '/icons/paypal.svg',
        supported: true,
        processingTime: 'Instant',
      },
      bank: {
        name: 'Bank Transfer',
        icon: '/icons/bank-transfer.svg',
        supported: paymentConfig.bankTransfer.enabled,
        processingTime: paymentConfig.bankTransfer.processingTime,
      },
      crypto: {
        name: 'Bitcoin/Crypto',
        icon: '/icons/bitcoin.svg',
        supported: paymentConfig.crypto.enabled,
        processingTime: 'Varies by network',
      },
      cashapp: {
        name: 'Cash App',
        icon: '/icons/cash-app.svg',
        supported: paymentConfig.cashApp.enabled,
        processingTime: 'Instant',
      },
    };

    return configs[method] || null;
  }

  /**
   * Get all supported payment methods
   */
  getSupportedPaymentMethods() {
    const allMethods = [
      'card',
      'applePay',
      'googlePay',
      'paypal',
      'bank',
      'crypto',
      'cashapp',
    ];

    return allMethods
      .map(method => {
        const config = this.getPaymentMethodConfig(method);
        if (!config) {
          console.warn(`No configuration found for payment method: ${method}`);
          return null;
        }
        return {
          id: method,
          ...config,
        };
      })
      .filter(method => method && method.supported);
  }

  /**
   * Track donation event
   */
  async trackDonation(donationData, paymentMethod, status) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/analytics/donation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationData.amount,
            paymentMethod,
            status,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        }
      );

      if (!response.ok) console.warn('Failed to track donation');
    } catch (error) {
      console.error('Donation tracking error:', error);
    }
  }

  /**
   * Generate donation receipt
   */
  async generateReceipt(donationId, email) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/receipt/${donationId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/pdf' },
        }
      );

      if (!response.ok) throw new Error('Failed to generate receipt');
      return await response.blob();
    } catch (error) {
      console.error('Generate receipt error:', error);
      throw error;
    }
  }

  /**
   * Send donation confirmation email
   */
  async sendConfirmationEmail(donationData, paymentMethod, status) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/send-confirmation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: donationData.email,
            name: donationData.fullName,
            amount: donationData.amount,
            paymentMethod,
            status,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send confirmation email');
      return await response.json();
    } catch (error) {
      console.error('Send confirmation email error:', error);
      throw error;
    }
  }

  /**
   * Get donation history for user
   */
  async getDonationHistory(email) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/history/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch donation history');
      return await response.json();
    } catch (error) {
      console.error('Get donation history error:', error);
      throw error;
    }
  }

  /**
   * Get donation statistics
   */
  async getDonationStats(dateRange = '30d') {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/stats?range=${dateRange}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch donation stats');
      return await response.json();
    } catch (error) {
      console.error('Get donation stats error:', error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/status/${paymentId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to check payment status');
      return await response.json();
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  }
}

export default new PaymentService();
