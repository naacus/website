import React, { useState, useEffect } from 'react';
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
import PageWrapper from '../components/PageWrapper';
import ParishFinder from '../components/ParishFinder';
import StripeCheckout from '../components/StripeCheckout';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { submitMembershipToSharePoint } from '../services/m365Service';
import { useAnalytics } from '../hooks/useAnalytics';
import { fetchCountries, formatCountriesForDropdown } from '../services/countryService';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
  },
  container: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto'),
  },
  header: {
    textAlign: 'center',
    ...shorthands.padding('40px', '0'),
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: tokens.colorBrandBackground,
    marginBottom: '16px',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  subtitle: {
    fontSize: '1.1rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    display: 'block',
  },
  formCard: {
    ...shorthands.padding('40px'),
    marginBottom: '30px',
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px'),
    },
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: tokens.colorBrandBackground,
    marginBottom: '24px',
    display: 'block',
    paddingBottom: '12px',
    borderBottom: `2px solid ${tokens.colorBrandBackground}`,
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('20px'),
    marginBottom: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  formFieldFull: {
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: '#d13438',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  submitButton: {
    marginTop: '32px',
    marginBottom: '30px',
    width: '100%',
    height: '56px',
    fontSize: '1.15rem',
    fontWeight: '600',
  },
  successMessage: {
    ...shorthands.padding('24px'),
    backgroundColor: '#dff6dd',
    ...shorthands.borderRadius('8px'),
    textAlign: 'center',
    marginTop: '24px',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#107c10',
    marginBottom: '12px',
    display: 'block',
  },
  successText: {
    fontSize: '1.05rem',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.6',
    display: 'block',
  },
  pricingCard: {
    ...shorthands.padding('24px', '32px'),
    marginBottom: '24px',
    backgroundColor: '#e6f5d0',
    ...shorthands.border('2px', 'solid', '#4a9900'),
    ...shorthands.borderRadius('12px'),
  },
  pricingTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0d196b',
    display: 'block',
    marginBottom: '12px',
  },
  pricingList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  pricingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('8px', '12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('8px'),
  },
  pricingLabel: {
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  pricingAmount: {
    fontWeight: '700',
    color: '#4a9900',
    fontSize: '1.05rem',
  },
  pricingNote: {
    fontSize: '0.875rem',
    color: tokens.colorNeutralForeground2,
    marginTop: '10px',
    display: 'block',
  },
  formGridWithTopMargin: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('20px'),
    marginBottom: '24px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

function MembershipPage() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackPageViewEvent } = useAnalytics();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    trackPageViewEvent('MembershipPage');
  }, [trackPageViewEvent]);
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
        const options = formatCountriesForDropdown(allCountries);
        setCountryOptions(options);
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // If paying with Stripe, save data and show checkout
      if (formData.paymentMethod === 'stripe') {
        sessionStorage.setItem('membershipData', JSON.stringify(formData));
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Otherwise, submit to Microsoft 365 SharePoint
      const result = await submitMembershipToSharePoint(formData);
      
      if (result.success) {
        console.log('Membership form submitted successfully to SharePoint:', result.data);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Error submitting membership form:', err);
      setError(err.message || 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    // If paying with Stripe, show checkout
    if (formData.paymentMethod === 'stripe') {
      return (
        <PageWrapper>
          <div className={styles.container}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h1 className={styles.title}>{t('membership.proceedPayment') || 'Complete Your Payment'}</h1>
              <p style={{ fontSize: '1.05rem', color: tokens.colorNeutralForeground2 }}>
                {t('membership.paymentInstructions') || 'You are registered as ' + formData.firstName + ' ' + formData.lastName}
              </p>
            </div>
            <StripeCheckout planId={formData.planId} />
          </div>
        </PageWrapper>
      );
    }

    // Otherwise show success message
    return (
      <PageWrapper>
        <div className={styles.successMessage}>
          <Text className={styles.successTitle}>{t('membership.successTitle')}</Text>
          <Text className={styles.successText}>
            {t('membership.successMessage')}
          </Text>
          <Button
            appearance="primary"
            size="large"
            onClick={() => window.location.href = '/'}
            style={{ marginTop: '24px' }}
          >
            {t('membership.returnHome')}
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <Text as="h1" className={styles.title}>{t('membership.title')}</Text>
          <Text className={styles.subtitle}>
            {t('membership.subtitle')}
          </Text>
        </div>

        {/* Membership Pricing Overview */}
        <Card className={styles.pricingCard}>
          <Text className={styles.pricingTitle}>
            💳 Membership Dues
          </Text>
          <div className={styles.pricingList}>
            <div className={styles.pricingRow}>
              <span className={styles.pricingLabel}>Individual Membership</span>
              <span className={styles.pricingAmount}>$20.00 / person</span>
            </div>
            <div className={styles.pricingRow}>
              <span className={styles.pricingLabel}>Group Membership (2–100 members)</span>
              <span className={styles.pricingAmount}>$200.00 one-time</span>
            </div>
            <div className={styles.pricingRow}>
              <span className={styles.pricingLabel}>Group Membership (100+ members)</span>
              <span className={styles.pricingAmount}>$300.00 one-time</span>
            </div>
          </div>
          <Text className={styles.pricingNote}>
            A one-time registration fee applies to new members. Secure online payment via credit/debit card (Stripe) is available, or choose manual payment and we will contact you with instructions.
          </Text>
        </Card>

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
                  <Radio value="individual" label="INDIVIDUAL MEMBERSHIP REGISTRATION = $20.00 per person" />
                  <Radio value="group_small" label="GROUP MEMBERSHIP REGISTRATION: 2 to 100 members = $200.00 (one time fee)" />
                  <Radio value="group_large" label="GROUP MEMBERSHIP REGISTRATION: 100+ members = $300.00 (one time fee)" />
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

          {/* Payment Method Selection */}
          <Card className={styles.formCard}>
            <PaymentMethodSelector
              value={formData.paymentMethod}
              onChange={(value) => handleInputChange('paymentMethod', value)}
              options={[
                {
                  id: 'stripe',
                  label: 'Pay Online with Credit/Debit Card',
                  description: 'Fast, secure payment via Stripe',
                },
                {
                  id: 'manual',
                  label: 'Manual Payment',
                  description: 'We will contact you with payment instructions',
                },
              ]}
            />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="tiny" style={{ marginRight: '8px' }} />
                {t('membership.submitting')}
              </>
            ) : (
              t('membership.submitButton')
            )}
          </Button>

          {error && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#fde7e9',
              borderRadius: '8px',
              color: '#d13438',
              textAlign: 'center',
            }}>
              <Text style={{ fontWeight: '600' }}>{t('membership.errorLabel')}</Text>
              <Text>{error}</Text>
            </div>
          )}
        </form>
      </div>
    </PageWrapper>
    );
  }

export default MembershipPage;
