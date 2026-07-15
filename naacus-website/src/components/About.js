import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  CardHeader
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { handleNavigation } from '../services/navigationService';
import { themeTokens } from '../config/theme';

const useStyles = makeStyles({
  about: {
    backgroundColor: themeTokens.colors.background.light,
    ...shorthands.padding('50px', '20px'),
    '@media (max-width: 768px)': {
      padding: '40px 0',
    },
  },
  aboutTitle: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
    },
  },
  aboutContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  aboutIntro: {
    fontSize: themeTokens.typography.fontSize['1.125rem'],
    lineHeight: themeTokens.typography.lineHeight.relaxed,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto', '40px'),
    display: 'block',
  },
  missionValues: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('30px'),
  },
  missionItem: {
    textAlign: 'center',
    ...shorthands.padding('40px', '32px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: themeTokens.shadows.card,
    ...shorthands.borderRadius('8px'),
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: themeTokens.shadows.cardHover,
    },
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block',
    color: tokens.colorNeutralForeground2,
    filter: 'grayscale(100%) contrast(1.1)',
  },
  itemTitle: {
    fontSize: themeTokens.typography.fontSize['1.375rem'],
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
    fontWeight: themeTokens.typography.fontWeight.semibold,
  },
  itemText: {
    fontSize: themeTokens.typography.fontSize['1rem'],
    lineHeight: themeTokens.typography.lineHeight.normal,
    color: tokens.colorNeutralForeground2,
  },
  ctaSection: {
    marginTop: '48px',
    ...shorthands.padding('40px', '32px'),
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: themeTokens.typography.fontSize['1.5rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForegroundOnBrand,
    marginBottom: '12px',
    display: 'block',
  },
  ctaText: {
    fontSize: themeTokens.typography.fontSize['1rem'],
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.9,
    marginBottom: '24px',
    display: 'block',
  },
  ctaButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandBackground,
    fontSize: themeTokens.typography.fontSize['1rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    ...shorthands.padding('12px', '32px'),
    ...shorthands.borderRadius('30px'),
    ...shorthands.border('none'),
    cursor: 'pointer',
    ...shorthands.transition('all', '0.2s', 'ease'),
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    },
  },
});

function About() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    handleNavigation({ path: '/membership', sectionId: null, currentPathname: '/about', navigate });
  };

  return (
    <section id="about" className={styles.about}>
      <Text as="h2" className={styles.aboutTitle}>{t('about.title')}</Text>
      <div className={styles.aboutContent}>
        <Text as="p" className={styles.aboutIntro}>
          {t('about.intro')}
        </Text>
        <div className={styles.missionValues}>
          <Card className={styles.missionItem}>
            <div className={styles.icon}>🎯</div>
            <CardHeader
              header={<Text className={styles.itemTitle}>{t('about.mission.title')}</Text>}
              description={
                <Text className={styles.itemText}>
                  {t('about.mission.description')}
                </Text>
              }
            />
          </Card>
          <Card className={styles.missionItem}>
            <div className={styles.icon}>✨</div>
            <CardHeader
              header={<Text className={styles.itemTitle}>{t('about.vision.title')}</Text>}
              description={
                <Text className={styles.itemText}>
                  {t('about.vision.description')}
                </Text>
              }
            />
          </Card>
          <Card className={styles.missionItem}>
            <div className={styles.icon}>🤝</div>
            <CardHeader
              header={<Text className={styles.itemTitle}>{t('about.motto.title')}</Text>}
              description={
                <Text className={styles.itemText}>
                  {t('about.motto.description')}
                </Text>
              }
            />
          </Card>
        </div>
        <div className={styles.ctaSection}>
          <Text as="p" className={styles.ctaTitle}>{t('about.ctaTitle', 'Ready to Join the NAACUS Community?')}</Text>
          <Text as="p" className={styles.ctaText}>{t('about.ctaText', 'Become a member and connect with African Catholics across the United States.')}</Text>
          <button className={styles.ctaButton} onClick={handleJoinClick}>
            {t('about.ctaButton', 'Become a Member')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
