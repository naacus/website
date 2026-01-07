/**
 * Highlight Utilities
 * Provides reusable functions for highlighting search text
 */

/**
 * Highlight matching text in content
 * @param {string} text - The text to highlight
 * @param {string} query - The search query
 * @returns {string} - HTML string with highlighted matches
 */
export const highlightText = (text, query) => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part) => 
    regex.test(part) ? `<mark>${part}</mark>` : part
  ).join('');
};

/**
 * Extract search query from URL parameters
 * @param {Location} location - React location object
 * @returns {string} - Search query or empty string
 */
export const getSearchQueryFromUrl = (location) => {
  if (!location.search) return '';
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('search') || '';
};

/**
 * Initialize global highlight styles
 * Call this once in your app to add styles for mark tags
 */
export const initializeHighlightStyles = () => {
  if (typeof document === 'undefined') return;
  
  if (!document.head.querySelector('style[data-highlight]')) {
    const highlightStyle = document.createElement('style');
    highlightStyle.setAttribute('data-highlight', 'true');
    highlightStyle.textContent = `
      mark {
        background-color: #fff4ce;
        padding: 2px 4px;
        font-weight: 700;
        border-radius: 2px;
      }
    `;
    document.head.appendChild(highlightStyle);
  }
};

// Initialize on import
initializeHighlightStyles();
