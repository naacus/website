/**
 * Membership Pricing Configuration
 * Defines all membership plans and pricing for NAACUS
 */

export const membershipPlans = {
  individual: {
    id: 'individual',
    name: 'Individual Membership',
    price: 20,
    billingPeriod: 'year', // Annual billing
    currency: 'USD',
    description: 'Individual membership registration',
    lookupKey: 'individual_membership_year',
    stripeProductId: process.env.REACT_APP_STRIPE_PRODUCT_ID_INDIVIDUAL,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_ID_INDIVIDUAL,
    features: [
      'Full access to member resources',
      'Monthly newsletters and updates',
      'Community event invitations',
      '24/7 member support',
      'Voting rights in organization',
      'Access to exclusive webinars',
    ],
  },
  groupSmall: {
    id: 'group_small',
    name: 'Group Membership (2-100 Members)',
    price: 200,
    billingPeriod: 'one-time',
    currency: 'USD',
    description: 'Group membership for 2 to 100 members',
    lookupKey: 'group_membership_2_100_onetime',
    stripeProductId: process.env.REACT_APP_STRIPE_PRODUCT_ID_GROUP_SMALL,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_ID_GROUP_SMALL,
    features: [
      'Membership for 2-100 members',
      'Shared organization account',
      'Group event invitations',
      'Dedicated support contact',
      'Organization directory listing',
      'Quarterly group reports',
    ],
  },
  groupLarge: {
    id: 'group_large',
    name: 'Group Membership (100+ Members)',
    price: 300,
    billingPeriod: 'one-time',
    currency: 'USD',
    description: 'Group membership for 100+ members',
    lookupKey: 'group_membership_100plus_onetime',
    stripeProductId: process.env.REACT_APP_STRIPE_PRODUCT_ID_GROUP_LARGE,
    stripePriceId: process.env.REACT_APP_STRIPE_PRICE_ID_GROUP_LARGE,
    features: [
      'Membership for 100+ members',
      'Shared organization account',
      'Priority event invitations',
      'Dedicated account manager',
      'Premium directory listing',
      'Monthly group reports',
      'Custom training sessions',
    ],
  },
};

/**
 * Get a plan by ID
 * @param {string} planId - The plan ID
 * @returns {Object} Plan object
 */
export const getPlanById = (planId) => {
  return membershipPlans[planId] || membershipPlans.individual;
};

/**
 * Get all available plans
 * @returns {Array} Array of all plans
 */
export const getAllPlans = () => {
  return Object.values(membershipPlans);
};

/**
 * Get individual membership plan
 * @returns {Object} Individual plan
 */
export const getIndividualPlan = () => {
  return membershipPlans.individual;
};

/**
 * Get group plans
 * @returns {Array} Array of group plans
 */
export const getGroupPlans = () => {
  return [membershipPlans.groupSmall, membershipPlans.groupLarge];
};

export default membershipPlans;
