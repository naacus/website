/**
 * PayPal Payment Service
 * Handles PayPal checkout and payment processing
 */

import paymentConfig from '../config/paymentConfig';

class PayPalPaymentService {
  constructor() {
    this.initialized = false;
    this.paypalButtons = null;
  }

  /**
   * Initialize PayPal SDK
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paymentConfig.paypal.clientId}&currency=${paymentConfig.paypal.currency}&intent=${paymentConfig.paypal.intent}`;
      script.async = true;

      script.onload = () => {
        this.initialized = true;
      };

      script.onerror = () => {
        throw new Error('Failed to load PayPal SDK');
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('PayPal initialization error:', error);
      throw error;
    }
  }

  /**
   * Create PayPal order
   */
  async createPayPalOrder(donationData) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/paypal/create-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationData.amount.toFixed(2),
            currency: paymentConfig.paypal.currency,
            email: donationData.email,
            name: donationData.fullName,
            description: donationData.message || 'NAACUS Donation',
            metadata: {
              donorName: donationData.fullName,
              donorEmail: donationData.email,
              message: donationData.message,
            },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create PayPal order');
      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('PayPal order creation error:', error);
      throw error;
    }
  }

  /**
   * Capture PayPal order
   */
  async capturePayPalOrder(orderId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/paypal/capture-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) throw new Error('Failed to capture PayPal order');
      return await response.json();
    } catch (error) {
      console.error('PayPal capture error:', error);
      throw error;
    }
  }

  /**
   * Render PayPal buttons in specified container
   */
  async renderPayPalButtons(containerId, donationData, onSuccess, onError) {
    try {
      if (!this.initialized) await this.initialize();

      // Wait for PayPal SDK to load
      await new Promise(resolve => {
        const checkPayPal = setInterval(() => {
          if (window.paypal) {
            clearInterval(checkPayPal);
            resolve();
          }
        }, 100);
        setTimeout(() => clearInterval(checkPayPal), 10000);
      });

      window.paypal.Buttons({
        createOrder: async () => {
          return await this.createPayPalOrder(donationData);
        },
        onApprove: async (data) => {
          const captureResponse = await this.capturePayPalOrder(data.orderID);
          onSuccess({
            success: true,
            orderId: data.orderID,
            payerId: data.payerID,
            status: captureResponse.status,
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          onError(new Error('PayPal payment failed'));
        },
      }).render(`#${containerId}`);
    } catch (error) {
      console.error('PayPal button rendering error:', error);
      throw error;
    }
  }

  /**
   * Get PayPal order details
   */
  async getOrderDetails(orderId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/paypal/order/${orderId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch order details');
      return await response.json();
    } catch (error) {
      console.error('Get order details error:', error);
      throw error;
    }
  }

  /**
   * Refund PayPal transaction
   */
  async refundTransaction(captureId, amount) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/paypal/refund`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            captureId,
            amount: amount ? amount.toFixed(2) : null,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to refund transaction');
      return await response.json();
    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }
}

export default new PayPalPaymentService();
