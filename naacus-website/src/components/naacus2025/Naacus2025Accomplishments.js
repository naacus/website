import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button
} from '@fluentui/react-components';
import { 
  Calendar24Regular, 
  People24Regular, 
  Location24Regular,
  Clock24Regular,
  Video24Regular,
  Image24Regular
} from '@fluentui/react-icons';
import { getNaacus2025Events } from '../../data/naacus2025EventsData';
import { handleNavigation } from '../../services/navigationService';

const useStyles = makeStyles({
  accomplishments: {
    backgroundColor: '#faf9f8',
    ...shorthands.padding('60px', '20px'),
  },
  hero: {
    position: 'relative',
    background: `linear-gradient(135deg, #0d196b 0%, #1428A0 50%, #1e38c4 75%, #2d6b00 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('20px', '20px'),
    paddingTop: '30px',
    textAlign: 'center',
    marginBottom: '0px',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  badge: {
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
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 768px)': {
      fontSize: '1.9rem',
    },
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '24px',
    fontWeight: '400',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.4',
    opacity: 0.95,
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
  },
  conferenceInfo: {
    maxWidth: '900px',
    margin: '0 auto 40px',
    ...shorthands.padding('30px'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.borderRadius('12px'),
    backdropFilter: 'blur(10px)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('20px'),
    marginTop: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  infoIcon: {
    fontSize: '1.5rem',
    color: '#E8D4C0',
  },
  infoLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForegroundInverted,
    textAlign: 'center',
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  sectionTitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '16px',
    marginTop: '40px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
  },
  sectionDescription: {
    fontSize: '1.125rem',
    textAlign: 'center',
    marginBottom: '40px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '800px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
    display: 'block',
  },
  eventsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('30px'),
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  eventCard: {
    ...shorthands.padding('30px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderLeft('4px', 'solid', '#E8D4C0'),
    '&:hover': {
      transform: 'translateX(8px)',
      boxShadow: tokens.shadow16,
    },
  },
  eventCardMuted: {
    ...shorthands.padding('16px', '24px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderLeft('3px', 'solid', tokens.colorNeutralStroke1),
    '&:hover': {
      transform: 'translateX(4px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    ...shorthands.gap('20px'),
    flexWrap: 'wrap',
  },
  eventTitleSection: {
    flex: '1',
    minWidth: '250px',
  },
  eventDay: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1a3a52',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
  },
  eventTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    lineHeight: '1.3',
  },
  eventPresenter: {
    fontSize: '1rem',
    color: tokens.colorNeutralForeground2,
    fontStyle: 'italic',
    display: 'block',
  },
  eventMeta: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    alignItems: 'flex-end',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
  },
  metaIcon: {
    fontSize: '1.2rem',
    color: '#1a3a52',
  },
  eventContent: {
    marginTop: '20px',
  },
  eventDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '20px',
    display: 'block',
  },
  mediaSection: {
    display: 'flex',
    ...shorthands.gap('15px'),
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  mediaPlaceholder: {
    ...shorthands.padding('20px', '30px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('8px'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke1),
  },
  placeholderIcon: {
    fontSize: '1.5rem',
    color: tokens.colorBrandBackground,
  },
  ctaSection: {
    textAlign: 'center',
    marginTop: '40px',
  },
  ctaTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '700px',
    margin: '0 auto 30px',
    lineHeight: '1.6',
    display: 'block',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#E8D4C0',
    color: '#1a3a52',
    fontSize: '0.95rem',
    fontWeight: '700',
    ...shorthands.padding('12px', '28px'),
    height: 'auto',
    ...shorthands.borderRadius('30px'),
    boxShadow: '0 4px 20px rgba(232, 212, 192, 0.35)',
    ...shorthands.transition('all', '0.3s', 'ease'),
    '&:hover': {
      backgroundColor: '#F0E0D4',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 25px rgba(232, 212, 192, 0.5)',
    },
  },
  gallerySection: {
    backgroundColor: '#e6f5d0',
    ...shorthands.padding('32px', '40px'),
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
    marginBottom: '40px',
    ...shorthands.border('2px', 'solid', '#76D000'),
  },
  galleryTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: '#0d196b',
    marginBottom: '12px',
    display: 'block',
  },
  galleryDescription: {
    fontSize: '1rem',
    color: '#616161',
    marginBottom: '20px',
    lineHeight: '1.6',
    display: 'block',
  },
  galleryButton: {
    backgroundColor: '#4a9900',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.95rem',
    ...shorthands.padding('12px', '28px'),
    height: 'auto',
    ...shorthands.borderRadius('30px'),
    '&:hover': {
      backgroundColor: '#3d8200',
    },
  },
});

function Naacus2025Accomplishments() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();

  // Get conference events from data service
  const events = getNaacus2025Events();

  const scrollToNewsletter = () => {
    handleNavigation({ 
      path: '/', 
      sectionId: 'newsletter', 
      navigate 
    });
  };

  return (
    <section id="naacus2025" className={styles.accomplishments}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          
          <Text as="h1" className={styles.title}>
            {t('naacus2025.title')}
          </Text>
          
          <Text as="p" className={styles.subtitle}>
            {t('naacus2025.subtitle')}
          </Text>

          <div className={styles.conferenceInfo}>
            <Text style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '10px', display: 'block', textAlign: 'center' }}>
              {t('naacus2025.theme')}
            </Text>
            <Text style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'block', textAlign: 'center', opacity: 0.9 }}>
              {t('naacus2025.goal')}
            </Text>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Calendar24Regular className={styles.infoIcon} />
                <span className={styles.infoLabel}>Dates</span>
                <span className={styles.infoValue}>{t('naacus2025.dates')}</span>
              </div>
              
              <div className={styles.infoItem}>
                <Location24Regular className={styles.infoIcon} />
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{t('naacus2025.location')}</span>
              </div>
              
              <div className={styles.infoItem}>
                <People24Regular className={styles.infoIcon} />
                <span className={styles.infoLabel}>Host</span>
                <span className={styles.infoValue}>{t('naacus2025.host')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.ctaSection}>
          <Text as="h2" className={styles.ctaTitle}>
            {t('naacus2025.ctaTitle')}
          </Text>
          
          <Text as="p" className={styles.ctaDescription}>
            {t('naacus2025.ctaDescription')}
          </Text>

          <Button 
            className={styles.ctaButton}
            onClick={scrollToNewsletter}
          >
            {t('naacus2025.ctaButton')}
          </Button>
        </div>

        <Text as="h2" className={styles.sectionTitle}>
          {t('naacus2025.scheduleTitle')}
        </Text>
        
        <Text as="p" className={styles.sectionDescription}>
          {t('naacus2025.scheduleDescription')}
        </Text>

        {/* Photo Gallery Callout */}
        <div className={styles.gallerySection}>
          <Text as="h3" className={styles.galleryTitle}>
            {t('naacus2025.galleryTitle')}
          </Text>
          <Text as="p" className={styles.galleryDescription}>
            {t('naacus2025.galleryDescription')}
          </Text>
          <Button
            as="a"
            href="https://www.sikapalens.com/kwame-frimpong---family--kids-birthday-graduation"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.galleryButton}
          >
            {t('naacus2025.galleryButton')}
          </Button>
        </div>

        <div className={styles.eventsContainer}>
          {events.map((event) => {
            const hasPresenter = Boolean(event.presenter);
            return (
            <Card key={event.id} className={hasPresenter ? styles.eventCard : styles.eventCardMuted}>
              <div className={styles.eventHeader}>
                <div className={styles.eventTitleSection}>
                  <Text className={styles.eventDay}>{event.day}</Text>
                  <Text className={styles.eventTitle}>{event.title}</Text>
                  {hasPresenter && (
                    <Text className={styles.eventPresenter}>{t('naacus2025.presenter')} {event.presenter}</Text>
                  )}
                </div>
                
                <div className={styles.eventMeta}>
                  <div className={styles.metaItem}>
                    <Clock24Regular className={styles.metaIcon} />
                    <span>{event.time}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Location24Regular className={styles.metaIcon} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className={styles.eventContent}>
                <Text className={styles.eventDescription}>
                  <strong>{t('naacus2025.summary')}</strong> {t('naacus2025.contentToBeProvided')}
                </Text>

                <div className={styles.mediaSection}>
                  {event.videoPlaceholder && (
                    <div className={styles.mediaPlaceholder}>
                      <Video24Regular className={styles.placeholderIcon} />
                      <span>{t('naacus2025.videoToBeAdded')}</span>
                    </div>
                  )}
                  {event.photosPlaceholder && (
                    <div className={styles.mediaPlaceholder}>
                      <Image24Regular className={styles.placeholderIcon} />
                      <span>{t('naacus2025.photosToBeAdded')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Naacus2025Accomplishments;
