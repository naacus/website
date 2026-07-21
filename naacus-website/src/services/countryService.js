/**
 * Service for fetching country data from REST Countries API
 */

let countriesCache = null;

const FALLBACK_COUNTRIES = [
  { name: { common: 'United States' }, cca2: 'US', cca3: 'USA', region: 'Americas', subregion: 'North America' },
  { name: { common: 'Canada' }, cca2: 'CA', cca3: 'CAN', region: 'Americas', subregion: 'North America' },
  { name: { common: 'United Kingdom' }, cca2: 'GB', cca3: 'GBR', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'France' }, cca2: 'FR', cca3: 'FRA', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Germany' }, cca2: 'DE', cca3: 'DEU', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Italy' }, cca2: 'IT', cca3: 'ITA', region: 'Europe', subregion: 'Southern Europe' },
  { name: { common: 'Spain' }, cca2: 'ES', cca3: 'ESP', region: 'Europe', subregion: 'Southern Europe' },
  { name: { common: 'Portugal' }, cca2: 'PT', cca3: 'PRT', region: 'Europe', subregion: 'Southern Europe' },
  { name: { common: 'Belgium' }, cca2: 'BE', cca3: 'BEL', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Netherlands' }, cca2: 'NL', cca3: 'NLD', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Switzerland' }, cca2: 'CH', cca3: 'CHE', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Austria' }, cca2: 'AT', cca3: 'AUT', region: 'Europe', subregion: 'Western Europe' },
  { name: { common: 'Sweden' }, cca2: 'SE', cca3: 'SWE', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'Norway' }, cca2: 'NO', cca3: 'NOR', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'Denmark' }, cca2: 'DK', cca3: 'DNK', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'Finland' }, cca2: 'FI', cca3: 'FIN', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'Ireland' }, cca2: 'IE', cca3: 'IRL', region: 'Europe', subregion: 'Northern Europe' },
  { name: { common: 'Poland' }, cca2: 'PL', cca3: 'POL', region: 'Europe', subregion: 'Eastern Europe' },
  { name: { common: 'Australia' }, cca2: 'AU', cca3: 'AUS', region: 'Oceania', subregion: 'Australia and New Zealand' },
  { name: { common: 'New Zealand' }, cca2: 'NZ', cca3: 'NZL', region: 'Oceania', subregion: 'Australia and New Zealand' },
  { name: { common: 'India' }, cca2: 'IN', cca3: 'IND', region: 'Asia', subregion: 'Southern Asia' },
  { name: { common: 'China' }, cca2: 'CN', cca3: 'CHN', region: 'Asia', subregion: 'Eastern Asia' },
  { name: { common: 'Japan' }, cca2: 'JP', cca3: 'JPN', region: 'Asia', subregion: 'Eastern Asia' },
  { name: { common: 'Philippines' }, cca2: 'PH', cca3: 'PHL', region: 'Asia', subregion: 'South-Eastern Asia' },
  { name: { common: 'Brazil' }, cca2: 'BR', cca3: 'BRA', region: 'Americas', subregion: 'South America' },
  { name: { common: 'Mexico' }, cca2: 'MX', cca3: 'MEX', region: 'Americas', subregion: 'North America' },
  { name: { common: 'Argentina' }, cca2: 'AR', cca3: 'ARG', region: 'Americas', subregion: 'South America' },
  { name: { common: 'South Africa' }, cca2: 'ZA', cca3: 'ZAF', region: 'Africa', subregion: 'Southern Africa' },
  { name: { common: 'Nigeria' }, cca2: 'NG', cca3: 'NGA', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Ghana' }, cca2: 'GH', cca3: 'GHA', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Kenya' }, cca2: 'KE', cca3: 'KEN', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Uganda' }, cca2: 'UG', cca3: 'UGA', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Tanzania' }, cca2: 'TZ', cca3: 'TZA', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Rwanda' }, cca2: 'RW', cca3: 'RWA', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Burundi' }, cca2: 'BI', cca3: 'BDI', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Democratic Republic of the Congo' }, cca2: 'CD', cca3: 'COD', region: 'Africa', subregion: 'Middle Africa' },
  { name: { common: 'Republic of the Congo' }, cca2: 'CG', cca3: 'COG', region: 'Africa', subregion: 'Middle Africa' },
  { name: { common: 'Cameroon' }, cca2: 'CM', cca3: 'CMR', region: 'Africa', subregion: 'Middle Africa' },
  { name: { common: 'Senegal' }, cca2: 'SN', cca3: 'SEN', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Ivory Coast' }, cca2: 'CI', cca3: 'CIV', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Benin' }, cca2: 'BJ', cca3: 'BEN', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Togo' }, cca2: 'TG', cca3: 'TGO', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Liberia' }, cca2: 'LR', cca3: 'LBR', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Sierra Leone' }, cca2: 'SL', cca3: 'SLE', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Guinea' }, cca2: 'GN', cca3: 'GIN', region: 'Africa', subregion: 'Western Africa' },
  { name: { common: 'Ethiopia' }, cca2: 'ET', cca3: 'ETH', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Eritrea' }, cca2: 'ER', cca3: 'ERI', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Somalia' }, cca2: 'SO', cca3: 'SOM', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Sudan' }, cca2: 'SD', cca3: 'SDN', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'South Sudan' }, cca2: 'SS', cca3: 'SSD', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Egypt' }, cca2: 'EG', cca3: 'EGY', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'Algeria' }, cca2: 'DZ', cca3: 'DZA', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'Morocco' }, cca2: 'MA', cca3: 'MAR', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'Tunisia' }, cca2: 'TN', cca3: 'TUN', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'Libya' }, cca2: 'LY', cca3: 'LBY', region: 'Africa', subregion: 'Northern Africa' },
  { name: { common: 'Angola' }, cca2: 'AO', cca3: 'AGO', region: 'Africa', subregion: 'Middle Africa' },
  { name: { common: 'Zambia' }, cca2: 'ZM', cca3: 'ZMB', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Zimbabwe' }, cca2: 'ZW', cca3: 'ZWE', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Namibia' }, cca2: 'NA', cca3: 'NAM', region: 'Africa', subregion: 'Southern Africa' },
  { name: { common: 'Botswana' }, cca2: 'BW', cca3: 'BWA', region: 'Africa', subregion: 'Southern Africa' },
  { name: { common: 'Mozambique' }, cca2: 'MZ', cca3: 'MOZ', region: 'Africa', subregion: 'Eastern Africa' },
  { name: { common: 'Madagascar' }, cca2: 'MG', cca3: 'MDG', region: 'Africa', subregion: 'Eastern Africa' }
];

/**
 * Fetch all countries with name, region, and subregion data
 * @returns {Promise<Array>} Array of country objects with: name, cca2, cca3, region, subregion, currency
 */
export const fetchCountries = async () => {
  // Return cached data if available
  if (countriesCache) {
    return countriesCache;
  }

  const sortedCountries = [...FALLBACK_COUNTRIES].sort((a, b) => {
    const nameA = a.name?.common || '';
    const nameB = b.name?.common || '';
    return nameA.localeCompare(nameB);
  });

  countriesCache = sortedCountries;
  return sortedCountries;
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
