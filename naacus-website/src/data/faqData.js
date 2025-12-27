/**
 * FAQ Knowledge Base for NAACUS AI Chatbot
 * 
 * This file contains frequently asked questions and answers about NAACUS
 * organized by categories for better chatbot performance.
 */

export const faqCategories = {
  ABOUT: 'about',
  MEMBERSHIP: 'membership',
  EVENTS: 'events',
  PROGRAMS: 'programs',
  CONTACT: 'contact',
  GENERAL: 'general'
};

export const faqData = [
  // ABOUT NAACUS
  {
    id: 'about-1',
    category: faqCategories.ABOUT,
    question: 'What is NAACUS?',
    keywords: ['what is naacus', 'about naacus', 'naacus meaning', 'organization'],
    answer: 'NAACUS stands for the National Association of African Catholics in the United States. We unite African Catholic communities across the nation to promote faith and heritage, strengthen families, and cultivate leaders—ensuring full participation in the life of the Church in the U.S. while supporting the Church in Africa.'
  },
  {
    id: 'about-2',
    category: faqCategories.ABOUT,
    question: 'What is NAACUS\'s mission?',
    keywords: ['mission', 'purpose', 'goal', 'objective'],
    answer: 'Our mission is to gather African Catholic communities in the U.S., promote their faith, and ensure their full and active participation in the life of the Church. We work to build a vibrant and visible African Catholic community that contributes its gifts to the Church and society.'
  },
  {
    id: 'about-3',
    category: faqCategories.ABOUT,
    question: 'What is NAACUS\'s motto?',
    keywords: ['motto', 'slogan', 'tagline'],
    answer: 'Our motto is "Together with Christ" - uniting African Catholic communities across the United States in faith and fellowship.'
  },
  {
    id: 'about-4',
    category: faqCategories.ABOUT,
    question: 'Who does NAACUS serve?',
    keywords: ['who serve', 'community', 'members', 'target audience'],
    answer: 'NAACUS serves African Catholic communities including immigrants, migrants, refugees, students, professionals, families, elders, and the African diaspora in the United States.'
  },
  {
    id: 'about-5',
    category: faqCategories.ABOUT,
    question: 'What does NAACUS do?',
    keywords: ['activities', 'what do', 'services', 'programs'],
    answer: 'NAACUS focuses on five key areas: (1) Pastoral Care & Parish Connection, (2) Heritage & Culture Awareness, (3) Family Life & Vocations, (4) Evangelization & Catechesis, and (5) Collaboration & Advocacy for social justice.'
  },

  // MEMBERSHIP
  {
    id: 'membership-1',
    category: faqCategories.MEMBERSHIP,
    question: 'How can I become a member?',
    keywords: ['join', 'membership', 'become member', 'sign up', 'register'],
    answer: 'You can become a member by filling out our membership form available on our website. Visit the Membership section or contact us at info@naacus.org for more information about membership benefits and requirements.'
  },
  {
    id: 'membership-2',
    category: faqCategories.MEMBERSHIP,
    question: 'What are the benefits of membership?',
    keywords: ['benefits', 'membership benefits', 'why join', 'advantages'],
    answer: 'NAACUS membership provides opportunities for spiritual growth, cultural connection, leadership development, networking with other African Catholics, access to resources, and the ability to contribute to the African Catholic community in the United States.'
  },
  {
    id: 'membership-3',
    category: faqCategories.MEMBERSHIP,
    question: 'Is there a membership fee?',
    keywords: ['fee', 'cost', 'price', 'membership fee', 'dues'],
    answer: 'For information about membership fees and dues, please contact us at info@naacus.org or visit the Membership section on our website.'
  },

  // EVENTS & CONFERENCE
  {
    id: 'events-1',
    category: faqCategories.EVENTS,
    question: 'When is the next NAACUS conference?',
    keywords: ['conference', 'next conference', 'when conference', 'biennial', '2027'],
    answer: 'NAACUS hosts a biennial national conference. The next conference is NAACUS 2027. Please subscribe to our newsletter or check our website regularly for updates on dates, location, and registration details.'
  },
  {
    id: 'events-2',
    category: faqCategories.EVENTS,
    question: 'What happens at the NAACUS conference?',
    keywords: ['conference activities', 'what at conference', 'conference program'],
    answer: 'The NAACUS conference features Unity in Christ, evangelization programs, celebration of African Catholic culture, workshops, leadership formation, community gatherings, and opportunities for fellowship and networking among African Catholic communities.'
  },
  {
    id: 'events-3',
    category: faqCategories.EVENTS,
    question: 'How was NAACUS 2025?',
    keywords: ['2025', 'last conference', 'previous conference', 'july 2025'],
    answer: 'NAACUS 2025 in July 2025 was a historic success with record attendance of over 1,500 participants! It featured inspiring programs, cultural celebrations, and significant community impact. Check out our NAACUS 2025 section to see photos, videos, and accomplishments.'
  },
  {
    id: 'events-4',
    category: faqCategories.EVENTS,
    question: 'Are there other events besides the conference?',
    keywords: ['other events', 'workshops', 'gatherings', 'activities'],
    answer: 'Yes! In addition to our biennial conference, NAACUS organizes community gatherings, workshops, leadership formation programs, and various fellowship activities throughout the year. Check our Events and Programs sections for upcoming activities.'
  },

  // PROGRAMS
  {
    id: 'programs-1',
    category: faqCategories.PROGRAMS,
    question: 'What programs does NAACUS offer?',
    keywords: ['programs', 'offerings', 'services'],
    answer: 'NAACUS offers programs in pastoral care and parish connection, heritage and culture awareness, family life and vocations support, evangelization and catechesis, and collaboration with dioceses and advocacy for social justice.'
  },
  {
    id: 'programs-2',
    category: faqCategories.PROGRAMS,
    question: 'How can I get involved with NAACUS?',
    keywords: ['get involved', 'volunteer', 'participate', 'help'],
    answer: 'You can get involved by becoming a member, attending our events, volunteering for programs, joining our ministries, or supporting our advocacy efforts. Visit our Volunteer page or contact us at info@naacus.org to learn about current opportunities.'
  },
  {
    id: 'programs-3',
    category: faqCategories.PROGRAMS,
    question: 'Does NAACUS support families?',
    keywords: ['family', 'families', 'family life', 'family support'],
    answer: 'Yes! Family Life & Vocations is one of our core focus areas. We work to build up family life, nurture vocations, and support African Catholic families in their faith journey and community participation.'
  },

  // CONTACT & GENERAL
  {
    id: 'contact-1',
    category: faqCategories.CONTACT,
    question: 'How can I contact NAACUS?',
    keywords: ['contact', 'email', 'reach', 'get in touch', 'phone'],
    answer: 'You can contact NAACUS by email at info@naacus.org or through our contact form on the website. We\'re here to help and answer any questions you may have!'
  },
  {
    id: 'contact-2',
    category: faqCategories.CONTACT,
    question: 'How do I subscribe to the newsletter?',
    keywords: ['newsletter', 'subscribe', 'email updates', 'stay informed'],
    answer: 'You can subscribe to our newsletter through the Newsletter section on our website. Simply enter your email address, and you\'ll receive regular updates about NAACUS events, programs, and community news.'
  },
  {
    id: 'general-1',
    category: faqCategories.GENERAL,
    question: 'Does NAACUS have social media?',
    keywords: ['social media', 'facebook', 'twitter', 'instagram', 'follow'],
    answer: 'For information about NAACUS social media presence, please visit our website or contact us at info@naacus.org.'
  },
  {
    id: 'general-2',
    category: faqCategories.GENERAL,
    question: 'Can I make a donation to NAACUS?',
    keywords: ['donate', 'donation', 'contribute', 'support financially'],
    answer: 'Thank you for your interest in supporting NAACUS! For information about donations and how to contribute to our mission, please contact us at info@naacus.org.'
  },
  {
    id: 'general-3',
    category: faqCategories.GENERAL,
    question: 'What resources does NAACUS provide?',
    keywords: ['resources', 'materials', 'brochures', 'documents'],
    answer: 'NAACUS provides various resources including brochures, newsletters, membership forms, and links to partner organizations. Visit our Resources section to access these materials and learn more.'
  },
  {
    id: 'general-4',
    category: faqCategories.GENERAL,
    question: 'Does NAACUS support multiple languages?',
    keywords: ['language', 'french', 'bilingual', 'translation'],
    answer: 'Yes! Our website supports multiple languages including English and French. You can switch languages using the language selector in the navigation menu.'
  }
];

/**
 * Default responses for when no FAQ match is found
 */
export const defaultResponses = {
  noMatch: "I'd be happy to help! Could you rephrase your question? For immediate assistance, you can also contact us at info@naacus.org or call our office.",
  greeting: "Hello! I'm the NAACUS virtual assistant. I can help answer questions about our organization, membership, events, programs, and more. How can I assist you today?",
  fallback: "I'm here to help with questions about NAACUS. You can ask me about our mission, membership, upcoming events, programs, or how to get involved. What would you like to know?"
};

/**
 * Quick action buttons for common queries
 */
export const quickActions = [
  { id: 'qa-1', label: 'About NAACUS', question: 'What is NAACUS?' },
  { id: 'qa-2', label: 'Join Us', question: 'How can I become a member?' },
  { id: 'qa-3', label: 'Next Conference', question: 'When is the next conference?' },
  { id: 'qa-4', label: 'Contact Info', question: 'How can I contact NAACUS?' }
];

export default faqData;
