/**
 * Data Service Layer
 * Provides centralized access to all data (mock or backend)
 * 
 * To switch to backend API:
 * 1. Set USE_BACKEND_API = true
 * 2. Implement backend endpoints listed below
 * 3. Backend API base: http://localhost:5000/api (or production URL)
 * 
 * Backend Endpoints:
 * - GET /api/data/leadership - Executive board, advisers, ministry coordinations
 * - GET /api/data/ministries - Ministry information
 * - GET /api/data/resources - Resources/links
 * - GET /api/data/testimonials - Member testimonials
 * - GET /api/data/member-benefits - Membership benefits
 * - GET /api/data/activities - Activities and programs
 * - GET /api/data/events - All events
 * - GET /api/data/faq - All FAQs with categories
 */

import { leadershipData } from '../data/leadershipData';
import { ministriesData as ministriesDataFallback } from '../data/ministriesData';
import { memberBenefitsData as memberBenefitsDataFallback } from '../data/memberBenefitsData';
import { activitiesData as activitiesDataFallback } from '../data/activitiesData';
import { eventsData } from '../data/eventsData';
import { faqData as faqDataFallback } from '../data/faqData';
import { resourcesData as resourcesDataFallback } from '../data/resourcesData';
import { 
  loadLeadershipData,
  loadMinistriesData, 
  loadTestimonialsData,
  loadMemberBenefitsData, 
  loadActivitiesData, 
  loadFaqData, 
  loadResourcesData 
} from '../utils/staticDataLoader';

const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Cache for static data loaded from JSON (Decap-managed content)
const staticDataCache = {
  leadership: null,
  ministries: null,
  testimonials: null,
  memberBenefits: null,
  activities: null,
  faq: null,
  resources: null
};

const getLeadershipDataFromSource = async () => {
  if (staticDataCache.leadership) {
    return staticDataCache.leadership;
  }

  const loaded = await loadLeadershipData();
  if (loaded && typeof loaded === 'object') {
    staticDataCache.leadership = loaded;
    return loaded;
  }

  // Legacy hardcoded fallback to keep UI resilient if JSON content is unavailable.
  return leadershipData;
};

export const dataService = {
  // Leadership
  getLeadershipBoard: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.executiveBoard || [])
        .catch(() => leadershipData.executiveBoard);
    }
    const data = await getLeadershipDataFromSource();
    return data.executiveBoard || leadershipData.executiveBoard;
  },
  
  getLeadershipAdvisers: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.spiritualAdvisers || [])
        .catch(() => leadershipData.spiritualAdvisers);
    }
    const data = await getLeadershipDataFromSource();
    return data.spiritualAdvisers || leadershipData.spiritualAdvisers;
  },
  
  getLeadershipCoordinations: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.ministryCoordinations || [])
        .catch(() => leadershipData.ministryCoordinations);
    }
    const data = await getLeadershipDataFromSource();
    return data.ministryCoordinations || leadershipData.ministryCoordinations;
  },

  getLeadershipTrainingPrograms: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.trainingPrograms || [])
        .catch(() => leadershipData.trainingPrograms || []);
    }
    const data = await getLeadershipDataFromSource();
    return data.trainingPrograms || leadershipData.trainingPrograms || [];
  },

  // Ministries
  getMinistries: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/ministries`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => {
          if (staticDataCache.ministries) return staticDataCache.ministries;
          return ministriesDataFallback;
        });
    }
    // Load from JSON file (Decap CMS) with fallback to hardcoded data
    if (staticDataCache.ministries) {
      return staticDataCache.ministries;
    }
    const data = await loadMinistriesData();
    if (data?.ministries) {
      staticDataCache.ministries = data.ministries;
      return data.ministries;
    }
    return ministriesDataFallback;
  },

  // Resources
  getResources: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/resources`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => {
          if (staticDataCache.resources) return staticDataCache.resources;
          return resourcesDataFallback;
        });
    }
    // Load from JSON file (Decap CMS) with fallback to hardcoded data
    if (staticDataCache.resources) {
      return staticDataCache.resources;
    }
    const data = await loadResourcesData();
    if (data?.resources) {
      staticDataCache.resources = data.resources;
      return data.resources;
    }
    return resourcesDataFallback;
  },

  // Testimonials (Decap CMS managed)
  getTestimonials: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/testimonials`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => []);
    }
    if (staticDataCache.testimonials) {
      return staticDataCache.testimonials;
    }
    const data = await loadTestimonialsData();
    if (data?.testimonials) {
      staticDataCache.testimonials = data.testimonials;
      return data.testimonials;
    }
    return [];
  },

  // Member Benefits
  getMemberBenefits: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/member-benefits`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => {
          if (staticDataCache.memberBenefits) return staticDataCache.memberBenefits;
          return memberBenefitsDataFallback;
        });
    }
    // Load from JSON file (Decap CMS) with fallback to hardcoded data
    if (staticDataCache.memberBenefits) {
      return staticDataCache.memberBenefits;
    }
    const data = await loadMemberBenefitsData();
    if (data?.benefits) {
      staticDataCache.memberBenefits = data.benefits;
      return data.benefits;
    }
    return memberBenefitsDataFallback;
  },

  // Activities & Programs
  getWhatWeDo: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.whatWeDo || [])
        .catch(() => {
          if (staticDataCache.activities) return staticDataCache.activities;
          return activitiesDataFallback.whatWeDo;
        });
    }
    // Load from JSON file (Decap CMS) with fallback to hardcoded data
    if (staticDataCache.activities) {
      return staticDataCache.activities;
    }
    const data = await loadActivitiesData();
    if (data?.whatWeDo) {
      staticDataCache.activities = data.whatWeDo;
      return data.whatWeDo;
    }
    return activitiesDataFallback.whatWeDo;
  },
  
  getProgramsList: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.programs || [])
        .catch(() => activitiesDataFallback.programs);
    }
    return activitiesDataFallback.programs;
  },
  
  getCommunitiesServed: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.communityServed || [])
        .catch(() => activitiesDataFallback.communityServed);
    }
    return activitiesDataFallback.communityServed;
  },
  
  getObjectives: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.objectives || [])
        .catch(() => activitiesDataFallback.objectives);
    }
    return activitiesDataFallback.objectives;
  },

  // Events
  getEvents: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/events`)
        .then(res => res.json())
        .then(data => data.data || eventsData)
        .catch(() => eventsData);
    }
    return eventsData;
  },
  
  getUpcomingEvents: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/events?type=upcoming`)
        .then(res => res.json())
        .then(data => data.data || eventsData.upcomingEvents)
        .catch(() => eventsData.upcomingEvents);
    }
    return eventsData.upcomingEvents;
  },
  
  getPastEvents: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/events?type=past`)
        .then(res => res.json())
        .then(data => data.data || eventsData.pastEvents)
        .catch(() => eventsData.pastEvents);
    }
    return eventsData.pastEvents;
  },
  
  getEventById: (id) => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/events/${id}`)
        .then(res => res.json())
        .then(data => data.data || null)
        .catch(() => [
          ...eventsData.upcomingEvents,
          ...eventsData.pastEvents
        ].find(e => e.id === id));
    }
    return [
      ...eventsData.upcomingEvents,
      ...eventsData.pastEvents
    ].find(e => e.id === id);
  },

  // FAQ
  getAllFAQs: async () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/faq`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => {
          if (staticDataCache.faq) return staticDataCache.faq;
          return faqDataFallback;
        });
    }
    // Load from JSON file (Decap CMS) with fallback to hardcoded data
    if (staticDataCache.faq) {
      return staticDataCache.faq;
    }
    const data = await loadFaqData();
    if (data?.faqs) {
      staticDataCache.faq = data.faqs;
      return data.faqs;
    }
    return faqDataFallback;
  },

  getFAQById: async (id) => {
    const faqs = await dataService.getAllFAQs();
    return faqs.find(f => f.id === id);
  },

  getFAQsByCategory: async (category) => {
    const faqs = await dataService.getAllFAQs();
    return faqs.filter(f => f.category === category);
  }
};

export default dataService;
