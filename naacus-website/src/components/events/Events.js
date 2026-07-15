import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { eventsData } from '../../data/eventsData';
import RegistrationDialog from '../RegistrationDialog';
import FeaturedEventCard from './FeaturedEventCard';
import EventCard from './EventCard';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#faf9f8',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    position: 'relative',
    background: `linear-gradient(135deg, #1a3a52 0%, #2d5a7b 50%, #3d6fa8 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('80px', '20px'),
    paddingTop: '120px',
    textAlign: 'center',
    marginBottom: '40px',
    overflow: 'hidden',
    '@media (min-width: 1200px)': {
      marginLeft: '40px',
      marginRight: '40px',
      ...shorthands.borderRadius('12px'),
    },
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: '#E8D4C0',
    color: '#1a3a52',
    fontSize: '0.9rem',
    fontWeight: '700',
    ...shorthands.padding('8px', '20px'),
    ...shorthands.borderRadius('30px'),
    marginBottom: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 15px rgba(232, 212, 192, 0.35)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    textAlign: 'center',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 768px)': {
      fontSize: '2.2rem',
    },
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '24px',
    fontWeight: '400',
    opacity: 0.95,
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
  },
  sectionContainer: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#1a3a52',
    position: 'relative',
    paddingBottom: '20px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '80px',
      height: '4px',
      backgroundColor: '#E8D4C0',
      ...shorthands.borderRadius('2px'),
    },
  },
  subsectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#1a3a52',
    position: 'relative',
    paddingBottom: '20px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '80px',
      height: '4px',
      backgroundColor: '#E8D4C0',
      ...shorthands.borderRadius('2px'),
    },
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('20px'),
  },
  noEvents: {
    textAlign: 'center',
    ...shorthands.padding('40px'),
    color: tokens.colorNeutralForeground2,
    fontSize: '1.1rem',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '40px',
    padding: '0 20px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 32px',
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#999999',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#2d5a7b',
    },
  },
  tabActive: {
    color: '#1a3a52',
    fontWeight: '700',
    backgroundColor: '#E8D4C0',
    ...shorthands.borderRadius('8px'),
  },
  tabBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a3a52',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '22px',
    height: '22px',
    ...shorthands.borderRadius('11px'),
    marginLeft: '8px',
    padding: '0 6px',
  },
  otherEventsTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '20px',
    marginTop: '8px',
    color: '#1a3a52',
    position: 'relative',
    paddingBottom: '10px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '45px',
      height: '3px',
      backgroundColor: '#E8D4C0',
      ...shorthands.borderRadius('2px'),
    },
  },
});

export function Events() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formMessage, setFormMessage] = useState(null); // { type: 'success' | 'error' | 'warning', message: string }
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const upcomingEvents = eventsData.upcomingEvents;
  const pastEvents = eventsData.pastEvents;

  // Find the 2027 event (featured event)
  const featuredEvent = upcomingEvents.find(event => event.year === 2027);
  const otherUpcomingEvents = upcomingEvents.filter(event => event.year !== 2027);

  // Cleanup effect to restore scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleOpenRegistration = (event) => {
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
    // Prevent page scroll when dialog opens
    document.body.style.overflow = 'hidden';
  };

  const handleCloseRegistration = () => {
    setRegistrationDialogOpen(false);
    setSelectedEvent(null);
    setRegistrationForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
    setFormMessage(null);
    setSubmissionSuccess(false);
    setIsSubmitting(false);
    // Restore page scroll
    document.body.style.overflow = 'auto';
  };

  const handleNewRegistration = () => {
    setSubmissionSuccess(false);
    setFormMessage(null);
    setRegistrationForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const handleFormChange = (field, value) => {
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitRegistration = async () => {
    setFormMessage(null);

    if (!registrationForm.firstName.trim()) {
      setFormMessage({ type: 'error', message: t('events.errors.firstNameRequired', 'First name is required') });
      return;
    }
    if (!registrationForm.lastName.trim()) {
      setFormMessage({ type: 'error', message: t('events.errors.lastNameRequired', 'Last name is required') });
      return;
    }
    if (!registrationForm.email.trim()) {
      setFormMessage({ type: 'error', message: t('events.errors.emailRequired', 'Email is required') });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationForm.email)) {
      setFormMessage({ type: 'error', message: t('events.errors.emailInvalid', 'Please enter a valid email address') });
      return;
    }

    try {
      setIsSubmitting(true);

      const registrationData = {
        eventTitle: selectedEvent.title,
        eventDate: selectedEvent.date,
        ...registrationForm,
        submittedAt: new Date().toISOString()
      };

      let response;
      try {
        // Wrap in a Promise to catch any synchronous errors from extensions
        response = await new Promise((resolve, reject) => {
          try {
            const fetchPromise = fetch(`${apiBaseUrl}/api/event-registration`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(registrationData),
            });
            resolve(fetchPromise);
          } catch (syncError) {
            // Extension threw synchronous error - treat as network error
            reject(new Error('Network error'));
          }
        });
      } catch (fetchError) {
        setFormMessage({
          type: 'error',
          message: t('events.errors.networkError', 'Network connection failed. Please check your internet connection and try again.'),
        });
        return;
      }

      // Check if fetch was blocked or encountered network error
      if (!response || response?.__fetchError || !response?.ok) {
        setFormMessage({
          type: 'error',
          message: t('events.errors.networkError', 'Network connection failed. Please check your internet connection and try again.'),
        });
        return;
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        setFormMessage({
          type: 'error',
          message: t('events.errors.submissionFailed', 'Failed to submit registration. Please try again.'),
        });
        return;
      }

      if (!response.ok || !result.success) {
        setFormMessage({
          type: 'error',
          message: result.error || t('events.errors.submissionFailed', 'Failed to submit registration. Please try again.'),
        });
        return;
      }

      setSubmissionSuccess(true);
      setFormMessage({
        type: 'success',
        message: t('events.success.registrationStored', 'Registration submitted. We will follow up via email.'),
      });
    } catch (error) {
      setFormMessage({ 
        type: 'error', 
        message: t('events.errors.submissionFailed', 'Failed to submit registration. Please try again.') 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Featured 2027 Event - Full Width - Always Visible */}
      {featuredEvent && (
        <FeaturedEventCard event={featuredEvent} onRegister={handleOpenRegistration} />
      )}

      <div className={styles.maxWidth}>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('events.upcomingEvents')}
            {upcomingEvents.length > 0 && (
              <span className={styles.tabBadge}>{upcomingEvents.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('past')}
          >
            {t('events.pastEvents')}
          </button>
        </div>

        {/* Upcoming Events Section */}
        {activeTab === 'upcoming' && (
          <div className={styles.sectionContainer} id="more-upcoming-events">
            {/* Other Upcoming Events */}
            {otherUpcomingEvents.length > 0 && (
              <>
                <h2 className={styles.subsectionTitle}>
                  {t('events.moreUpcomingEvents')}
                </h2>
                <div className={styles.eventsGrid}>
                  {otherUpcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} isUpcoming={true} onRegister={handleOpenRegistration} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Past Events Section */}
        {activeTab === 'past' && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.subsectionTitle}>
              {pastEvents.length} {t('events.pastEvents')}
            </h2>
            {pastEvents.length > 0 ? (
              <div className={styles.eventsGrid}>
                {pastEvents.map(event => (
                  <EventCard key={event.id} event={event} isUpcoming={false} onRegister={handleOpenRegistration} />
                ))}
              </div>
            ) : (
              <div className={styles.noEvents}>
                {t('events.noPastEvents')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <RegistrationDialog
        open={Boolean(selectedEvent && registrationDialogOpen)}
        selectedEvent={selectedEvent}
        submissionSuccess={submissionSuccess}
        formMessage={formMessage}
        registrationForm={registrationForm}
        isSubmitting={isSubmitting}
        onFormChange={handleFormChange}
        onSubmit={handleSubmitRegistration}
        onClose={handleCloseRegistration}
        onNewRegistration={handleNewRegistration}
      />
    </div>
  );
}