/**
 * Google Analytics Service
 * Handles sending events to Google Analytics 4
 * Make sure to replace 'G-XXXXXXXXXX' in public/index.html with your actual GA4 Measurement ID
 */

// Lightweight guard so we avoid repeating window checks
const hasGtag = () => typeof window !== 'undefined' && typeof window?.gtag === 'function';

/**
 * Initialize Google Analytics
 * Call this once on app startup
 */
export const initializeGoogleAnalytics = () => {
  if (!hasGtag()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Google Analytics not initialized: gtag missing');
    }
    return;
  }

  // Set default user properties
  setDefaultUserProperties();

  if (process.env.NODE_ENV === 'development') {
    console.log('✓ Google Analytics initialized with user properties');
  }
};

/**
 * Send event to Google Analytics
 * @param {string} eventName - GA4 event name
 * @param {object} eventData - Event parameters
 */
export const sendToGoogleAnalytics = (eventName, eventData = {}) => {
  if (!hasGtag()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ GA event skipped (gtag not available):', eventName, eventData);
    }
    return;
  }

  try {
    const payload = {
      ...(process.env.NODE_ENV === 'development' ? { debug_mode: true } : {}),
      ...eventData,
    };
    window?.gtag?.('event', eventName, payload);
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA Event sent:', eventName, payload);
    }
  } catch (error) {
    console.error('Error sending to Google Analytics:', error);
  }
};

/**
 * Track CTA click in Google Analytics
 * @param {string} category - CTA category
 * @param {string} action - Action taken
 * @param {string} label - Label/description
 */
export const trackCTAInGA = (category, action, label) => {
  sendToGoogleAnalytics('cta_click', {
    event_category: category,
    event_label: `${action} - ${label}`,
    value: 1,
  });
};

/**
 * Track page view in Google Analytics
 * @param {string} pageName - Name of page
 * @param {string} pageTitle - Page title
 */
export const trackPageViewInGA = (pageName, pageTitle = '') => {
  sendToGoogleAnalytics('page_view', {
    page_title: pageTitle || pageName,
    page_path: window.location.pathname,
  });
};

/**
 * Track form event in Google Analytics
 * @param {string} formName - Form name
 * @param {string} eventType - 'start' or 'submit'
 */
export const trackFormInGA = (formName, eventType) => {
  const eventName = eventType === 'start' ? 'form_start' : 'form_submit';
  sendToGoogleAnalytics(eventName, {
    form_name: formName,
    form_id: formName,
  });
};

/**
 * Track download event in Google Analytics
 * @param {string} resourceName - Resource name
 * @param {string} resourceType - Resource type
 */
export const trackDownloadInGA = (resourceName, resourceType = '') => {
  sendToGoogleAnalytics('file_download', {
    file_name: resourceName,
    file_type: resourceType,
  });
};

/**
 * Track scroll event in Google Analytics
 * @param {string} sectionId - Section ID
 */
export const trackScrollInGA = (sectionId) => {
  sendToGoogleAnalytics('scroll', {
    section_id: sectionId,
  });
};

/**
 * Track custom conversion goal
 * @param {string} conversionName - Name of conversion
 * @param {number} value - Conversion value (optional)
 */
export const trackConversionInGA = (conversionName, value = 1) => {
  sendToGoogleAnalytics('conversion', {
    conversion_name: conversionName,
    value: value,
  });
};

/**
 * Track purchase/donation event (GA4 recommended e-commerce event)
 * @param {object} purchaseData - Purchase details
 * @param {number} purchaseData.amount - Donation amount
 * @param {string} purchaseData.currency - Currency code (default: USD)
 * @param {string} purchaseData.transactionId - Unique transaction ID
 * @param {string} purchaseData.paymentMethod - Payment method used
 * @param {string} purchaseData.itemName - Item/donation type
 */
export const trackPurchaseInGA = (purchaseData) => {
  const {
    amount,
    currency = 'USD',
    transactionId,
    paymentMethod = 'unknown',
    itemName = 'Donation',
  } = purchaseData;

  sendToGoogleAnalytics('purchase', {
    transaction_id: transactionId,
    value: parseFloat(amount) || 0,
    currency: currency,
    payment_type: paymentMethod,
    items: [
      {
        item_id: transactionId,
        item_name: itemName,
        price: parseFloat(amount) || 0,
        quantity: 1,
      },
    ],
  });
};

/**
 * Set user properties in Google Analytics
 * @param {object} userProperties - User properties to set
 */
export const setUserPropertiesInGA = (userProperties = {}) => {
  if (!hasGtag()) return;

  try {
    window?.gtag?.('set', {
      user_properties: userProperties,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA User Properties set:', userProperties);
    }
  } catch (error) {
    console.error('Error setting user properties in Google Analytics:', error);
  }
};

/**
 * Initialize default user properties based on browser/session context
 */
export const setDefaultUserProperties = () => {
  if (!hasGtag()) return;

  const userProperties = {};

  // Language preference
  const language = localStorage.getItem('i18nextLng') || navigator.language || 'en';
  userProperties.preferred_language = language.split('-')[0]; // 'en' or 'fr'

  // Visitor type (new vs returning)
  const hasVisited = localStorage.getItem('ga_has_visited');
  if (!hasVisited) {
    userProperties.visitor_type = 'new';
    localStorage.setItem('ga_has_visited', 'true');
  } else {
    userProperties.visitor_type = 'returning';
  }

  // Session count
  let sessionCount = parseInt(localStorage.getItem('ga_session_count') || '0', 10);
  sessionCount += 1;
  localStorage.setItem('ga_session_count', sessionCount.toString());
  userProperties.session_count = sessionCount;

  // User engagement level (based on session count)
  if (sessionCount === 1) {
    userProperties.engagement_level = 'new';
  } else if (sessionCount <= 5) {
    userProperties.engagement_level = 'casual';
  } else if (sessionCount <= 15) {
    userProperties.engagement_level = 'regular';
  } else {
    userProperties.engagement_level = 'loyal';
  }

  setUserPropertiesInGA(userProperties);
};

/**
 * Update user properties when language changes (call from LanguageSwitcher)
 * @param {string} newLanguage - New language code (e.g., 'en', 'fr')
 */
export const updateLanguageProperty = (newLanguage) => {
  if (!hasGtag()) return;

  const languageCode = newLanguage ? newLanguage.split('-')[0] : 'en';
  
  setUserPropertiesInGA({
    preferred_language: languageCode,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 GA Language property updated:', languageCode);
  }
};
