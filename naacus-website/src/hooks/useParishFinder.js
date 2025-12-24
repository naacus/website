/**
 * useParishFinder Hook
 * 
 * Custom React hook for finding parishes by zip code
 * Handles loading states, error handling, and caching
 */

import { useState, useCallback } from 'react';
import parishService from '../services/parishService';

export function useParishFinder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parishes, setParishes] = useState([]);
  const [location, setLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  /**
   * Search parishes by zip code
   * @param {string} zipCode - US zip code (5 digits)
   * @param {number} page - Page number for pagination (default: 1)
   */
  const searchParishes = useCallback(async (zipCode, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await parishService.searchParishes(zipCode, page);

      if (result.success) {
        setParishes(result.parishes);
        setLocation(result.location);
        setCurrentPage(page);
        setTotalResults(result.count || result.parishes.length);
        return result;
      } else {
        setError(result.message);
        setParishes([]);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while searching for parishes';
      setError(errorMessage);
      setParishes([]);
      console.error('Parish search error:', err);
      
      return {
        success: false,
        parishes: [],
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset search state
   */
  const resetSearch = useCallback(() => {
    setLoading(false);
    setError(null);
    setParishes([]);
    setLocation(null);
    setCurrentPage(1);
    setTotalResults(0);
  }, []);

  /**
   * Get demo data (for testing when APIs are unavailable)
   */
  const getDemoData = useCallback((zipCode) => {
    const demoData = parishService.getDemoData(zipCode);
    setParishes(demoData.parishes);
    setLocation(demoData.location);
    setTotalResults(demoData.parishes.length);
    return demoData;
  }, []);

  return {
    // State
    loading,
    error,
    parishes,
    location,
    currentPage,
    totalResults,

    // Methods
    searchParishes,
    resetSearch,
    getDemoData,

    // Computed
    hasResults: parishes.length > 0,
    isEmpty: !loading && parishes.length === 0 && !error
  };
}
