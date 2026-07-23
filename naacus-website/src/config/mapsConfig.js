const FALLBACK_CENTER = { lat: 39.9612, lng: -82.9988 };

function getHostname() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hostname.toLowerCase();
}

export function getMapsApiKey() {
  const hostname = getHostname();

  if (hostname === 'www.naacus.org') {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY_PROD || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  if (hostname === 'test.naacus.org') {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY_DEV || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY_DEV || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  }

  return process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
}

export function getDefaultMapCenter() {
  return FALLBACK_CENTER;
}

export function buildGoogleDirectionsUrl(location) {
  if (!location) {
    return 'https://www.google.com/maps';
  }

  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  }

  const query = encodeURIComponent(location.address || location.name || 'NAACUS Convention');
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
