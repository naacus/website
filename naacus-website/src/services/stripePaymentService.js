/**
 * Stripe Payment Service
 * Handles credit/debit card payments, Apple Pay, and Google Pay via Stripe
 */

import paymentConfig from '../config/paymentConfig';

class StripePaymentService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.initialized = false;
  }

  /**
   * Initialize Stripe
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load Stripe library
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      
      script.onload = () => {
        this.stripe = window.Stripe(paymentConfig.stripe.publishableKey);
        this.initialized = true;
      };

      script.onerror = () => {
        throw new Error('Failed to load Stripe library');
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }

  /**
   * Create payment intent on backend
   */
  async createPaymentIntent(donationData) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/stripe/create-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(donationData.amount * 100), // Convert to cents
            currency: paymentConfig.general.currency.toLowerCase(),
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

      if (!response.ok) throw new Error('Failed to create payment intent');
      return await response.json();
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  }

  /**
   * Process card payment
   */
  async processCardPayment(clientSecret, cardElement) {
    try {
      if (!this.stripe) await this.initialize();

      const { paymentIntent, error } = await this.stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Card payment error:', error);
      throw error;
    }
  }

  /**
   * Process Apple Pay payment
   */
  async processApplePayment(donationData) {
    try {
      if (!this.stripe) await this.initialize();

      const session = await this.stripe.paymentRequest({
        country: 'US',
        currency: paymentConfig.general.currency.toLowerCase(),
        total: {
          label: 'NAACUS Donation',
          amount: Math.round(donationData.amount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
      });

      const { error, paymentMethod } = await session.show();

      if (error) {
        throw new Error(error.message);
      }

      // Create payment intent with Apple Pay token
      const intentResponse = await this.createPaymentIntent(donationData);
      
      const { paymentIntent } = await this.stripe.confirmCardPayment(
        intentResponse.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Apple Pay error:', error);
      throw error;
    }
  }

  /**
   * Process Google Pay payment
   */
  async processGooglePayment(donationData) {
    try {
      if (!this.stripe) await this.initialize();

      const session = await this.stripe.paymentRequest({
        country: 'US',
        currency: paymentConfig.general.currency.toLowerCase(),
        total: {
          label: 'NAACUS Donation',
          amount: Math.round(donationData.amount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
      });

      const { error, paymentMethod } = await session.show();

      if (error) {
        throw new Error(error.message);
      }

      // Create payment intent with Google Pay token
      const intentResponse = await this.createPaymentIntent(donationData);

      const { paymentIntent } = await this.stripe.confirmCardPayment(
        intentResponse.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Google Pay error:', error);
      throw error;
    }
  }

  /**
   * Confirm payment with webhook verification
   */
  async confirmPayment(paymentIntentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/stripe/confirm/${paymentIntentId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to confirm payment');
      return await response.json();
    } catch (error) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  }
}

export default new StripePaymentService();
