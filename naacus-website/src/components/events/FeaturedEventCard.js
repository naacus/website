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
import { getUpdatesMailto, getValidRegistrationUrl } from './eventActions';

const useStyles = makeStyles({
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    ...shorthands.gap('12px'),
    justifyItems: 'center',
    width: '100%',
  },
  featuredHighlightItem: {
    fontSize: '1.05rem',
    position: 'relative',
    lineHeight: '1.5',
    opacity: 0.95,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
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
      backgroundColor: '#f5e6d3',
      transform: 'translateY(-3px)',
      boxShadow: '0 14px 36px rgba(232, 212, 192, 0.4)',
      color: '#1a3a52',
    },
    '&:active': {
      transform: 'translateY(-1px)',
    },
  },
});

export default function FeaturedEventCard({ event }) {
  const { t } = useTranslation();
  const styles = useStyles();

  if (!event) return null;
  const registrationUrl = getValidRegistrationUrl(event.registrationUrl);
  const updatesMailto = getUpdatesMailto(event);

  return (
    <div className={styles.featuredEventSection}>
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
          {event.attendees && (
            <div className={styles.featuredEventInfoItem}>
              <ChevronRight24Regular className={styles.featuredInfoIcon} />
              <span className={styles.featuredEventLabel}>{t('events.attendees')}</span>
              <span className={styles.featuredEventValue}>{event.attendees}</span>
            </div>
          )}
        </div>

        {event.highlights && event.highlights.length > 0 && (
          <div className={styles.featuredEventHighlights}>
            <div className={styles.featuredHighlightsTitle}>{t('events.whatToExpect')}</div>
            <ul className={styles.featuredHighlightsList}>
              {event.highlights.map((highlight, index) => (
                <li key={index} className={styles.featuredHighlightItem}>
                  {t(highlight, { defaultValue: highlight })}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(registrationUrl || updatesMailto) && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              as="a"
              className={styles.featuredCtaButton}
              href={registrationUrl || updatesMailto}
              target={registrationUrl ? '_blank' : undefined}
              rel={registrationUrl ? 'noopener noreferrer' : undefined}
              appearance="primary"
            >
              {t(registrationUrl ? 'events.registerNow' : 'events.emailForUpdates')}
              <ChevronRight24Regular style={{ fontSize: '1.2rem' }} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}