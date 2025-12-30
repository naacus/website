/**
 * Membership Service
 * Handles CRUD operations for membership records
 * 
 * Currently uses mock data. Backend integration:
 * - POST /api/memberships - Create new membership
 * - GET /api/memberships - List all memberships
 * - GET /api/memberships/:id - Get single membership
 * - PUT /api/memberships/:id - Update membership
 * - DELETE /api/memberships/:id - Delete membership
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores, generateId, getCurrentTimestamp } from './mockData';

const { membershipStore } = mockDataStores;

/**
 * Create a new membership record
 * @param {Object} membershipData - Membership form data
 * @returns {Promise<Object>} Created membership with ID and timestamp
 */
export const createMembership = async (membershipData) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate API delay
      setTimeout(() => {
        const newMembership = {
          id: generateId(),
          ...membershipData,
          status: 'active',
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp()
        };

        membershipStore.push(newMembership);

        resolve({
          success: true,
          data: newMembership,
          message: 'Membership created successfully'
        });
      }, 500);
    } catch (error) {
      reject({
        success: false,
        message: 'Failed to create membership',
        error: error.message
      });
    }
  });
};

/**
 * Get all memberships
 * @param {Object} options - Query options (limit, offset, filter)
 * @returns {Promise<Object>} List of memberships with pagination
 */
export const getMemberships = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, status = null } = options;
      
      let filtered = [...membershipStore];
      
      if (status) {
        filtered = filtered.filter(m => m.status === status);
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
 * Get single membership by ID
 * @param {string} id - Membership ID
 * @returns {Promise<Object>} Membership record
 */
export const getMembershipById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const membership = membershipStore.find(m => m.id === id);

      if (membership) {
        resolve({
          success: true,
          data: membership
        });
      } else {
        reject({
          success: false,
          message: 'Membership not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Update membership record
 * @param {string} id - Membership ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated membership
 */
export const updateMembership = async (id, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = membershipStore.findIndex(m => m.id === id);

      if (index !== -1) {
        membershipStore[index] = {
          ...membershipStore[index],
          ...updates,
          updatedAt: getCurrentTimestamp()
        };

        resolve({
          success: true,
          data: membershipStore[index],
          message: 'Membership updated successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Membership not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Delete membership record
 * @param {string} id - Membership ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteMembership = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = membershipStore.findIndex(m => m.id === id);

      if (index !== -1) {
        const deleted = membershipStore.splice(index, 1);

        resolve({
          success: true,
          data: deleted[0],
          message: 'Membership deleted successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Membership not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Search memberships by email
 * @param {string} email - Email address to search
 * @returns {Promise<Object>} Matching memberships
 */
export const searchMembershipsByEmail = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = membershipStore.filter(m =>
        m.email.toLowerCase().includes(email.toLowerCase())
      );

      resolve({
        success: true,
        data: results
      });
    }, 300);
  });
};
