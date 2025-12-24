/**
 * Cash App Payment Service
 * Handles Cash App donations and payments
 */

import paymentConfig from '../config/paymentConfig';

class CashAppPaymentService {
  constructor() {
    this.initialized = false;
    this.squarePayments = null;
  }

  /**
   * Initialize Square/Cash App
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Check if Square is already loaded
      if (window.Square) {
        this.squarePayments = window.Square.payments(paymentConfig.cashApp.applicationId, paymentConfig.cashApp.locationId);
        this.initialized = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.async = true;

      script.onload = () => {
        if (window.Square) {
          this.squarePayments = window.Square.payments(
            paymentConfig.cashApp.applicationId,
            paymentConfig.cashApp.locationId
          );
          this.initialized = true;
        } else {
          console.warn('Square library loaded but Square object not found');
          this.initialized = true;
        }
      };

      script.onerror = () => {
        console.warn('Square SDK failed to load. Cash App payments may not be available.');
        this.initialized = true;
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('Square initialization warning:', error);
      this.initialized = true;
    }
  }

  /**
   * Process Cash App payment
   * @param {Object} donationData - Donation data including amount, email, fullName
   * @returns {Promise<Object>} Payment result
   */
  async processCashAppPayment(donationData) {
    try {
      if (!this.initialized || !this.squarePayments) {
        throw new Error('Square SDK not available. Please try another payment method.');
      }

      const { amount, email, fullName, message } = donationData;
      const amountInCents = Math.round(amount * 100);

      // Create payment request
      const paymentRequest = {
        requestShippingAddress: false,
        requestBillingInfo: true,
        currencyCode: paymentConfig.general.currency,
        countryCode: 'US',
        total: {
          label: 'NAACUS Donation',
          amount: amountInCents.toString(),
          pending: false,
        },
        lineItems: [
          {
            label: 'Donation to NAACUS',
            amount: amountInCents.toString(),
            pending: false,
          },
        ],
      };

      // Initialize Cash App payment source
      const cashApp = await this.squarePayments.cashApp(paymentRequest);
      
      // Request payment method
      const result = await cashApp.request();
      
      if (result.status === 'OK') {
        // Send to backend for processing
        const response = await fetch(`${paymentConfig.general.apiBaseUrl}/payments/cashapp/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.details.sourceId,
            amount: amount,
            currency: paymentConfig.general.currency,
            email,
            fullName,
            message,
            idempotencyKey: `${Date.now()}-${Math.random()}`,
          }),
        });

        if (!response.ok) {
          throw new Error('Payment processing failed');
        }

        return await response.json();
      } else {
        throw new Error(result.errors?.[0]?.message || 'Cash App payment cancelled');
      }
    } catch (error) {
      console.error('Cash App payment error:', error);
      throw error;
    }
  }

  /**
   * Get Cash App payment details for display
   * @returns {Object} Payment method details
   */
  getCashAppDetails() {
    return {
      id: 'cashapp',
      label: 'Cash App',
      icon: '💵',
      processingTime: 'Instant',
      info: 'Pay securely with Cash App. Funds typically arrive instantly.',
    };
  }

  /**
   * Validate Cash App payment setup
   * @returns {boolean} Whether service is properly configured
   */
  isConfigured() {
    return !!(
      paymentConfig.cashApp?.applicationId &&
      paymentConfig.cashApp?.locationId &&
      this.initialized
    );
  }

  /**
   * Refund Cash App payment
   * @param {string} transactionId - Square transaction ID
   * @returns {Promise<Object>} Refund result
   */
  async refundCashAppPayment(transactionId) {
    try {
      const response = await fetch(`${paymentConfig.general.apiBaseUrl}/payments/cashapp/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Refund processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Cash App refund error:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   * @param {string} transactionId - Square transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  async getTransactionStatus(transactionId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/cashapp/transaction/${transactionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transaction status');
      }

      return await response.json();
    } catch (error) {
      console.error('Transaction status error:', error);
      throw error;
    }
  }
}

const cashAppPaymentService = new CashAppPaymentService();
export default cashAppPaymentService;
