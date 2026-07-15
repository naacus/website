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
import { ministriesData } from '../data/ministriesData';
import { testimonialData } from '../data/testimonialData';
import { memberBenefitsData } from '../data/memberBenefitsData';
import { activitiesData } from '../data/activitiesData';
import { eventsData } from '../data/eventsData';
import { faqData } from '../data/faqData';
import { resourcesData } from '../data/resourcesData';

const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API === 'true';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const dataService = {
  // Leadership
  getLeadershipBoard: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.executiveBoard || [])
        .catch(() => leadershipData.executiveBoard);
    }
    return leadershipData.executiveBoard;
  },
  
  getLeadershipAdvisers: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.spiritualAdvisers || [])
        .catch(() => leadershipData.spiritualAdvisers);
    }
    return leadershipData.spiritualAdvisers;
  },
  
  getLeadershipCoordinations: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.ministryCoordinations || [])
        .catch(() => leadershipData.ministryCoordinations);
    }
    return leadershipData.ministryCoordinations;
  },

  getLeadershipTrainingPrograms: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/leadership`)
        .then(res => res.json())
        .then(data => data.data?.trainingPrograms || [])
        .catch(() => leadershipData.trainingPrograms || []);
    }
    return leadershipData.trainingPrograms || [];
  },

  // Ministries
  getMinistries: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/ministries`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => ministriesData);
    }
    return ministriesData;
  },

  // Resources
  getResources: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/resources`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => resourcesData);
    }
    return resourcesData;
  },

  // Testimonials
  getTestimonials: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/testimonials`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => testimonialData);
    }
    return testimonialData;
  },

  // Member Benefits
  getMemberBenefits: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/member-benefits`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => memberBenefitsData);
    }
    return memberBenefitsData;
  },

  // Activities & Programs
  getWhatWeDo: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.whatWeDo || [])
        .catch(() => activitiesData.whatWeDo);
    }
    return activitiesData.whatWeDo;
  },
  
  getProgramsList: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.programs || [])
        .catch(() => activitiesData.programs);
    }
    return activitiesData.programs;
  },
  
  getCommunitiesServed: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.communityServed || [])
        .catch(() => activitiesData.communityServed);
    }
    return activitiesData.communityServed;
  },
  
  getObjectives: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/activities`)
        .then(res => res.json())
        .then(data => data.data?.objectives || [])
        .catch(() => activitiesData.objectives);
    }
    return activitiesData.objectives;
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
  getAllFAQs: () => {
    if (USE_BACKEND_API) {
      return fetch(`${BACKEND_URL}/api/data/faq`)
        .then(res => res.json())
        .then(data => data.data || [])
        .catch(() => faqData);
    }
    return faqData;
  },
  getFAQById: (id) => faqData.find(f => f.id === id),
  getFAQsByCategory: (category) => faqData.filter(f => f.category === category)
};

export default dataService;
