import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Input,
  Combobox,
  Dropdown,
  Option,
  Checkbox,
  Textarea,
  Card,
  Spinner,
  RadioGroup,
  Radio,
} from '@fluentui/react-components';
import { PageHeader, Section, Alert } from '../components/PageLayout';
import PageWrapper from '../components/PageWrapper';
import ParishFinder from '../components/ParishFinder';
import { submitMembershipToSharePoint } from '../services/m365Service';
import { useAnalytics } from '../hooks/useAnalytics';
import { fetchCountries, formatCountriesForDropdown } from '../services/countryService';

const useStyles = makeStyles({
  container: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding('0', '20px'),
  },
  formCard: {
    ...shorthands.padding('32px'),
    marginBottom: '24px',
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px'),
      marginBottom: '18px',
    },
  },
  formSectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '20px',
    display: 'block',
    paddingBottom: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
  },
  formFieldFull: {
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: '#d13438',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('10px'),
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('6px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  submitButton: {
    marginTop: '28px',
    marginBottom: '24px',
    width: '100%',
    height: '48px',
    fontSize: '1.05rem',
    fontWeight: '600',
  },
  formGridWithTopMargin: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
    marginTop: '12px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

function MembershipPage() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackPageViewEvent } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessBeforeRedirect, setShowSuccessBeforeRedirect] = useState(false);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    trackPageViewEvent('MembershipPage');
  }, [trackPageViewEvent]);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const [formData, setFormData] = useState({
    // Essential fields only
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipType: 'individual',
    paymentMethod: 'stripe', // 'stripe' or 'manual'
    planId: 'individual',
    organization: '', // For group memberships
    groupMemberCount: '', // For group memberships
    // Optional fields moved to profile completion later
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    parishName: '',
    diocese: '',
    community: '',
    parishCity: '',
    parishState: '',
    countryOfOrigin: '',
    languagesSpoken: [],
    yearsInUS: '',
    occupation: '',
    skills: '',
    ministryInterests: [],
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    communicationPreferences: [],
    hearAbout: '',
    whyJoin: '',
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const duesItemsForCheckout = t('donation.duesRegistrationPage.itemsList', {
    returnObjects: true,
    defaultValue: [],
  });

  const checkoutItemsWithStripeLinkId = useMemo(() => (
    Array.isArray(duesItemsForCheckout)
      ? duesItemsForCheckout.filter((item) => typeof item?.stripeLinkId === 'string' && item.stripeLinkId.trim())
      : []
  ), [duesItemsForCheckout]);

  const hasIndividualCheckout = checkoutItemsWithStripeLinkId.some((item) => item.id === 'membershipRegistration');
  const hasGroupSmallCheckout = checkoutItemsWithStripeLinkId.some((item) => item.id === 'groupMembership2to100');
  const hasGroupLargeCheckout = checkoutItemsWithStripeLinkId.some((item) => item.id === 'groupMembership100plus');

  const availableMembershipTypes = useMemo(() => ([
    hasIndividualCheckout ? 'individual' : null,
    hasGroupSmallCheckout ? 'group_small' : null,
    hasGroupLargeCheckout ? 'group_large' : null,
  ].filter(Boolean)), [hasIndividualCheckout, hasGroupSmallCheckout, hasGroupLargeCheckout]);

  const defaultAvailableMembershipType = availableMembershipTypes[0] || 'individual';

  // Filter countries based on search input
  const filteredCountries = countrySearch
    ? countryOptions.filter(option =>
        option.text.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : countryOptions;

  // Fetch countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const allCountries = await fetchCountries();
        const safeCountries = Array.isArray(allCountries) ? allCountries : [];
        const options = formatCountriesForDropdown(safeCountries);
        setCountryOptions(options);
      } catch (error) {
        console.error('Failed to load countries:', error);
        setCountryOptions([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    // Do not auto-update while checkout options are unavailable (e.g., translations still loading).
    if (availableMembershipTypes.length === 0) {
      return;
    }

    if (!availableMembershipTypes.includes(formData.membershipType)) {
      setFormData((prev) => {
        if (
          prev.membershipType === defaultAvailableMembershipType
          && prev.planId === defaultAvailableMembershipType
        ) {
          return prev;
        }

        return {
          ...prev,
          membershipType: defaultAvailableMembershipType,
          planId: defaultAvailableMembershipType,
        };
      });
    }
  }, [availableMembershipTypes, defaultAvailableMembershipType, formData.membershipType]);

  const ministryOptions = [
    { key: 'Youth Ministry', label: t('membership.ministryYouth') },
    { key: 'Music & Liturgy', label: t('membership.ministryMusic') },
    { key: 'Social Justice', label: t('membership.ministrySocialJustice') },
    { key: 'Community Outreach', label: t('membership.ministryCommunityOutreach') },
    { key: 'Education & Catechesis', label: t('membership.ministryEducation') },
    { key: 'Marriage & Family Life', label: t('membership.ministryMarriage') },
    { key: 'Cultural Events', label: t('membership.ministryCultural') },
    { key: 'Leadership & Governance', label: t('membership.ministryLeadership') },
  ];

  const communicationOptions = [
    { key: 'Email', label: t('membership.commEmail') },
    { key: 'Phone', label: t('membership.commPhone') },
    { key: 'Text Message', label: t('membership.commText') },
    { key: 'Mail', label: t('membership.commMail') },
  ];

  const hearAboutOptions = [
    { key: 'Friend or Family Member', label: t('membership.hearAboutOptions.friend') },
    { key: 'Website', label: t('membership.hearAboutOptions.website') },
    { key: 'Social Media', label: t('membership.hearAboutOptions.socialMedia') },
    { key: 'NAACUS Event', label: t('membership.hearAboutOptions.event') },
    { key: 'Church or Parish', label: t('membership.hearAboutOptions.church') },
    { key: 'News Media or Publication', label: t('membership.hearAboutOptions.media') },
    { key: 'Conference or Seminar', label: t('membership.hearAboutOptions.conference') },
    { key: 'Other', label: t('membership.hearAboutOptions.other') },
  ];

  const relationshipOptions = [
    { key: 'Spouse', label: t('membership.relationshipOptions.spouse') },
    { key: 'Child', label: t('membership.relationshipOptions.child') },
    { key: 'Parent', label: t('membership.relationshipOptions.parent') },
    { key: 'Sibling', label: t('membership.relationshipOptions.sibling') },
    { key: 'Grandparent', label: t('membership.relationshipOptions.grandparent') },
    { key: 'Grandchild', label: t('membership.relationshipOptions.grandchild') },
    { key: 'Friend', label: t('membership.relationshipOptions.friend') },
    { key: 'Other', label: t('membership.relationshipOptions.other') },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, option, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], option]
        : prev[field].filter(item => item !== option),
    }));
  };

  const handleParishSelect = (parishData) => {
    setFormData(prev => ({
      ...prev,
      parishName: parishData.parishName,
      parishCity: parishData.parishCity,
      parishState: parishData.parishState,
      diocese: parishData.diocese,
    }));
  };

  const openStripePaymentLink = (planId) => {
    const planToItemId = {
      individual: 'membershipRegistration',
      group_small: 'groupMembership2to100',
      group_large: 'groupMembership100plus',
    };

    const targetItemId = planToItemId[planId] || planToItemId.individual;
    const targetItem = checkoutItemsWithStripeLinkId.find((item) => item?.id === targetItemId);
    const targetLink = (targetItem?.stripeLinkId || '').trim();

    const targetUrl = /^https?:\/\//i.test(targetLink)
      ? targetLink
      : `https://buy.stripe.com/${targetLink.replace(/^\/+/, '')}`;

    try {
      const parsed = new URL(targetUrl);
      const isAllowed = parsed.protocol === 'https:' && ['donate.naacus.org', 'buy.stripe.com'].includes(parsed.hostname);
      if (!isAllowed) {
        throw new Error('Invalid Stripe payment URL configuration');
      }
      window.location.href = targetUrl;
    } catch (_urlError) {
      throw new Error('Payment link is not configured for this membership plan. Please contact support.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setShowSuccessBeforeRedirect(false);

    try {
      // Save to backend first; redirect only when persistence succeeds.
      const result = await submitMembershipToSharePoint(formData);
      if (!result?.success) {
        throw new Error(result?.error || 'Unable to save membership application. Please try again.');
      }

      // Persist submitted form details for post-checkout flows.
      sessionStorage.setItem('membershipData', JSON.stringify(formData));

      // Show confirmation feedback briefly before sending users to checkout.
      setShowSuccessBeforeRedirect(true);
      redirectTimeoutRef.current = window.setTimeout(() => {
        try {
          openStripePaymentLink(formData.planId);
        } catch (redirectError) {
          console.error('Error redirecting to payment:', redirectError);
          setShowSuccessBeforeRedirect(false);
          setError(redirectError.message || 'Unable to redirect to payment. Please try again.');
        }
      }, 1800);
    } catch (err) {
      console.error('Error submitting membership form:', err);
      setShowSuccessBeforeRedirect(false);
      setError(err.message || 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader 
        title={t('membership.title')}
        subtitle={t('membership.subtitle')}
      />

      <Section>
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
          {/* Simplified Essential Information Only */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.personalInfo')}</Text>
            <Text style={{ 
              fontSize: '0.95rem', 
              color: tokens.colorNeutralForeground2, 
              marginBottom: '20px',
              display: 'block'
            }}>
              Join NAACUS today with just a few essential details. You can complete your full profile later.
            </Text>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.firstName')} <span className={styles.required}>{t('membership.required')}</span>
                </label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.lastName')} <span className={styles.required}>{t('membership.required')}</span>
                </label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.email')} <span className={styles.required}>{t('membership.required')}</span>
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.phone')} <span className={styles.required}>{t('membership.required')}</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.dateOfBirth')}</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Address Information - Hidden */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.address')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>
                  {t('membership.streetAddress')}
                </label>
                <Input
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.city')}
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.state')}
                </label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('membership.zipCode')}
                </label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.country')}</label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Parish Information */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.parishInfo')}</Text>
            <ParishFinder onParishSelect={handleParishSelect} formData={formData} />
            <div className={styles.formGridWithTopMargin}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.community')}</label>
                <Input
                  value={formData.community}
                  onChange={(e) => handleInputChange('community', e.target.value)}
                  placeholder="e.g. Nigerian Catholic Community, Cameroon Catholic Community..."
                />
              </div>
            </div>
          </Card>

          {/* Background Information - Hidden */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.backgroundExperience')}</Text>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.countryOfOrigin')}</label>
                <Combobox
                  value={formData.countryOfOrigin}
                  input={{
                    onChange: (e) => setCountrySearch(e.target.value),
                    value: countrySearch,
                  }}
                  onOptionSelect={(e, data) => {
                    if (data.optionValue) {
                      handleInputChange('countryOfOrigin', data.optionValue);
                      setCountrySearch(data.optionValue);
                    }
                  }}
                  disabled={loadingCountries}
                  placeholder={loadingCountries ? 'Loading countries...' : 'Type to search'}
                >
                  {filteredCountries.map(option => (
                    <Option key={option.key} value={option.text}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.yearsInUS')}</label>
                <Input
                  type="number"
                  value={formData.yearsInUS}
                  onChange={(e) => handleInputChange('yearsInUS', e.target.value)}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.occupation')}</label>
                <Input
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.skills')}</label>
                <Textarea
                  placeholder={t('membership.skillsPlaceholder')}
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Membership Type & Interests - Hidden */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.membershipDetails')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>
                  {t('membership.membershipType')} <span className={styles.required}>{t('membership.required')}</span>
                </label>
                <RadioGroup
                  value={formData.membershipType}
                  onChange={(e) => {
                    const membershipType = e.currentTarget.value;
                    handleInputChange('membershipType', membershipType);
                    
                    // Update planId based on membership type
                    const planMapping = {
                      'individual': 'individual',
                      'group_small': 'group_small',
                      'group_large': 'group_large'
                    };
                    handleInputChange('planId', planMapping[membershipType] || 'individual');
                  }}
                >
                  {hasIndividualCheckout && <Radio value="individual" label="INDIVIDUAL MEMBERSHIP REGISTRATION = $20.00 per person" />}
                  {hasGroupSmallCheckout && <Radio value="group_small" label="GROUP MEMBERSHIP REGISTRATION: 2 to 100 members = $200.00 (one time fee)" />}
                  {hasGroupLargeCheckout && <Radio value="group_large" label="GROUP MEMBERSHIP REGISTRATION: 100+ members = $300.00 (one time fee)" />}
                </RadioGroup>
              </div>
              
              {/* Group Membership Fields - Show when group option selected */}
              {(formData.membershipType === 'group_small' || formData.membershipType === 'group_large') && (
                <>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label className={styles.label}>
                      {t('membership.organizationName') || 'Organization Name'} <span className={styles.required}>*</span>
                    </label>
                    <Input
                      required
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      placeholder={t('membership.organizationPlaceholder') || 'Enter organization name'}
                    />
                  </div>
                  <div className={`${styles.formField} ${styles.formFieldFull}`}>
                    <label className={styles.label}>
                      {t('membership.memberCount') || 'Number of Members'} <span className={styles.required}>*</span>
                    </label>
                    <Input
                      type="number"
                      required
                      min="2"
                      value={formData.groupMemberCount}
                      onChange={(e) => handleInputChange('groupMemberCount', e.target.value)}
                      placeholder={t('membership.memberCountPlaceholder') || 'Enter number of members'}
                    />
                  </div>
                </>
              )}
              
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.ministryInterests')}</label>
                <div className={styles.checkboxGroup}>
                  {ministryOptions.map((option) => (
                    <Checkbox
                      key={option.key}
                      label={option.label}
                      checked={formData.ministryInterests.includes(option.key)}
                      onChange={(e, data) => handleCheckboxChange('ministryInterests', option.key, data.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact - Hidden */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.emergencyContact')}</Text>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.contactName')}</label>
                <Input
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>{t('membership.relationship')}</label>
                <Dropdown
                  value={formData.emergencyRelationship}
                  onOptionSelect={(e, data) => handleInputChange('emergencyRelationship', data.optionValue || '')}
                >
                  <Option value="">Select a relationship</Option>
                  {relationshipOptions.map(option => (
                    <Option key={option.key} value={option.key}>{option.label}</Option>
                  ))}
                </Dropdown>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.emergencyPhone')}</label>
                <Input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('membership.additionalInfo')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.communicationPreferences')}</label>
                <div className={styles.checkboxGroup}>
                  {communicationOptions.map((option) => (
                    <Checkbox
                      key={option.key}
                      label={option.label}
                      checked={formData.communicationPreferences.includes(option.key)}
                      onChange={(e, data) => handleCheckboxChange('communicationPreferences', option.key, data.checked)}
                    />
                  ))}
                </div>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.hearAbout')}</label>
                <Dropdown
                  value={formData.hearAbout}
                  onOptionSelect={(e, data) => handleInputChange('hearAbout', data.optionValue || '')}
                >
                  <Option value="">Select an option</Option>
                  {hearAboutOptions.map(option => (
                    <Option key={option.key} value={option.key}>{option.label}</Option>
                  ))}
                </Dropdown>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('membership.whyJoin')}</label>
                <Textarea
                  placeholder={t('membership.whyJoinPlaceholder')}
                  value={formData.whyJoin}
                  onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Button
            appearance="primary"
            size="large"
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || showSuccessBeforeRedirect}
          >
            {isSubmitting ? (
              <>
                <Spinner size="tiny" style={{ marginRight: '8px' }} />
                {t('membership.submitting')}
              </>
            ) : showSuccessBeforeRedirect ? (
              t('membership.proceedPayment')
            ) : (
              t('membership.submitButton')
            )}
          </Button>

          {showSuccessBeforeRedirect && (
            <Alert 
              type="success"
              title={t('membership.successTitle')}
              message={`${t('membership.successMessage')} ${t('membership.proceedPayment')}...`}
            />
          )}

          {error && (
            <Alert 
              type="error"
              title={t('membership.errorLabel')}
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </form>
        </div>
      </Section>
    </PageWrapper>
  );
  }

export default MembershipPage;
