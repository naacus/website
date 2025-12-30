/**
 * FAQ Service
 * Handles CRUD operations for FAQ items
 * 
 * Currently uses mock data. Backend integration:
 * - GET /api/faq - List all FAQs
 * - GET /api/faq/:id - Get single FAQ
 * - GET /api/faq/category/:category - Get FAQs by category
 * - GET /api/faq/search - Search FAQs
 * - POST /api/faq - Create FAQ (admin)
 * - PUT /api/faq/:id - Update FAQ (admin)
 * - DELETE /api/faq/:id - Delete FAQ (admin)
 * 
 * To enable backend API: Set REACT_APP_USE_BACKEND_API=true in .env
 */

import { mockDataStores } from './mockData';

const { faqStore } = mockDataStores;

/**
 * Get all FAQs
 * @param {Object} options - Query options (limit, offset)
 * @returns {Promise<Object>} List of all FAQs
 */
export const getAllFAQs = async (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 20, offset = 0 } = options;
      
      const total = faqStore.length;
      const paginatedData = faqStore.slice(offset, offset + limit);

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
 * Get single FAQ by ID
 * @param {string} id - FAQ ID
 * @returns {Promise<Object>} FAQ details
 */
export const getFAQById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const faq = faqStore.find(f => f.id === id);

      if (faq) {
        resolve({
          success: true,
          data: faq
        });
      } else {
        reject({
          success: false,
          message: 'FAQ not found',
          status: 404
        });
      }
    }, 300);
  });
};

/**
 * Get FAQs by category
 * @param {string} category - Category to filter by
 * @param {Object} options - Query options (limit, offset)
 * @returns {Promise<Object>} FAQs in category
 */
export const getFAQsByCategory = async (category, options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 20, offset = 0 } = options;
      
      const filtered = faqStore.filter(f => f.category === category);
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
 * Search FAQs by query
 * @param {string} query - Search query
 * @param {Object} options - Query options (limit, offset, category)
 * @returns {Promise<Object>} Matching FAQs
 */
export const searchFAQs = async (query, options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { limit = 20, offset = 0, category = null } = options;
      const normalizedQuery = query.toLowerCase();

      let results = faqStore.filter(faq => {
        const matchesQuery =
          faq.question.toLowerCase().includes(normalizedQuery) ||
          faq.answer.toLowerCase().includes(normalizedQuery) ||
          faq.keywords.some(k => k.toLowerCase().includes(normalizedQuery));

        if (category && faq.category !== category) {
          return false;
        }

        return matchesQuery;
      });

      const total = results.length;
      const paginatedData = results.slice(offset, offset + limit);

      resolve({
        success: true,
        data: paginatedData,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit)
        },
        query
      });
    }, 400);
  });
};

/**
 * Search FAQs by keywords
 * @param {string[]} keywords - Array of keywords
 * @returns {Promise<Object>} Matching FAQs
 */
export const searchFAQsByKeywords = async (keywords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedKeywords = keywords.map(k => k.toLowerCase());

      const results = faqStore.filter(faq =>
        faq.keywords.some(k =>
          normalizedKeywords.some(nk => k.toLowerCase().includes(nk))
        )
      );

      resolve({
        success: true,
        data: results,
        keywordsMatched: normalizedKeywords
      });
    }, 300);
  });
};

/**
 * Get all FAQ categories
 * @returns {Promise<Object>} List of unique categories
 */
export const getFAQCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(faqStore.map(f => f.category))].sort();

      const categoryCounts = {};
      categories.forEach(cat => {
        categoryCounts[cat] = faqStore.filter(f => f.category === cat).length;
      });

      resolve({
        success: true,
        data: categories,
        stats: categoryCounts
      });
    }, 300);
  });
};

/**
 * Get related FAQs
 * @param {string} faqId - FAQ ID to find related items for
 * @param {number} limit - Max number of related items
 * @returns {Promise<Object>} Related FAQs
 */
export const getRelatedFAQs = async (faqId, limit = 5) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const faq = faqStore.find(f => f.id === faqId);

      if (!faq) {
        return reject({
          success: false,
          message: 'FAQ not found',
          status: 404
        });
      }

      // Find FAQs in the same category
      const related = faqStore
        .filter(f =>
          f.id !== faqId &&
          f.category === faq.category
        )
        .slice(0, limit);

      resolve({
        success: true,
        data: related
      });
    }, 300);
  });
};
