/**
 * Service for fetching country data from REST Countries API
 */

let countriesCache = null;

/**
 * Fetch all countries with name, region, and subregion data
 * @returns {Promise<Array>} Array of country objects with: name, cca2, cca3, region, subregion, currency
 */
export const fetchCountries = async () => {
  // Return cached data if available
  if (countriesCache) {
    return countriesCache;
  }

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,currency');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Sort countries by common name
    const sortedCountries = data.sort((a, b) => {
      const nameA = a.name?.common || a.name || '';
      const nameB = b.name?.common || b.name || '';
      return nameA.localeCompare(nameB);
    });

    // Cache the data
    countriesCache = sortedCountries;
    
    return sortedCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

/**
 * Format country data for dropdown options
 * @param {Array} countries - Array of country objects from API
 * @returns {Array} Array of formatted options for Fluent UI Dropdown
 */
export const formatCountriesForDropdown = (countries) => {
  return countries.map((country) => ({
    key: country.cca2 || country.name?.common,
    text: country.name?.common || country.name || 'Unknown',
    name: country.name?.common || country.name,
    cca2: country.cca2,
    cca3: country.cca3,
    region: country.region,
    subregion: country.subregion,
    currency: country.currency,
  }));
};

/**
 * Get country by code or name
 * @param {string} searchValue - Country code (cca2/cca3) or name
 * @param {Array} countries - Array of country objects
 * @returns {Object|null} Country object or null if not found
 */
export const getCountryByValue = (searchValue, countries) => {
  if (!searchValue || !countries) return null;
  
  return countries.find((country) => 
    country.cca2 === searchValue || 
    country.cca3 === searchValue || 
    country.name?.common === searchValue
  );
};
