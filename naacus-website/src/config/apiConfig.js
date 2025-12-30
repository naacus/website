/**
 * API Configuration
 * Central configuration for backend API endpoints
 */

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Standard error response handler
 */
export const handleApiError = (error) => {
  if (error.response?.data?.error) {
    return {
      success: false,
      error: error.response.data.error,
      status: error.response.status
    };
  }
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    status: error.response?.status || 500
  };
};

/**
 * Prepare headers for API requests
 */
export const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Make API request
 */
export const apiRequest = async (
  method = 'GET',
  endpoint = '',
  data = null,
  token = null
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const options = {
      method,
      headers: getHeaders(token)
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw handleApiError(error);
  }
};
