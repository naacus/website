import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
} from '@fluentui/react-components';
import { 
  Calendar24Regular, 
  Location24Regular,
  ChevronRight24Regular
} from '@fluentui/react-icons';
import { eventsData } from '../data/eventsData';

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
  eventCard: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-4px)',
    },
  },
  eventYear: {
    display: 'inline-block',
    backgroundColor: '#E8D4C0',
    color: '#1a3a52',
    fontSize: '0.8rem',
    fontWeight: '700',
    ...shorthands.padding('6px', '12px'),
    marginBottom: '12px',
    width: 'fit-content',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1a3a52',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  eventDescription: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
    lineHeight: '1.6',
    flex: 1,
  },
  eventInfo: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('10px'),
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
  },
  infoIcon: {
    flexShrink: 0,
    marginTop: '2px',
    color: '#2d5a7b',
  },
  highlights: {
    marginBottom: '20px',
  },
  highlightsTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a3a52',
    marginBottom: '10px',
    display: 'block',
  },
  highlightsList: {
    listStyle: 'none',
    ...shorthands.padding('0'),
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('6px'),
  },
  highlightItem: {
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    paddingLeft: '20px',
    position: 'relative',
    '&::before': {
      content: '"✓"',
      position: 'absolute',
      left: '0',
      color: '#2d5a7b',
      fontWeight: '700',
    },
  },
  attendees: {
    fontSize: '0.9rem',
    color: '#1a3a52',
    marginBottom: '16px',
    fontWeight: '600',
  },
  ctaButton: {
    width: '100%',
    marginTop: 'auto',
    backgroundColor: '#2d5a7b',
    color: tokens.colorNeutralForegroundInverted,
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1a3a52',
    },
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
  featuredEventSection: {
    width: '100vw',
    position: 'relative',
    left: 'calc(-50vw + 50%)',
    marginTop: '50px',
    marginBottom: '40px',
  },
  featuredEventContainer: {
    position: 'relative',
    background: `linear-gradient(135deg, #1a3a52 0%, #2d5a7b 30%, #3d6fa8 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('60px', '20px'),
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 20px 60px rgba(26, 58, 82, 0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
    overflow: 'hidden',
    border: '1px solid rgba(232, 212, 192, 0.15)',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      right: '-10%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(232, 212, 192, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-5%',
      left: '-5%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(232, 212, 192, 0.06) 0%, transparent 70%)',
      borderRadius: '50%',
      pointerEvents: 'none',
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px'),
    },
  },
  featuredEventBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    backgroundColor: 'rgba(232, 212, 192, 0.25)',
    color: '#E8D4C0',
    fontSize: '0.7rem',
    fontWeight: '800',
    ...shorthands.padding('6px', '14px'),
    ...shorthands.borderRadius('50px'),
    marginBottom: '10px',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    border: '1px solid rgba(232, 212, 192, 0.3)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    zIndex: 2,
  },
  featuredEventTitle: {
    fontSize: '1.9rem',
    fontWeight: '800',
    marginBottom: '8px',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    zIndex: 2,
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
  },
  featuredEventDescription: {
    fontSize: '1rem',
    marginBottom: '18px',
    lineHeight: '1.5',
    opacity: 0.96,
    maxWidth: '850px',
    position: 'relative',
    zIndex: 2,
    fontWeight: '400',
    letterSpacing: '0.2px',
    margin: '0 auto 18px auto',
  },
  featuredEventInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    ...shorthands.gap('12px'),
    marginBottom: '18px',
    maxWidth: '100%',
    position: 'relative',
    zIndex: 2,
    margin: '0 auto 18px auto',
  },
  featuredEventInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    ...shorthands.padding('16px', '12px'),
    ...shorthands.borderRadius('12px'),
    border: '1px solid rgba(232, 212, 192, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  featuredInfoIcon: {
    fontSize: '1.5rem',
    color: '#E8D4C0',
  },
  featuredEventLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
    color: '#E8D4C0',
  },
  featuredEventValue: {
    fontSize: '1.1rem',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#ffffff',
  },
  featuredEventHighlights: {
    marginBottom: '14px',
    position: 'relative',
    zIndex: 2,
  },
  featuredHighlightsTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    opacity: 0.85,
    color: '#E8D4C0',
  },
  featuredHighlightsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('12px'),
    justifyItems: 'center',
  },
  featuredHighlightItem: {
    fontSize: '1.05rem',
    position: 'relative',
    lineHeight: '1.5',
    opacity: 0.95
  },
  featuredCtaButton: {
    backgroundColor: '#E8D4C0',
    color: '#1a3a52',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: '800',
    padding: '11px 32px',
    ...shorthands.borderRadius('12px'),
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    zIndex: 2,
    display: 'inline-flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    boxShadow: '0 8px 24px rgba(232, 212, 192, 0.3)',
    margin: '0 auto',
    '&:hover': {
      backgroundColor: '#ffffff',
      transform: 'translateY(-3px)',
      boxShadow: '0 14px 36px rgba(232, 212, 192, 0.4)',
    },
    '&:active': {
      transform: 'translateY(-1px)',
    },
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

  const upcomingEvents = eventsData.upcomingEvents;
  const pastEvents = eventsData.pastEvents;

  // Find the 2027 event (featured event)
  const featuredEvent = upcomingEvents.find(event => event.year === 2027);
  const otherUpcomingEvents = upcomingEvents.filter(event => event.year !== 2027);

  return (
    <div className={styles.container}>
      {/* Featured 2027 Event - Full Width - Always Visible */}
      {featuredEvent && (
        <div className={styles.featuredEventSection}>
          <FeaturedEventCard event={featuredEvent} />
        </div>
      )}

      <div className={styles.maxWidth}>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            {t('events.upcomingEvents')}
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
                    <EventCard key={event.id} event={event} isUpcoming={true} />
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
                  <EventCard key={event.id} event={event} isUpcoming={false} />
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
    </div>
  );
}

function EventCard({ event, isUpcoming }) {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleRegisterNow = () => {
    if (event.registrationLink && event.registrationLink !== '#') {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    } else {
      // If no registration link is available, show contact info
      alert(t('events.registrationNotAvailable', 'Registration is not yet available. Please contact us at info@naacus.org for more information.'));
    }
  };

  const handleViewDetails = () => {
    // For past events, could show more details or a modal
    // For now, you could implement this further
  };

  return (
    <div className={styles.eventCard}>
      <span className={styles.eventYear}>{event.year}</span>
      <h3 className={styles.eventTitle}>{event.title}</h3>
      <p className={styles.eventDescription}>{event.description}</p>

      <div className={styles.eventInfo}>
        <div className={styles.infoRow}>
          <Calendar24Regular className={styles.infoIcon} />
          <span>{event.date}</span>
        </div>
        <div className={styles.infoRow}>
          <Location24Regular className={styles.infoIcon} />
          <span>{event.location}</span>
        </div>
        {event.attendees && (
          <div className={styles.attendees}>
            {t('events.expectedAttendees')}: {event.attendees}
          </div>
        )}
      </div>

      {event.highlights && event.highlights.length > 0 && (
        <div className={styles.highlights}>
          <span className={styles.highlightsTitle}>{t('events.highlights')}</span>
          <ul className={styles.highlightsList}>
            {event.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className={styles.highlightItem}>
                {highlight}
              </li>
            ))}
            {event.highlights.length > 3 && (
              <li className={styles.highlightItem}>
                + {event.highlights.length - 3} {t('events.more')}
              </li>
            )}
          </ul>
        </div>
      )}

      {isUpcoming ? (
        <Button
          className={styles.ctaButton}
          appearance="primary"
          onClick={handleRegisterNow}
        >
          {t('events.registerNow')} <ChevronRight24Regular />
        </Button>
      ) : (
        <Button
          className={styles.ctaButton}
          appearance="secondary"
          onClick={handleViewDetails}
        >
          {t('events.viewDetails')} <ChevronRight24Regular />
        </Button>
      )}
    </div>
  );
}

function FeaturedEventCard({ event }) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div className={styles.featuredEventContainer}>
      <h2 className={styles.featuredEventTitle}>{event.title}</h2>
      <p className={styles.featuredEventDescription}>{event.description}</p>

      <div className={styles.featuredEventInfo}>
        <div className={styles.featuredEventInfoItem}>
          <Calendar24Regular className={styles.featuredInfoIcon} />
          <span className={styles.featuredEventLabel}>{t('events.dates')}</span>
          <span className={styles.featuredEventValue}>{event.date}</span>
        </div>
        <div className={styles.featuredEventInfoItem}>
          <Location24Regular className={styles.featuredInfoIcon} />
          <span className={styles.featuredEventLabel}>{t('events.location')}</span>
          <span className={styles.featuredEventValue}>{event.location}</span>
        </div>
        <div className={styles.featuredEventInfoItem}>
          <ChevronRight24Regular className={styles.featuredInfoIcon} />
          <span className={styles.featuredEventLabel}>{t('events.attendees')}</span>
          <span className={styles.featuredEventValue}>{event.attendees}</span>
        </div>
      </div>

      {event.highlights && event.highlights.length > 0 && (
        <div className={styles.featuredEventHighlights}>
          <div className={styles.featuredHighlightsTitle}>{t('events.whatToExpect')}</div>
          <ul className={styles.featuredHighlightsList}>
            {event.highlights.map((highlight, index) => (
              <li key={index} className={styles.featuredHighlightItem}>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className={styles.featuredCtaButton}>
          {t('events.registerNow')} <ChevronRight24Regular style={{ fontSize: '1.2rem' }} />
        </button>
      </div>
    </div>
  );
}
