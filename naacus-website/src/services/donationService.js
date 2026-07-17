/**
 * Donation Service
 * Handles CRUD operations for donations
 * 
 * Currently uses mock data. Backend integration:
 * - POST /api/donations - Create donation record after payment
 * - GET /api/donations - List donations
 * - GET /api/donations/:id - Get donation details
 * - GET /api/donations/receipt/:id - Get donation receipt
 * - POST /api/donations/webhook - Payment processor webhook
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores, generateId, getCurrentTimestamp } from './mockData';

const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const { donationStore } = mockDataStores;

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  CARD: 'card',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  BANK_TRANSFER: 'bank_transfer',
  BITCOIN: 'bitcoin'
};

/**
 * Donation status
 */
export const DONATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

/**
 * Initiate a donation (creates record after payment confirmation)
 * @param {Object} donationData - Donation information
 * @returns {Promise<Object>} Created donation record
 */
export const initiateDonation = async (donationData) => {
  if (USE_BACKEND_API) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      const result = await response.json();
      if (response.ok) return result;
    } catch (error) {
      console.error('Backend donation submission failed:', error);
      // Fallback to mock data
    }
  }

  // Mock data fallback
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const donation = {
          id: generateId(),
          transactionId: donationData.transactionId || null,
          amount: donationData.amount,
          currency: donationData.currency || 'USD',
          paymentMethod: donationData.paymentMethod,
          donor: {
            name: donationData.donorName,
            email: donationData.donorEmail,
            phone: donationData.donorPhone || null,
            organization: donationData.donorOrganization || null
          },
          isAnonymous: donationData.isAnonymous || false,
          message: donationData.message || '',
          status: DONATION_STATUS.COMPLETED,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
          processedAt: getCurrentTimestamp(),
          receiptSentAt: getCurrentTimestamp()
        };

        donationStore.push(donation);

        resolve({
          success: true,
          data: donation,
          message: 'Thank you for your donation!'
        });
      }, 500);
    } catch (error) {
      reject({
        success: false,
        message: 'Failed to record donation',
        error: error.message
      });
    }
  });
};

/**
 * Process payment (simulates payment processor webhook)
 * @param {Object} paymentData - Payment processor response
 * @returns {Promise<Object>} Updated donation
 */
export const processDonationPayment = async (paymentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const donation = donationStore.find(d => d.id === paymentData.donationId);

      if (!donation) {
        return reject({
          success: false,
          message: 'Donation not found',
          status: 404
        });
      }

      // Update donation with payment processor info
      donation.transactionId = paymentData.transactionId;
      donation.status = paymentData.success ? DONATION_STATUS.COMPLETED : DONATION_STATUS.FAILED;
      donation.processedAt = getCurrentTimestamp();

      if (paymentData.success) {
        donation.receiptSentAt = getCurrentTimestamp();
      }

      resolve({
        success: true,
        data: donation,
        message: paymentData.success ? 'Payment processed successfully' : 'Payment failed'
      });
    }, 800);
  });
};

/**
 * Get all donations
 * @param {Object} options - Query options (limit, offset, status)
 * @returns {Promise<Object>} List of donations
 */
export const getDonations = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, status = null } = options;
      
      let filtered = [...donationStore];
      
      if (status) {
        filtered = filtered.filter(d => d.status === status);
      }

      // Sort by date, newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = filtered.length;
      const paginatedData = filtered.slice(offset, offset + limit);

      // Calculate total donations
      const totalAmount = donationStore
        .filter(d => d.status === DONATION_STATUS.COMPLETED)
        .reduce((sum, d) => sum + d.amount, 0);

      resolve({
        success: true,
        data: paginatedData,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalDonated: totalAmount,
          completedCount: donationStore.filter(d => d.status === DONATION_STATUS.COMPLETED).length,
          averageDonation: donationStore.filter(d => d.status === DONATION_STATUS.COMPLETED).length > 0
            ? totalAmount / donationStore.filter(d => d.status === DONATION_STATUS.COMPLETED).length
            : 0
        }
      });
    }, 300);
  });
};

/**
 * Get single donation by ID
 * @param {string} id - Donation ID
 * @returns {Promise<Object>} Donation details
 */
export const getDonationById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const donation = donationStore.find(d => d.id === id);

      if (donation) {
        resolve({
          success: true,
          data: donation
        });
      } else {
        reject({
          success: false,
          message: 'Donation not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Get donation receipt
 * @param {string} donationId - Donation ID
 * @returns {Promise<Object>} Receipt information
 */
export const getDonationReceipt = async (donationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const donation = donationStore.find(d => d.id === donationId);

      if (!donation) {
        return reject({
          success: false,
          message: 'Donation not found',
          status: 404
        });
      }

      if (donation.status !== DONATION_STATUS.COMPLETED) {
        return reject({
          success: false,
          message: 'Receipt not available for incomplete donation',
          status: 400
        });
      }

      const receipt = {
        receiptNumber: `NAACUS-${donationId.substring(0, 8).toUpperCase()}`,
        amount: donation.amount,
        currency: donation.currency,
        donationDate: donation.processedAt,
        paymentMethod: donation.paymentMethod,
        donorEmail: donation.donor.email,
        donorName: donation.isAnonymous ? 'Anonymous Donor' : donation.donor.name,
        organizationName: 'National Association of African Catholics in the United States',
        taxId: '12-3456789', // Placeholder
        message: `Thank you for your generous donation of $${donation.amount} to NAACUS. Your support helps us continue our mission.`
      };

      resolve({
        success: true,
        data: receipt
      });
    }, 300);
  });
};

/**
 * Refund a donation
 * @param {string} donationId - Donation ID
 * @param {string} reason - Refund reason
 * @returns {Promise<Object>} Refund confirmation
 */
export const refundDonation = async (donationId, reason) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const donation = donationStore.find(d => d.id === donationId);

      if (!donation) {
        return reject({
          success: false,
          message: 'Donation not found',
          status: 404
        });
      }

      if (donation.status !== DONATION_STATUS.COMPLETED) {
        return reject({
          success: false,
          message: 'Can only refund completed donations',
          status: 400
        });
      }

      donation.status = DONATION_STATUS.REFUNDED;
      donation.refundReason = reason;
      donation.refundedAt = getCurrentTimestamp();
      donation.updatedAt = getCurrentTimestamp();

      resolve({
        success: true,
        data: donation,
        message: 'Donation refunded successfully'
      });
    }, 500);
  });
};

/**
 * Get donation statistics
 * @returns {Promise<Object>} Donation stats
 */
export const getDonationStatistics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const completed = donationStore.filter(d => d.status === DONATION_STATUS.COMPLETED);
      const totalAmount = completed.reduce((sum, d) => sum + d.amount, 0);

      const stats = {
        totalDonations: donationStore.length,
        completedDonations: completed.length,
        failedDonations: donationStore.filter(d => d.status === DONATION_STATUS.FAILED).length,
        totalAmount,
        averageDonation: completed.length > 0 ? totalAmount / completed.length : 0,
        largestDonation: completed.length > 0 ? Math.max(...completed.map(d => d.amount)) : 0,
        byPaymentMethod: Object.values(PAYMENT_METHODS).map(method => ({
          method,
          count: completed.filter(d => d.paymentMethod === method).length,
          total: completed
            .filter(d => d.paymentMethod === method)
            .reduce((sum, d) => sum + d.amount, 0)
        }))
      };

      resolve({
        success: true,
        data: stats
      });
    }, 300);
  });
};
