import React from 'react';
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
  ChevronRight24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
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
});

export default function EventCard({ event, isUpcoming, onRegister }) {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleRegisterNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRegister(event);
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