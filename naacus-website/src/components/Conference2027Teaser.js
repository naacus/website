import React from 'react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button
} from '@fluentui/react-components';
import { CalendarLtr24Regular, People24Regular, Location24Regular } from '@fluentui/react-icons';
import { themeTokens, colors } from '../config/theme';

const useStyles = makeStyles({
  teaser: {
    position: 'relative',
    background: `linear-gradient(135deg, ${colors.primary.darkest} 0%, ${colors.primary.dark} 50%, ${colors.primary.main} 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding(themeTokens.spacing['5xl'], themeTokens.spacing.lg),
    textAlign: 'center',
    overflow: 'hidden',
    ...shorthands.borderBottom('4px', 'solid', colors.accent.beige),
    '@media (max-width: 768px)': {
      paddingLeft: themeTokens.spacing.lg,
      paddingRight: themeTokens.spacing.lg,
    },
  },
  backgroundSlideshow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
  },
  backgroundImageActive: {
    opacity: 0.5,
  },
  teaserContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1160px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
  teaserTitle: {
    fontSize: themeTokens.typography.fontSize['4rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    marginBottom: themeTokens.spacing.lg,
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: themeTokens.typography.lineHeight.tight,
    letterSpacing: '0.02em',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['2.75rem'],
    },
  },
  teaserSubtitle: {
    fontSize: themeTokens.typography.fontSize['1.5rem'],
    marginBottom: themeTokens.spacing['2xl'],
    fontWeight: themeTokens.typography.fontWeight.normal,
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.4',
    opacity: 0.95,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.2rem'],
    },
  },
  flyerLayout: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.9fr',
    alignItems: 'stretch',
    ...shorthands.gap(themeTokens.spacing['2xl']),
    '@media (max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flyerColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  flyerImage: {
    width: '100%',
    maxWidth: '390px',
    height: 'auto',
    ...shorthands.borderRadius('10px'),
    ...shorthands.border('2px', 'solid', 'rgba(255, 255, 255, 0.5)'),
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28)',
    '@media (max-width: 960px)': {
      maxWidth: '440px',
    },
  },
  flyerFallback: {
    fontSize: themeTokens.typography.fontSize['0.95rem'],
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    display: 'block',
  },
  scheduleBlock: {
    marginTop: themeTokens.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing.xs),
    textAlign: 'left',
    '@media (max-width: 768px)': {
      textAlign: 'center',
    },
  },
  scheduleLine: {
    fontSize: themeTokens.typography.fontSize['1rem'],
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    fontWeight: themeTokens.typography.fontWeight.semibold,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.9rem'],
    },
  },
  contactLine: {
    marginTop: themeTokens.spacing.lg,
    fontSize: themeTokens.typography.fontSize['1rem'],
    color: colors.accent.beige,
    fontWeight: themeTokens.typography.fontWeight.bold,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.9rem'],
    },
  },
  highlightBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    ...shorthands.padding(themeTokens.spacing['2xl'], themeTokens.spacing['3xl']),
    marginTop: themeTokens.spacing['3xl'],
    marginBottom: themeTokens.spacing['3xl'],
    backdropFilter: 'blur(10px)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.3)'),
    ...shorthands.borderRadius('12px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding(themeTokens.spacing.xl, themeTokens.spacing.lg),
      marginTop: themeTokens.spacing['2xl'],
      marginBottom: themeTokens.spacing['2xl'],
    },
  },
  highlightText: {
    fontSize: themeTokens.typography.fontSize['1.3rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForegroundInverted,
    marginBottom: themeTokens.spacing.xl,
    display: 'block',
    textAlign: 'left',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.05rem'],
      marginBottom: themeTokens.spacing.lg,
      textAlign: 'center',
    },
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap(themeTokens.spacing.xl),
    marginTop: themeTokens.spacing.lg,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap(themeTokens.spacing.lg),
    },
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap(themeTokens.spacing.sm),
    textAlign: 'left',
    '@media (max-width: 768px)': {
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  detailIcon: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    color: colors.accent.beige,
  },
  detailLabel: {
    fontSize: themeTokens.typography.fontSize['0.9rem'],
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: themeTokens.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: themeTokens.typography.fontSize['1.2rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForegroundInverted,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.05rem'],
    },
  },
  ctaButton: {
    marginTop: themeTokens.spacing['2xl'],
    backgroundColor: colors.accent.beige,
    color: colors.primary.darkest,
    fontSize: themeTokens.typography.fontSize['1.1rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    ...shorthands.padding(themeTokens.spacing.xl, themeTokens.spacing['4xl']),
    height: 'auto',
    ...shorthands.borderRadius('30px'),
    boxShadow: '0 4px 20px rgba(232, 212, 192, 0.35)',
    ...shorthands.transition('all', '0.3s', 'ease'),
    '&:hover': {
      backgroundColor: '#F0E0D4',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 25px rgba(232, 212, 192, 0.5)',
    },
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.95rem'],
      ...shorthands.padding(themeTokens.spacing.lg, themeTokens.spacing['3xl']),
    },
  },
});

function Conference2027Teaser() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasFlyerError, setHasFlyerError] = useState(false);
  const flyerSrc = '/images/naacus2027/save-the-date.jpg';

  const heroImages = [
    '/images/hero/82b9252.jpg',
    '/images/hero/921e3ed.jpg',
    '/images/hero/2074c6e.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.teaser}>
      <div className={styles.backgroundSlideshow}>
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Conference background ${index + 1}`}
            className={`${styles.backgroundImage} ${
              index === currentImageIndex ? styles.backgroundImageActive : ''
            }`}
          />
        ))}
      </div>
      <div className={styles.teaserContent}>
        <Text as="h2" className={styles.teaserTitle}>
          {t('conference2027.title')}
        </Text>
        <Text as="p" className={styles.teaserSubtitle}>
          {t('conference2027.subtitle')}
        </Text>
        <div className={styles.highlightBox}>
          <div className={styles.flyerLayout}>
            <div className={styles.infoColumn}>
              <Text className={styles.highlightText}>
                {t('conference2027.highlightText')}
              </Text>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <CalendarLtr24Regular className={styles.detailIcon} />
                  <span className={styles.detailLabel}>{t('conference2027.whenLabel')}</span>
                  <span className={styles.detailValue}>{t('conference2027.whenValue')}</span>
                </div>
                <div className={styles.detailItem}>
                  <Location24Regular className={styles.detailIcon} />
                  <span className={styles.detailLabel}>{t('conference2027.whereLabel')}</span>
                  <span className={styles.detailValue}>{t('conference2027.whereValue')}</span>
                </div>
                <div className={styles.detailItem}>
                  <People24Regular className={styles.detailIcon} />
                  <span className={styles.detailLabel}>{t('conference2027.targetLabel')}</span>
                  <span className={styles.detailValue}>{t('conference2027.targetValue')}</span>
                </div>
              </div>
              <div className={styles.scheduleBlock}>
                <Text className={styles.scheduleLine}>{t('conference2027.scheduleLine1')}</Text>
                <Text className={styles.scheduleLine}>{t('conference2027.scheduleLine2')}</Text>
                <Text className={styles.contactLine}>{t('conference2027.contactLine')}</Text>
              </div>
            </div>
            <div className={styles.flyerColumn}>
              {!hasFlyerError ? (
                <img
                  src={flyerSrc}
                  alt={t('conference2027.flyerAlt')}
                  className={styles.flyerImage}
                  loading="lazy"
                  onError={() => setHasFlyerError(true)}
                />
              ) : (
                <Text className={styles.flyerFallback}>{t('conference2027.flyerFallback')}</Text>
              )}
            </div>
          </div>
        </div>
        <Button 
          className={styles.ctaButton}
          onClick={() => scrollToSection('newsletter')}
        >
          {t('conference2027.ctaButton')}
        </Button>
      </div>
      <div className={styles.teaserGraphic}>
        <div className={`${styles.graphicCircle} ${styles.circle1}`}></div>
        <div className={`${styles.graphicCircle} ${styles.circle2}`}></div>
      </div>
    </section>
  );
}

export default Conference2027Teaser;
