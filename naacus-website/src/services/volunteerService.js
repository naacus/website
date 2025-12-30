/**
 * Volunteer Service
 * Handles CRUD operations for volunteer records
 * 
 * Currently uses mock data. Backend integration:
 * - POST /api/volunteers - Create new volunteer
 * - GET /api/volunteers - List all volunteers
 * - GET /api/volunteers/:id - Get single volunteer
 * - PUT /api/volunteers/:id - Update volunteer
 * - DELETE /api/volunteers/:id - Delete volunteer
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores, generateId, getCurrentTimestamp } from './mockData';

const { volunteerStore } = mockDataStores;

/**
 * Create a new volunteer record
 * @param {Object} volunteerData - Volunteer form data
 * @returns {Promise<Object>} Created volunteer with ID and timestamp
 */
export const createVolunteer = async (volunteerData) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate API delay
      setTimeout(() => {
        const newVolunteer = {
          id: generateId(),
          ...volunteerData,
          status: 'pending_review', // pending_review, approved, rejected, inactive
          backgroundCheckStatus: 'pending', // pending, approved, rejected
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp()
        };

        volunteerStore.push(newVolunteer);

        resolve({
          success: true,
          data: newVolunteer,
          message: 'Volunteer application submitted successfully'
        });
      }, 500);
    } catch (error) {
      reject({
        success: false,
        message: 'Failed to submit volunteer application',
        error: error.message
      });
    }
  });
};

/**
 * Get all volunteers
 * @param {Object} options - Query options (limit, offset, filter)
 * @returns {Promise<Object>} List of volunteers with pagination
 */
export const getVolunteers = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, status = null, backgroundCheckStatus = null } = options;
      
      let filtered = [...volunteerStore];
      
      if (status) {
        filtered = filtered.filter(v => v.status === status);
      }

      if (backgroundCheckStatus) {
        filtered = filtered.filter(v => v.backgroundCheckStatus === backgroundCheckStatus);
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
 * Get single volunteer by ID
 * @param {string} id - Volunteer ID
 * @returns {Promise<Object>} Volunteer record
 */
export const getVolunteerById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const volunteer = volunteerStore.find(v => v.id === id);

      if (volunteer) {
        resolve({
          success: true,
          data: volunteer
        });
      } else {
        reject({
          success: false,
          message: 'Volunteer not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Update volunteer record
 * @param {string} id - Volunteer ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated volunteer
 */
export const updateVolunteer = async (id, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = volunteerStore.findIndex(v => v.id === id);

      if (index !== -1) {
        volunteerStore[index] = {
          ...volunteerStore[index],
          ...updates,
          updatedAt: getCurrentTimestamp()
        };

        resolve({
          success: true,
          data: volunteerStore[index],
          message: 'Volunteer record updated successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Volunteer not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Delete volunteer record
 * @param {string} id - Volunteer ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteVolunteer = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = volunteerStore.findIndex(v => v.id === id);

      if (index !== -1) {
        const deleted = volunteerStore.splice(index, 1);

        resolve({
          success: true,
          data: deleted[0],
          message: 'Volunteer record deleted successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Volunteer not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Search volunteers by email
 * @param {string} email - Email address to search
 * @returns {Promise<Object>} Matching volunteers
 */
export const searchVolunteersByEmail = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = volunteerStore.filter(v =>
        v.email.toLowerCase().includes(email.toLowerCase())
      );

      resolve({
        success: true,
        data: results
      });
    }, 300);
  });
};

/**
 * Get volunteers by status
 * @param {string} status - Status filter
 * @returns {Promise<Object>} Matching volunteers
 */
export const getVolunteersByStatus = async (status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = volunteerStore.filter(v => v.status === status);

      resolve({
        success: true,
        data: results,
        count: results.length
      });
    }, 300);
  });
};
