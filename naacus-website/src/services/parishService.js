/**
 * Parish Location Service
 * 
 * Service to find parishes near a given zip code using geolocation APIs
 * 1. Get coordinates (lat/lon) from zip code using Zippopotam.us API
 * 2. Find parishes near those coordinates using UpdateParishData API
 * 3. Extract parish details: address, city, zipCode, diocese, state
 */

class ParishService {
  constructor() {
    this.zipCodeApiUrl = 'https://api.zippopotam.us/us';
    this.parishApiUrl = 'https://apiv4.updateparishdata.org/Churchs';
  }

  /**
   * Get geographic coordinates from a zip code
   * @param {string} zipCode - US zip code (5 digits)
   * @returns {Promise<{latitude: number, longitude: number, city: string, state: string}>}
   */
  async getCoordinatesFromZipCode(zipCode) {
    try {
      if (!zipCode || zipCode.trim() === '') {
        throw new Error('Zip code is required');
      }

      console.log(`Fetching coordinates for zip code: ${zipCode}`);

      const response = await fetch(`${this.zipCodeApiUrl}/${zipCode}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch zip code data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.places || data.places.length === 0) {
        throw new Error(`No location found for zip code: ${zipCode}`);
      }

      const place = data.places[0];
      const latitude = parseFloat(place.latitude);
      const longitude = parseFloat(place.longitude);
      const city = place['place name'];
      const state = place['state abbreviation'];

      console.log(`Got coordinates: lat=${latitude}, lon=${longitude}, city=${city}, state=${state}`);

      return {
        latitude,
        longitude,
        city,
        state,
        zipCode
      };
    } catch (error) {
      console.error('Error getting coordinates from zip code:', error);
      throw error;
    }
  }

  /**
   * Get parishes near given coordinates
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} page - Page number for pagination (default: 1)
   * @returns {Promise<Array>} Array of parish objects
   */
  async getParishesNearCoordinates(latitude, longitude, page = 1) {
    try {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }

      console.log(`Fetching parishes near lat=${latitude}, lon=${longitude}, page=${page}`);

      const url = `${this.parishApiUrl}/?lat=${latitude}&long=${longitude}&pg=${page}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch parish data: ${response.statusText}`);
      }

      const data = await response.json();

      // API returns array of church objects directly (not wrapped)
      if (!Array.isArray(data)) {
        console.warn('No churches found in response');
        return [];
      }

      // Extract parish details from API response
      const parishes = data.map(church => this.extractParishDetails(church));

      console.log(`Found ${parishes.length} parishes`);
      return parishes;
    } catch (error) {
      console.error('Error fetching parishes:', error);
      throw error;
    }
  }

  /**
   * Extract parish details from API response
   * @param {Object} churchData - Raw church data from API
   * @returns {Object} Formatted parish object
   */
  extractParishDetails(churchData) {
    return {
      id: churchData.id || '',
      name: churchData.name || 'Unknown Parish',
      address: churchData.church_address_street_address || '',
      city: churchData.church_address_city_name || '',
      state: churchData.church_address_providence_name || '',
      zipCode: churchData.church_address_postal_code || '',
      county: churchData.church_address_county || '',
      country: churchData.church_address_country_territory_name || 'United States',
      diocese: churchData.diocese_name || '',
      dioceseType: churchData.diocese_type_name || '',
      churchType: churchData.church_type_name || 'Parish',
      phone: churchData.phone_number || '',
      email: churchData.email || '',
      website: churchData.url || '',
      latitude: parseFloat(churchData.latitude) || null,
      longitude: parseFloat(churchData.longitude) || null,
      distance: parseFloat(churchData.distance) || null, // Distance in miles from search center
      riteType: churchData.rite_type_name || 'Roman-Latin',
      pastorName: churchData.pastors_name || '',
      wheelchairAccess: churchData.wheel_chair_access || null,
      lastUpdate: churchData.last_update || '',
      language: churchData.language_name || 'English',
      directions: churchData.directions || '',
      comments: churchData.comments || '',
      worshipTimes: churchData.church_worship_times || [], // Array of mass times with details
      militaryTime: churchData.military_time || false
    };
  }

  /**
   * Main method: Get parishes for a given zip code
   * @param {string} zipCode - US zip code
   * @param {number} page - Page number for pagination (default: 1)
   * @returns {Promise<{
   *   success: boolean,
   *   zipCode: string,
   *   location: {latitude, longitude, city, state},
   *   parishes: Array,
   *   message: string
   * }>}
   */
  async getParishesByZipCode(zipCode, page = 1) {
    try {
      // Step 1: Get coordinates from zip code
      const location = await this.getCoordinatesFromZipCode(zipCode);

      // Step 2: Get parishes near those coordinates
      const parishes = await this.getParishesNearCoordinates(
        location.latitude,
        location.longitude,
        page
      );

      return {
        success: true,
        zipCode,
        location,
        parishes,
        message: `Found ${parishes.length} parishes near ${location.city}, ${location.state}`,
        count: parishes.length
      };
    } catch (error) {
      console.error('Error getting parishes by zip code:', error);
      return {
        success: false,
        zipCode,
        parishes: [],
        error: error.message,
        message: `Failed to find parishes: ${error.message}`
      };
    }
  }

  /**
   * Search parishes with error handling and fallback
   * @param {string} zipCode - US zip code
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Object>} Result object with parishes or error message
   */
  async searchParishes(zipCode, page = 1) {
    if (!zipCode || zipCode.trim() === '') {
      return {
        success: false,
        parishes: [],
        message: 'Please enter a valid zip code'
      };
    }

    return await this.getParishesByZipCode(zipCode, page);
  }
}

const parishService = new ParishService();
export default parishService;
