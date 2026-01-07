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
    maxWidth: '1000px',
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
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.05rem'],
      marginBottom: themeTokens.spacing.lg,
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
    alignItems: 'center',
    ...shorthands.gap(themeTokens.spacing.sm),
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
