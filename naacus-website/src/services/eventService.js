/**
 * Event Service
 * Handles CRUD operations for events
 * 
 * Currently uses mock data. Backend integration:
 * - GET /api/events - List all events
 * - GET /api/events/:id - Get single event
 * - POST /api/events - Create event (admin)
 * - PUT /api/events/:id - Update event (admin)
 * - DELETE /api/events/:id - Delete event (admin)
 * - POST /api/events/:id/register - Register for event
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores, generateId, getCurrentTimestamp } from './mockData';

const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const { eventsStore } = mockDataStores;

/**
 * Get all events
 * @param {Object} options - Query options (type, year, status)
 * @returns {Promise<Object>} List of all events
 */
export const getAllEvents = async (options = {}) => {
  if (USE_BACKEND_API) {
    try {
      const params = new URLSearchParams(options);
      const response = await fetch(`${BACKEND_URL}/api/events?${params}`);
      if (response.ok) return response.json();
    } catch (error) {
      console.error('Backend events fetch failed:', error);
      // Fallback to mock data
    }
  }

  // Mock data fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      const { type = null, year = null } = options;
      
      const allEvents = [
        ...eventsStore.past,
        ...eventsStore.upcoming
      ];

      let filtered = allEvents;

      if (type === 'past') {
        filtered = eventsStore.past;
      } else if (type === 'upcoming') {
        filtered = eventsStore.upcoming;
      }

      if (year) {
        filtered = filtered.filter(e => e.year === year);
      }

      // Sort by date
      filtered.sort((a, b) => {
        const dateA = new Date(a.date.split('-')[0]);
        const dateB = new Date(b.date.split('-')[0]);
        return dateB - dateA;
      });

      resolve({
        success: true,
        data: filtered,
        total: filtered.length
      });
    }, 300);
  });
};

/**
 * Get past events
 * @param {Object} options - Query options (limit, offset, year)
 * @returns {Promise<Object>} List of past events
 */
export const getPastEvents = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, year = null } = options;
      
      let filtered = [...eventsStore.past];

      if (year) {
        filtered = filtered.filter(e => e.year === year);
      }

      // Sort by date, newest first
      filtered.sort((a, b) => {
        const dateA = new Date(a.date.split('-')[0]);
        const dateB = new Date(b.date.split('-')[0]);
        return dateB - dateA;
      });

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
 * Get upcoming events
 * @param {Object} options - Query options (limit, offset, year)
 * @returns {Promise<Object>} List of upcoming events
 */
export const getUpcomingEvents = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 10, offset = 0, year = null } = options;
      
      let filtered = [...eventsStore.upcoming];

      if (year) {
        filtered = filtered.filter(e => e.year === year);
      }

      // Sort by date
      filtered.sort((a, b) => {
        const dateA = new Date(a.date.split('-')[0]);
        const dateB = new Date(b.date.split('-')[0]);
        return dateA - dateB;
      });

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
 * Get single event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Event details
 */
export const getEventById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allEvents = [...eventsStore.past, ...eventsStore.upcoming];
      const event = allEvents.find(e => e.id === id);

      if (event) {
        resolve({
          success: true,
          data: event
        });
      } else {
        reject({
          success: false,
          message: 'Event not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Get events by year
 * @param {number} year - Year to filter by
 * @returns {Promise<Object>} Events for that year
 */
export const getEventsByYear = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pastEvents = eventsStore.past.filter(e => e.year === year);
      const upcomingEvents = eventsStore.upcoming.filter(e => e.year === year);

      resolve({
        success: true,
        data: {
          year,
          past: pastEvents,
          upcoming: upcomingEvents,
          total: pastEvents.length + upcomingEvents.length
        }
      });
    }, 300);
  });
};

/**
 * Get all available years for filtering
 * @returns {Promise<Object>} List of years with events
 */
export const getAvailableEventYears = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allEvents = [...eventsStore.past, ...eventsStore.upcoming];
      const years = Array.from(new Set(allEvents.map(e => e.year)))
        .sort((a, b) => a - b);

      resolve({
        success: true,
        data: years
      });
    }, 300);
  });
};

/**
 * Create event (admin only)
 * @param {Object} eventData - Event information
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const newEvent = {
          id: generateId(),
          ...eventData,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp()
        };

        if (eventData.status === 'completed') {
          eventsStore.past.push(newEvent);
        } else {
          eventsStore.upcoming.push(newEvent);
        }

        resolve({
          success: true,
          data: newEvent,
          message: 'Event created successfully'
        });
      }, 500);
    } catch (error) {
      reject({
        success: false,
        message: 'Failed to create event',
        error: error.message
      });
    }
  });
};

/**
 * Update event (admin only)
 * @param {string} id - Event ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (id, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allEvents = [...eventsStore.past, ...eventsStore.upcoming];
      const event = allEvents.find(e => e.id === id);

      if (!event) {
        return reject({
          success: false,
          message: 'Event not found',
          status: 404
        });
      }

      Object.assign(event, updates, { updatedAt: getCurrentTimestamp() });

      resolve({
        success: true,
        data: event,
        message: 'Event updated successfully'
      });
    }, 300);
  });
};

/**
 * Delete event (admin only)
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteEvent = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let index = eventsStore.past.findIndex(e => e.id === id);
      let store = 'past';

      if (index === -1) {
        index = eventsStore.upcoming.findIndex(e => e.id === id);
        store = 'upcoming';
      }

      if (index !== -1) {
        const deleted = (store === 'past' ? eventsStore.past : eventsStore.upcoming).splice(index, 1);

        resolve({
          success: true,
          data: deleted[0],
          message: 'Event deleted successfully'
        });
      } else {
        reject({
          success: false,
          message: 'Event not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Get featured event (2027 conference or largest upcoming)
 * @returns {Promise<Object>} Featured event
 */
export const getFeaturedEvent = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Look for 2027 conference first
      let featured = eventsStore.upcoming.find(e => e.year === 2027 || e.id === 'upcoming-2027-conference');
      
      // If not found, get the first upcoming event
      if (!featured && eventsStore.upcoming.length > 0) {
        featured = eventsStore.upcoming[0];
      }

      resolve({
        success: true,
        data: featured || null
      });
    }, 300);
  });
};
