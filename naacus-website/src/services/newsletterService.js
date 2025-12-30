/**
 * Newsletter Service
 * Handles CRUD operations for newsletter subscribers
 * 
 * Currently uses mock data. Backend integration:
 * - POST /api/newsletter/subscribe - Subscribe to newsletter
 * - GET /api/newsletter/subscribers - List all subscribers
 * - GET /api/newsletter/subscribers/:id - Get subscriber details
 * - PUT /api/newsletter/subscribers/:id - Update subscription preferences
 * - DELETE /api/newsletter/subscribers/:id - Unsubscribe
 * - POST /api/newsletter/unsubscribe - Unsubscribe by email
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores, generateId, getCurrentTimestamp } from './mockData';

const { newsletterStore } = mockDataStores;

/**
 * Subscribe to newsletter
 * @param {Object} subscriberData - Subscriber information (email, name, language)
 * @returns {Promise<Object>} Created subscription
 */
export const subscribeToNewsletter = async (subscriberData) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if already subscribed
      const existingSubscriber = newsletterStore.find(
        s => s.email.toLowerCase() === subscriberData.email.toLowerCase()
      );

      if (existingSubscriber && existingSubscriber.status === 'active') {
        return resolve({
          success: false,
          message: 'This email is already subscribed to our newsletter',
          status: 409
        });
      }

      // Simulate API delay
      setTimeout(() => {
        const subscription = {
          id: generateId(),
          email: subscriberData.email,
          name: subscriberData.name || '',
          language: subscriberData.language || 'en',
          frequency: subscriberData.frequency || 'weekly', // weekly, monthly, daily
          preferences: subscriberData.preferences || {
            events: true,
            news: true,
            spiritualContent: true,
            updatesCulture: true
          },
          status: 'active',
          subscribedAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp()
        };

        // If re-subscribing, replace existing
        const index = newsletterStore.findIndex(s => s.email.toLowerCase() === subscriberData.email.toLowerCase());
        if (index !== -1) {
          newsletterStore[index] = subscription;
        } else {
          newsletterStore.push(subscription);
        }

        resolve({
          success: true,
          data: subscription,
          message: 'Successfully subscribed to newsletter'
        });
      }, 500);
    } catch (error) {
      reject({
        success: false,
        message: 'Failed to subscribe to newsletter',
        error: error.message
      });
    }
  });
};

/**
 * Get all newsletter subscribers
 * @param {Object} options - Query options (limit, offset, status)
 * @returns {Promise<Object>} List of subscribers
 */
export const getNewsletterSubscribers = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, status = 'active' } = options;
      
      let filtered = [...newsletterStore];
      
      if (status) {
        filtered = filtered.filter(s => s.status === status);
      }

      const total = filtered.length;
      const paginatedData = filtered.slice(offset, offset + limit);

      resolve({
        success: true,
        data: paginatedData,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit)
        }
      });
    }, 300);
  });
};

/**
 * Get subscriber by ID
 * @param {string} id - Subscriber ID
 * @returns {Promise<Object>} Subscriber details
 */
export const getSubscriberById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const subscriber = newsletterStore.find(s => s.id === id);

      if (subscriber) {
        resolve({
          success: true,
          data: subscriber
        });
      } else {
        reject({
          success: false,
          message: 'Subscriber not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Update subscription preferences
 * @param {string} id - Subscriber ID
 * @param {Object} updates - Preferences or settings to update
 * @returns {Promise<Object>} Updated subscription
 */
export const updateSubscriptionPreferences = async (id, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = newsletterStore.findIndex(s => s.id === id);

      if (index !== -1) {
        newsletterStore[index] = {
          ...newsletterStore[index],
          ...updates,
          updatedAt: getCurrentTimestamp()
        };

        resolve({
          success: true,
          data: newsletterStore[index],
          message: 'Preferences updated successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Subscriber not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Unsubscribe from newsletter
 * @param {string} emailOrId - Email address or subscriber ID
 * @returns {Promise<Object>} Unsubscribe confirmation
 */
export const unsubscribeFromNewsletter = async (emailOrId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let index = newsletterStore.findIndex(s => s.id === emailOrId);
      
      if (index === -1) {
        // Try to find by email
        index = newsletterStore.findIndex(
          s => s.email.toLowerCase() === emailOrId.toLowerCase()
        );
      }

      if (index !== -1) {
        const unsubscribed = newsletterStore[index];
        unsubscribed.status = 'unsubscribed';
        unsubscribed.unsubscribedAt = getCurrentTimestamp();
        
        resolve({
          success: true,
          data: unsubscribed,
          message: 'Successfully unsubscribed from newsletter'
        });
      } else {
        reject({
          success: false,
          message: 'Subscriber not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Check if email is subscribed
 * @param {string} email - Email to check
 * @returns {Promise<Object>} Subscription status
 */
export const checkSubscriptionStatus = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const subscriber = newsletterStore.find(
        s => s.email.toLowerCase() === email.toLowerCase()
      );

      resolve({
        success: true,
        data: {
          email,
          isSubscribed: !!subscriber && subscriber.status === 'active',
          subscriber: subscriber || null
        }
      });
    }, 300);
  });
};
