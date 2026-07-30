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
import { CalendarLtr24Regular, Location24Regular } from '@fluentui/react-icons';
import { themeTokens, colors } from '../config/theme';

const useStyles = makeStyles({
  teaser: {
    position: 'relative',
    background: `linear-gradient(145deg, ${colors.primary.darkest} 0%, ${colors.primary.dark} 58%, ${colors.primary.main} 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('84px', themeTokens.spacing.lg, '92px'),
    overflow: 'hidden',
    ...shorthands.borderBottom('4px', 'solid', colors.accent.beige),
    '::before': {
      content: '""',
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(180deg, rgba(7, 16, 58, 0.3) 0%, rgba(8, 20, 74, 0.45) 45%, rgba(13, 26, 104, 0.58) 100%)',
      zIndex: 1,
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('68px', themeTokens.spacing.md, '76px'),
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
    transform: 'scale(1.04)',
    transition: 'opacity 1s ease-in-out, transform 8s ease-out',
  },
  backgroundImageActive: {
    opacity: 0.44,
    transform: 'scale(1)',
  },
  glowOrbOne: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    top: '-120px',
    right: '-80px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232, 212, 192, 0.22) 0%, rgba(232, 212, 192, 0) 70%)',
    filter: 'blur(6px)',
    zIndex: 1,
  },
  glowOrbTwo: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    bottom: '-120px',
    left: '-60px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(92, 129, 255, 0.28) 0%, rgba(92, 129, 255, 0) 72%)',
    filter: 'blur(8px)',
    zIndex: 1,
  },
  teaserContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1240px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
  headerBlock: {
    maxWidth: '760px',
    margin: '0 auto 34px',
    textAlign: 'center',
  },
  teaserTitle: {
    fontSize: themeTokens.typography.fontSize['3rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    marginBottom: '0',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.08',
    letterSpacing: '-0.035em',
    textShadow: '0 10px 26px rgba(0, 0, 0, 0.36)',
    maxWidth: '820px',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['2.15rem'],
      lineHeight: '1.1',
    },
  },
  featureShell: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    alignItems: 'start',
    ...shorthands.gap('20px'),
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.12) 58%, rgba(255, 255, 255, 0.05) 100%)',
    ...shorthands.borderRadius('20px'),
    ...shorthands.padding('12px'),
    '@media (max-width: 960px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.padding('12px'),
    },
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('18px'),
  },
  flyerColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    ...shorthands.gap('16px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  detailCard: {
    minHeight: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    ...shorthands.borderRadius('14px'),
    ...shorthands.padding('16px', '18px'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    '@media (max-width: 768px)': {
      minHeight: 'auto',
      alignItems: 'center',
      textAlign: 'left',
    },
  },
  detailIconWrap: {
    width: '48px',
    height: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.borderRadius('999px'),
    backgroundColor: 'rgba(232, 212, 192, 0.12)',
    marginBottom: '0',
  },
  detailValue: {
    fontSize: themeTokens.typography.fontSize['1.28rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '1.2',
    flex: 1,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.12rem'],
    },
  },
  detailIcon: {
    fontSize: themeTokens.typography.fontSize['1.85rem'],
    color: colors.accent.beige,
  },
  schedulePanel: {
    backgroundColor: 'transparent',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.22)',
    ...shorthands.padding('6px', '6px', '0', '6px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  scheduleBlock: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    textAlign: 'left',
    '@media (max-width: 768px)': {
      textAlign: 'center',
    },
  },
  scheduleLine: {
    fontSize: themeTokens.typography.fontSize['1.16rem'],
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    fontWeight: themeTokens.typography.fontWeight.semibold,
    lineHeight: '1.4',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1rem'],
    },
  },
  contactLine: {
    marginTop: '4px',
    fontSize: themeTokens.typography.fontSize['1.08rem'],
    color: colors.accent.beige,
    fontWeight: themeTokens.typography.fontWeight.bold,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.96rem'],
    },
  },
  organizerRow: {
    display: 'flex',
    alignItems: 'baseline',
    ...shorthands.gap('10px'),
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  organizerLabel: {
    fontSize: themeTokens.typography.fontSize['0.9rem'],
    color: 'rgba(255, 255, 255, 0.78)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    fontWeight: themeTokens.typography.fontWeight.semibold,
  },
  organizerValue: {
    fontSize: themeTokens.typography.fontSize['1.06rem'],
    color: tokens.colorNeutralForegroundInverted,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...shorthands.gap('16px'),
    marginTop: '10px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  flyerFrame: {
    position: 'relative',
    width: '100%',
    maxWidth: '380px',
    marginLeft: 'auto',
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('0'),
    boxShadow: '0 16px 34px rgba(1, 10, 44, 0.22)',
    '@media (max-width: 960px)': {
      margin: '0 auto',
    },
  },
  flyerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    ...shorthands.borderRadius('14px'),
    boxShadow: '0 10px 22px rgba(0, 0, 0, 0.18)',
  },
  flyerFallback: {
    fontSize: themeTokens.typography.fontSize['0.95rem'],
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    display: 'block',
    ...shorthands.padding('64px', '20px'),
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: colors.accent.beige,
    color: colors.primary.darkest,
    fontSize: themeTokens.typography.fontSize['1.02rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    ...shorthands.padding(themeTokens.spacing.lg, themeTokens.spacing['3xl']),
    height: 'auto',
    ...shorthands.borderRadius('999px'),
    boxShadow: '0 10px 24px rgba(232, 212, 192, 0.28)',
    ...shorthands.transition('all', '0.25s', 'ease'),
    '&:hover': {
      backgroundColor: '#F0E0D4',
      transform: 'translateY(-2px)',
      boxShadow: '0 14px 28px rgba(232, 212, 192, 0.34)',
    },
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.98rem'],
      ...shorthands.padding(themeTokens.spacing.lg, themeTokens.spacing['3xl']),
    },
  },
});

function Conference2027Teaser() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasFlyerError, setHasFlyerError] = useState(false);
  const flyerSrc = '/images/naacus2027/save-the-date.webp';

  const heroImages = [
    '/images/hero/82b9252.webp',
    '/images/hero/921e3ed.webp',
    '/images/hero/2074c6e.webp'
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
        <img
          src={heroImages[currentImageIndex]}
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${styles.backgroundImage} ${styles.backgroundImageActive}`}
        />
      </div>
      <div className={styles.glowOrbOne}></div>
      <div className={styles.glowOrbTwo}></div>
      <div className={styles.teaserContent}>
        <div className={styles.headerBlock}>
          <Text as="h2" className={styles.teaserTitle}>
            {t('conference2027.title')}
          </Text>
        </div>
        <div className={styles.featureShell}>
            <div className={styles.infoColumn}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <div className={styles.detailIconWrap}>
                    <CalendarLtr24Regular className={styles.detailIcon} />
                  </div>
                  <span className={styles.detailValue}>{t('conference2027.whenValue')}</span>
                </div>
                <div className={styles.detailCard}>
                  <div className={styles.detailIconWrap}>
                    <Location24Regular className={styles.detailIcon} />
                  </div>
                  <span className={styles.detailValue}>{t('conference2027.whereValue')}</span>
                </div>
              </div>
              <div className={styles.schedulePanel}>
                <div className={styles.scheduleBlock}>
                  <div className={styles.organizerRow}>
                    <span className={styles.organizerLabel}>{t('conference2027.targetLabel')}</span>
                    <span className={styles.organizerValue}>{t('conference2027.targetValue')}</span>
                  </div>
                  <Text className={styles.scheduleLine}>{t('conference2027.scheduleLine1')}</Text>
                  <Text className={styles.scheduleLine}>{t('conference2027.scheduleLine2')}</Text>
                  <Text className={styles.contactLine}>{t('conference2027.contactLine')}</Text>
                </div>
                <div className={styles.ctaRow}>
                  <Button 
                    className={styles.ctaButton}
                    onClick={() => scrollToSection('newsletter')}
                  >
                    {t('conference2027.ctaButton')}
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.flyerColumn}>
              <div className={styles.flyerFrame}>
                {!hasFlyerError ? (
                  <img
                    src={flyerSrc}
                    alt={t('conference2027.flyerAlt')}
                    className={styles.flyerImage}
                    width="1080"
                    height="1350"
                    decoding="async"
                    loading="lazy"
                    fetchPriority="low"
                    onError={() => setHasFlyerError(true)}
                  />
                ) : (
                  <Text className={styles.flyerFallback}>{t('conference2027.flyerFallback')}</Text>
                )}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Conference2027Teaser;
