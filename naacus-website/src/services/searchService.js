/**
 * Global Search Service
 * Searches across all content: pages, resources, ministries, events, and FAQs
 * 
 * Uses service layer instead of direct data imports for better maintainability
 * and future API integration support.
 */

import dataService from './dataService';

/**
 * Search all content types
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} - Array of search results with type and relevance
 */
export const searchGlobal = (query, maxResults = 20) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results = [];

  // Search FAQs
  const faqResults = searchFAQs(normalizedQuery);
  results.push(...faqResults.map(item => ({
    ...item,
    type: 'faq',
    category: 'FAQs',
  })));

  // Search Resources
  const resourceResults = searchResources(normalizedQuery);
  results.push(...resourceResults.map(item => ({
    ...item,
    type: 'resource',
    category: 'Resources',
  })));

  // Search Ministries
  const ministryResults = searchMinistries(normalizedQuery);
  results.push(...ministryResults.map(item => ({
    ...item,
    type: 'ministry',
    category: 'Ministries',
  })));

  // Search Events
  const eventResults = searchEvents(normalizedQuery);
  results.push(...eventResults.map(item => ({
    ...item,
    type: 'event',
    category: 'Events',
  })));

  // Search Pages
  const pageResults = searchPages(normalizedQuery);
  results.push(...pageResults.map(item => ({
    ...item,
    type: 'page',
    category: 'Pages',
  })));

  // Sort by relevance score (descending)
  results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  // Return limited results
  return results.slice(0, maxResults);
};

/**
 * Search FAQs
 */
const searchFAQs = (query) => {
  const faqData = dataService.getAllFAQs();
  return faqData
    .filter(faq => {
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      const keywords = (faq.keywords || []).map(k => k.toLowerCase());

      return (
        question.includes(query) ||
        answer.includes(query) ||
        keywords.some(k => k.includes(query))
      );
    })
    .map(faq => ({
      id: faq.id,
      title: faq.question,
      description: faq.answer.substring(0, 150) + '...',
      fullDescription: faq.answer,
      path: `/faq?id=${faq.id}`,
      relevanceScore: calculateRelevance(query, faq.question),
    }));
};

/**
 * Search Resources
 */
const searchResources = (query) => {
  const resourcesData = dataService.getResources?.();
  
  // If resources are not available in dataService, return empty array
  if (!resourcesData || !Array.isArray(resourcesData)) {
    return [];
  }
  
  return resourcesData
    .filter(resource => {
      const title = resource.title.toLowerCase();
      const description = resource.description.toLowerCase();

      return title.includes(query) || description.includes(query);
    })
    .map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      path: '/resources',
      relevanceScore: calculateRelevance(query, resource.title),
    }));
};

/**
 * Search Ministries
 */
const searchMinistries = (query) => {
  const ministriesData = dataService.getMinistries();
  return ministriesData
    .filter(ministry => {
      const title = ministry.title.toLowerCase();
      const description = ministry.description.toLowerCase();

      return title.includes(query) || description.includes(query);
    })
    .map(ministry => ({
      id: ministry.title,
      title: ministry.title,
      description: ministry.description,
      email: ministry.email,
      path: '/fellowship-ministries',
      relevanceScore: calculateRelevance(query, ministry.title),
    }));
};

/**
 * Search Events
 */
const searchEvents = (query) => {
  const pastEvents = dataService.getPastEvents();
  const upcomingEvents = dataService.getUpcomingEvents();
  
  // Combine both past and upcoming events
  const allEvents = [...pastEvents, ...upcomingEvents];
  
  return allEvents
    .filter(event => {
      const title = event.title.toLowerCase();
      const location = (event.location || '').toLowerCase();
      const description = (event.description || '').toLowerCase();

      return (
        title.includes(query) ||
        location.includes(query) ||
        description.includes(query)
      );
    })
    .map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      location: event.location,
      startDate: event.startDate,
      path: '/events',
      relevanceScore: calculateRelevance(query, event.title),
    }));
};

/**
 * Search Pages (navigation pages)
 */
const searchPages = (query) => {
  const pages = [
    { title: 'About', path: '/about', keywords: ['about', 'mission', 'vision', 'naacus'] },
    { title: 'Membership', path: '/membership', keywords: ['membership', 'join', 'member', 'benefits'] },
    { title: 'Leadership', path: '/leadership', keywords: ['leadership', 'team', 'staff', 'board'] },
    { title: 'Events', path: '/events', keywords: ['events', 'conference', 'gathering', 'meeting'] },
    { title: 'Fellowship & Ministries', path: '/fellowship-ministries', keywords: ['ministry', 'fellowship', 'women', 'youth', 'young adults'] },
    { title: 'Programs & Activities', path: '/programs-activities', keywords: ['programs', 'activities', 'workshops'] },
    { title: 'Newsletters', path: '/newsletters', keywords: ['newsletter', 'news', 'updates'] },
    { title: 'Resources', path: '/resources', keywords: ['resources', 'documents', 'downloads'] },
    { title: 'Contact', path: '/contact', keywords: ['contact', 'email', 'phone', 'address'] },
    { title: 'Volunteer', path: '/volunteer', keywords: ['volunteer', 'serve', 'help'] },
    { title: 'NAACUS 2025', path: '/2025', keywords: ['2025', 'conference', 'event', 'annual'] },
  ];

  return pages
    .filter(page => {
      const title = page.title.toLowerCase();
      const keywords = page.keywords.join(' ').toLowerCase();

      return title.includes(query) || keywords.includes(query);
    })
    .map(page => ({
      id: page.path,
      title: page.title,
      description: `Navigate to ${page.title} page`,
      path: page.path,
      relevanceScore: calculateRelevance(query, page.title),
    }));
};

/**
 * Calculate relevance score based on query match
 * @param {string} query - Search query
 * @param {string} text - Text to match against
 * @returns {number} - Relevance score (higher is better)
 */
const calculateRelevance = (query, text) => {
  const normalizedText = text.toLowerCase();
  let score = 0;

  // Exact match gets highest score
  if (normalizedText === query) {
    score += 100;
  }
  // Match at beginning gets high score
  else if (normalizedText.startsWith(query)) {
    score += 50;
  }
  // Partial match gets medium score
  else if (normalizedText.includes(query)) {
    score += 25;
  }

  return score;
};

/**
 * Highlight matching text in content
 * @param {string} text - Original text
 * @param {string} query - Search query
 * @returns {string} - Text with highlighted matches
 */
export const highlightMatch = (text, query) => {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Group search results by type
 * @param {Array} results - Array of search results
 * @returns {Object} - Results grouped by category
 */
export const groupResultsByCategory = (results) => {
  return results.reduce((groups, result) => {
    const category = result.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(result);
    return groups;
  }, {});
};
