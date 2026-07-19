/**
 * Service for fetching country data from REST Countries API
 */

let countriesCache = null;
const REST_COUNTRIES_API_KEY = process.env.REACT_APP_RESTCOUNTRIES_API_KEY;

const COUNTRY_FIELDS = [
  'names.common',
  'codes.alpha_2',
  'codes.alpha_3',
  'region',
  'subregion',
  'currencies',
];
const REST_COUNTRIES_V5_BASE_URL = 'https://api.restcountries.com/countries/v5';
const REST_COUNTRIES_PAGE_SIZE = 100;
const FALLBACK_COUNTRIES_DATASET_URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';

async function guardedFetch(url, options) {
  return new Promise((resolve, reject) => {
    try {
      resolve(fetch(url, options));
    } catch (error) {
      reject(error);
    }
  });
}

function normalizeCountryRecord(country) {
  if (!country || typeof country !== 'object') {
    return null;
  }

  const currencies = country.currencies || country.currency || null;
  const mappedName = country.names || country.name || {};
  const mappedCodes = country.codes || {};
  const name = country.name || {};

  return {
    name: {
      common:
        mappedName.common ||
        name.common ||
        country.name?.official ||
        country.translations?.eng?.common ||
        country.translations?.fra?.common ||
        country.name?.common ||
        country.name?.official ||
        country.cca3 ||
        'Unknown',
    },
    cca2: country.cca2 || mappedCodes.alpha_2 || country.cca2?.toUpperCase?.(),
    cca3: country.cca3 || mappedCodes.alpha_3,
    region: country.region || '',
    subregion: country.subregion || '',
    currencies,
  };
}

async function fetchFromRestCountriesV5() {
  if (!REST_COUNTRIES_API_KEY) {
    return null;
  }

  const headers = {
    Authorization: `Bearer ${REST_COUNTRIES_API_KEY}`,
  };

  let offset = 0;
  let hasMore = true;
  const allCountries = [];

  while (hasMore) {
    const searchParams = new URLSearchParams({
      limit: String(REST_COUNTRIES_PAGE_SIZE),
      offset: String(offset),
      response_fields: COUNTRY_FIELDS.join(','),
    });

    const url = `${REST_COUNTRIES_V5_BASE_URL}?${searchParams.toString()}`;
    const response = await guardedFetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries from REST Countries v5: ${response.statusText}`);
    }

    const payload = await response.json();
    const objects = payload?.data?.objects;
    const apiError = payload?.errors?.[0]?.message;

    if (!Array.isArray(objects)) {
      throw new Error(apiError || 'REST Countries v5 returned an unexpected payload');
    }

    allCountries.push(...objects);

    const count = payload?.data?.meta?.count ?? objects.length;
    hasMore = Boolean(payload?.data?.meta?.more) && count > 0;
    offset += count;

    if (!count) {
      hasMore = false;
    }
  }

  return allCountries.map(normalizeCountryRecord).filter(Boolean);
}

async function fetchFromFallbackDataset() {
  const response = await guardedFetch(FALLBACK_COUNTRIES_DATASET_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch fallback countries dataset: ${response.statusText}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Fallback countries dataset returned an unexpected payload');
  }

  return payload.map(normalizeCountryRecord).filter(Boolean);
}

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
    let data = [];

    try {
      const v5Data = await fetchFromRestCountriesV5();
      if (Array.isArray(v5Data) && v5Data.length) {
        data = v5Data;
      } else {
        data = await fetchFromFallbackDataset();
      }
    } catch (v5Error) {
      console.warn('REST Countries v5 fetch failed, using fallback dataset:', v5Error);
      data = await fetchFromFallbackDataset();
    }
    
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
    currency: country.currency || country.currencies,
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
