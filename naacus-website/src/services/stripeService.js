/**
 * Stripe Service Module
 * Handles all Stripe payment-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Create a Stripe checkout session
 * @param {Object} options - Checkout options
 * @param {string} options.priceId - Stripe price ID or lookup key
 * @param {string} options.email - Customer email
 * @param {number} options.quantity - Quantity of items
 * @param {string} options.plan - Plan name
 * @param {number} options.amount - Amount in cents
 * @returns {Promise<Object>} Session data with sessionId
 */
export const createCheckoutSession = async (options) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

/**
 * Create a Stripe customer portal session
 * @param {string} sessionId - The original checkout session ID
 * @returns {Promise<Object>} Portal session data with redirect URL
 */
export const createPortalSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create portal session');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe portal error:', error);
    throw error;
  }
};

/**
 * Handle successful checkout
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} Session details
 */
export const handleCheckoutSuccess = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout-session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve session details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving session:', error);
    throw error;
  }
};

/**
 * Update subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated subscription
 */
export const updateSubscription = async (subscriptionId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe subscription update error:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} Canceled subscription details
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe subscription cancellation error:', error);
    throw error;
  }
};

/**
 * Get subscription details
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} Subscription details
 */
export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve subscription details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
};

/**
 * Get customer's payment methods
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Array>} List of payment methods
 */
export const getPaymentMethods = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/payment-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving payment methods:', error);
    throw error;
  }
};

/**
 * Initialize Stripe.js
 * @returns {Promise<Stripe>} Stripe instance
 */
export const initializeStripe = async () => {
  if (!window.Stripe) {
    throw new Error('Stripe.js has not been loaded. Make sure it is included in your HTML.');
  }

  return window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
};

const stripeService = {
  createCheckoutSession,
  createPortalSession,
  handleCheckoutSuccess,
  updateSubscription,
  cancelSubscription,
  getSubscriptionDetails,
  getPaymentMethods,
  initializeStripe,
};

export default stripeService;
