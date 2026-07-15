/**
 * Resources Mock Data
 */

export const resourcesData = [
  {
    id: 1,
    iconType: 'document',
    title: 'NAACUS Brochure',
    description: 'Download our brochure to learn more about NAACUS mission, objectives, and how to get involved.',
    buttonText: 'Request Brochure',
    actionType: 'section',
    actionTarget: 'contact'
  },
  {
    id: 2,
    iconType: 'news',
    title: 'Newsletters',
    description: 'Stay updated with our latest newsletters featuring community news, events, and spiritual reflections.',
    buttonText: 'View Newsletters',
    actionType: 'route',
    actionTarget: '/newsletters'
  },
  {
    id: 3,
    iconType: 'document',
    title: 'Advocacy Documents',
    description: 'Access our advocacy resources supporting African Catholics and promoting social justice.',
    buttonText: 'Request Documents',
    actionType: 'section',
    actionTarget: 'contact'
  },
  {
    id: 4,
    iconType: 'form',
    title: 'Women Ministry Leader Contact',
    description: 'Connect with the Women\'s Ministry Coordinator for ministry activities and support.',
    buttonText: 'Email Women Ministry',
    actionType: 'external',
    actionTarget: 'mailto:ifeoma.uzoh-anigbogu@naacus.org'
  },
  {
    id: 5,
    iconType: 'form',
    title: 'Youth Ministry Leader Contact',
    description: 'Reach out to the Youth Ministry Coordinator for youth programs and engagement.',
    buttonText: 'Email Youth Ministry',
    actionType: 'external',
    actionTarget: 'mailto:juliet.njoku@naacus.org'
  },
  {
    id: 6,
    iconType: 'form',
    title: 'Men Ministry Leader Contact',
    description: 'Men\'s Ministry leadership role is currently open. Contact NAACUS to get involved.',
    buttonText: 'Contact NAACUS',
    actionType: 'section',
    actionTarget: 'contact'
  },
  {
    id: 7,
    iconType: 'document',
    title: 'Suicide Prevention Support',
    description: 'If you or someone you know is in crisis, contact immediate support through 988 Lifeline.',
    buttonText: 'Open 988 Lifeline',
    actionType: 'external',
    actionTarget: 'https://988lifeline.org/'
  },
  {
    id: 8,
    iconType: 'news',
    title: 'Catholic Prayer App',
    description: 'Explore guided Catholic prayer resources through a trusted prayer app.',
    buttonText: 'Open Prayer App',
    actionType: 'external',
    actionTarget: 'https://hallow.com/'
  },
];

export const partnersData = [
  { id: 1, name: 'USCCB', fullName: 'United States Conference of Catholic Bishops' },
  { id: 2, name: 'Local Dioceses', fullName: 'Local Diocesan Offices' },
  { id: 3, name: 'African & Haitian Ministries', fullName: 'African and Haitian Catholic Ministries' },
  { id: 4, name: 'National Catholic Orgs', fullName: 'National Catholic Organizations' },
  { id: 5, name: 'Intercultural Programs', fullName: 'Intercultural Ministry Programs' },
];

export const getResources = () => resourcesData;
export const getPartners = () => partnersData;
