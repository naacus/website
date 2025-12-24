import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Input,
  Dropdown,
  Option,
  Checkbox,
  Textarea,
  Card,
  Spinner,
} from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import { submitVolunteerToSharePoint } from '../services/m365Service';
import { useAnalytics } from '../hooks/useAnalytics';

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
    color: '#d83b01',
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
    color: '#d83b01',
    marginBottom: '24px',
    display: 'block',
    paddingBottom: '12px',
    borderBottom: `2px solid #d83b01`,
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
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  submitButton: {
    marginTop: '32px',
    width: '100%',
    height: '56px',
    fontSize: '1.15rem',
    fontWeight: '600',
    backgroundColor: '#d83b01',
    '&:hover': {
      backgroundColor: '#c23600',
    },
  },
  successMessage: {
    ...shorthands.padding('24px'),
    backgroundColor: '#fef0e6',
    ...shorthands.borderRadius('8px'),
    textAlign: 'center',
    marginTop: '24px',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#d83b01',
    marginBottom: '12px',
    display: 'block',
  },
  successText: {
    fontSize: '1.05rem',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.6',
    display: 'block',
  },
});

function VolunteerPage() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackForm, trackVolunteerCTA } = useAnalytics();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    languagesSpoken: '',
    skills: '',
    volunteerInterests: [],
    availability: [],
    timePreference: '',
    hoursPerMonth: '1-5',
    previousExperience: '',
    preferredRole: '',
    backgroundCheckConsent: false,
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    specialSkills: '',
    whyVolunteer: '',
  });

  useEffect(() => {
    trackForm('VolunteerForm', 'form_start');
  }, [trackForm]);

  const volunteerInterestOptions = [
    { key: 'Event Planning & Coordination', label: t('volunteer.interestEventPlanning') },
    { key: 'Youth & Children Programs', label: t('volunteer.interestYouth') },
    { key: 'Administrative Support', label: t('volunteer.interestAdmin') },
    { key: 'Communications & Social Media', label: t('volunteer.interestComms') },
    { key: 'Fundraising', label: t('volunteer.interestFundraising') },
    { key: 'Community Outreach', label: t('volunteer.interestOutreach') },
    { key: 'Translation Services', label: t('volunteer.interestTranslation') },
    { key: 'Technology & Website', label: t('volunteer.interestTech') },
    { key: 'Hospitality & Welcoming', label: t('volunteer.interestHospitality') },
    { key: 'Music & Liturgy', label: t('volunteer.interestMusic') },
    { key: 'Education & Tutoring', label: t('volunteer.interestEducation') },
    { key: 'Prayer & Spiritual Support', label: t('volunteer.interestPrayer') },
  ];

  const availabilityOptions = [
    { key: 'Monday', label: t('volunteer.monday') },
    { key: 'Tuesday', label: t('volunteer.tuesday') },
    { key: 'Wednesday', label: t('volunteer.wednesday') },
    { key: 'Thursday', label: t('volunteer.thursday') },
    { key: 'Friday', label: t('volunteer.friday') },
    { key: 'Saturday', label: t('volunteer.saturday') },
    { key: 'Sunday', label: t('volunteer.sunday') },
  ];

  const relationshipOptions = [
    { key: 'Spouse', label: t('volunteer.relationshipOptions.spouse') },
    { key: 'Child', label: t('volunteer.relationshipOptions.child') },
    { key: 'Parent', label: t('volunteer.relationshipOptions.parent') },
    { key: 'Sibling', label: t('volunteer.relationshipOptions.sibling') },
    { key: 'Grandparent', label: t('volunteer.relationshipOptions.grandparent') },
    { key: 'Grandchild', label: t('volunteer.relationshipOptions.grandchild') },
    { key: 'Friend', label: t('volunteer.relationshipOptions.friend') },
    { key: 'Other', label: t('volunteer.relationshipOptions.other') },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    trackForm('VolunteerForm', 'form_submit', {
      email: formData.email,
      interests: formData.volunteerInterests
    });
    trackVolunteerCTA('Volunteer Form Submitted', 'volunteer_form_submission');
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to Microsoft 365 SharePoint
      const result = await submitVolunteerToSharePoint(formData);
      
      if (result.success) {
        console.log('Volunteer form submitted successfully to SharePoint:', result.data);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Error submitting volunteer form:', err);
      setError(err.message || 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PageWrapper>
        <div className={styles.successMessage}>
          <Text className={styles.successTitle}>{t('volunteer.successTitle')}</Text>
          <Text className={styles.successText}>
            {t('volunteer.successMessage')}
          </Text>
          <Button
            appearance="primary"
            size="large"
            onClick={() => window.location.href = '/'}
            style={{ 
              marginTop: '24px',
              backgroundColor: '#d83b01',
            }}
          >
            {t('volunteer.returnHome')}
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <Text as="h1" className={styles.title}>{t('volunteer.title')}</Text>
          <Text className={styles.subtitle}>
            {t('volunteer.subtitle')}
          </Text>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.personalInfo')}</Text>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.firstName')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.lastName')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.email')} <span className={styles.required}>{t('volunteer.required')}</span>
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
                  {t('volunteer.phone')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.city')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.state')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  required
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.zipCode')}</label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Skills & Background */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.skillsExperience')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.languagesSpoken')}</label>
                <Input
                  placeholder={t('volunteer.languagesPlaceholder')}
                  value={formData.languagesSpoken}
                  onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.professionalSkills')}</label>
                <Textarea
                  placeholder={t('volunteer.professionalSkillsPlaceholder')}
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  rows={3}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.previousExperience')}</label>
                <Textarea
                  placeholder={t('volunteer.previousExperiencePlaceholder')}
                  value={formData.previousExperience}
                  onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                  rows={3}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.specialSkills')}</label>
                <Textarea
                  placeholder={t('volunteer.specialSkillsPlaceholder')}
                  value={formData.specialSkills}
                  onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Volunteer Interests */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.volunteerInterests')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>
                  {t('volunteer.areasOfInterest')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <div className={styles.checkboxGroup}>
                  {volunteerInterestOptions.map((option) => (
                    <Checkbox
                      key={option.key}
                      label={option.label}
                      checked={formData.volunteerInterests.includes(option.key)}
                      onChange={(e, data) => handleCheckboxChange('volunteerInterests', option.key, data.checked)}
                    />
                  ))}
                </div>
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>{t('volunteer.preferredRole')}</label>
                <Textarea
                  placeholder={t('volunteer.preferredRolePlaceholder')}
                  value={formData.preferredRole}
                  onChange={(e) => handleInputChange('preferredRole', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Availability */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.availability')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>
                  {t('volunteer.daysAvailable')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <div className={styles.checkboxGroup}>
                  {availabilityOptions.map((option) => (
                    <Checkbox
                      key={option.key}
                      label={option.label}
                      checked={formData.availability.includes(option.key)}
                      onChange={(e, data) => handleCheckboxChange('availability', option.key, data.checked)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.timePreference')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Dropdown
                  value={formData.timePreference}
                  onOptionSelect={(e, data) => handleInputChange('timePreference', data.optionValue)}
                  placeholder={t('volunteer.timePlaceholder')}
                >
                  <Option value="morning">{t('volunteer.timeMorning')}</Option>
                  <Option value="afternoon">{t('volunteer.timeAfternoon')}</Option>
                  <Option value="evening">{t('volunteer.timeEvening')}</Option>
                  <Option value="flexible">{t('volunteer.timeFlexible')}</Option>
                </Dropdown>
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.hoursPerMonth')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Dropdown
                  value={formData.hoursPerMonth}
                  onOptionSelect={(e, data) => handleInputChange('hoursPerMonth', data.optionValue)}
                >
                  <Option value="1-5">{t('volunteer.hours1to5')}</Option>
                  <Option value="6-10">{t('volunteer.hours6to10')}</Option>
                  <Option value="11-20">{t('volunteer.hours11to20')}</Option>
                  <Option value="20+">{t('volunteer.hours20plus')}</Option>
                </Dropdown>
              </div>
            </div>
          </Card>

          {/* Emergency Contact & Consent */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.emergencyConsent')}</Text>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.emergencyContactName')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  required
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.relationship')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Dropdown
                  required
                  value={formData.emergencyRelationship}
                  onOptionSelect={(e, data) => handleInputChange('emergencyRelationship', data.optionValue || '')}
                >
                  <Option value="">Select a relationship</Option>
                  {relationshipOptions.map(option => (
                    <Option key={option.key} value={option.key}>{option.label}</Option>
                  ))}
                </Dropdown>
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('volunteer.emergencyPhone')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                />
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <Checkbox
                  label={t('volunteer.backgroundCheckConsent')}
                  checked={formData.backgroundCheckConsent}
                  onChange={(e, data) => handleInputChange('backgroundCheckConsent', data.checked)}
                />
              </div>
            </div>
          </Card>

          {/* Why Volunteer */}
          <Card className={styles.formCard}>
            <Text className={styles.sectionTitle}>{t('volunteer.tellUsMore')}</Text>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label className={styles.label}>
                  {t('volunteer.whyVolunteer')} <span className={styles.required}>{t('volunteer.required')}</span>
                </label>
                <Textarea
                  required
                  placeholder={t('volunteer.whyVolunteerPlaceholder')}
                  value={formData.whyVolunteer}
                  onChange={(e) => handleInputChange('whyVolunteer', e.target.value)}
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
                {t('volunteer.submitting')}
              </>
            ) : (
              t('volunteer.submitButton')
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
              <Text style={{ fontWeight: '600' }}>{t('volunteer.errorLabel')}</Text>
              <Text>{error}</Text>
            </div>
          )}
        </form>
      </div>
    </PageWrapper>
  );
}

export default VolunteerPage;
