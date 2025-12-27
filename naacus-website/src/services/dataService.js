/**
 * Data Service Layer
 * Provides centralized access to all mock data
 * Easy to transition to API calls in the future
 */

import { leadershipData } from '../data/leadershipData';
import { ministriesData } from '../data/ministriesData';
import { testimonialData } from '../data/testimonialData';
import { memberBenefitsData } from '../data/memberBenefitsData';
import { activitiesData } from '../data/activitiesData';
import { eventsData } from '../data/eventsData';
import { faqData } from '../data/faqData';

export const dataService = {
  // Leadership
  getLeadershipBoard: () => leadershipData.executiveBoard,
  getLeadershipAdvisers: () => leadershipData.spiritualAdvisers,
  getLeadershipCoordinations: () => leadershipData.ministryCoordinations,

  // Ministries
  getMinistries: () => ministriesData,

  // Testimonials
  getTestimonials: () => testimonialData,

  // Member Benefits
  getMemberBenefits: () => memberBenefitsData,

  // Activities & Programs
  getWhatWeDo: () => activitiesData.whatWeDo,
  getProgramsList: () => activitiesData.programs,
  getCommunitiesServed: () => activitiesData.communityServed,
  getObjectives: () => activitiesData.objectives,

  // Events
  getEvents: () => eventsData,
  getUpcomingEvents: () => eventsData.upcomingEvents,
  getPastEvents: () => eventsData.pastEvents,
  getEventById: (id) => [
    ...eventsData.upcomingEvents,
    ...eventsData.pastEvents
  ].find(e => e.id === id),

  // FAQ
  getAllFAQs: () => faqData,
  getFAQById: (id) => faqData.find(f => f.id === id),
  getFAQsByCategory: (category) => faqData.filter(f => f.category === category)
};

export default dataService;
