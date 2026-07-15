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
import { CheckmarkCircle24Regular } from '@fluentui/react-icons';
import { dataService } from '../services/dataService';
import { handleNavigation } from '../services/navigationService';

const useStyles = makeStyles({
  programs: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('50px', '20px'),
    '@media (max-width: 768px)': {
      padding: '40px 0',
    },
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    textAlign: 'center',
    marginBottom: '24px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '800px',
    margin: '0 auto 24px',
    lineHeight: '1.6',
    display: 'block',
  },
  content: {
    maxWidth: '1000px',
    ...shorthands.margin('0', 'auto'),
  },
  highlightCard: {
    ...shorthands.padding('24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('8px'),
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  highlightTitle: {
    fontSize: '1.625rem',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
  },
  highlightText: {
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    marginBottom: '0',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('15px'),
  },
  activityText: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground1,
  },
  conferenceCallout: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, #0053a0 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
    marginTop: '20px',
  },
  calloutTitle: {
    fontSize: '1.4rem',
    marginBottom: '12px',
    fontWeight: '600',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
  },
  calloutText: {
    fontSize: '1rem',
    marginBottom: '16px',
    color: tokens.colorNeutralForegroundInverted,
    opacity: 0.95,
    display: 'block',
    textAlign: 'center',
  },
  getInvolvedSection: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('12px'),
    marginTop: '20px',
    textAlign: 'center',
  },
  getInvolvedTitle: {
    fontSize: '1.75rem',
    marginBottom: '12px',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    display: 'block',
    textAlign: 'center',
  },
  getInvolvedText: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
    display: 'block',
    textAlign: 'center',
  },
  ctaSection: {
    marginTop: '20px',
    ...shorthands.padding('24px', '20px'),
    backgroundColor: '#f7f9fc',
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '1.45rem',
    marginBottom: '10px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
  },
  ctaText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
    display: 'block',
  },
  ctaActions: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
});

function Programs() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaNavigate = (path) => {
    handleNavigation({ path, sectionId: null, currentPathname: window.location.pathname, navigate });
  };

  const activities = dataService.getProgramsList();

  return (
    <section id="programs" className={styles.programs}>
      <Text as="h2" className={styles.sectionTitle}>{t('programs.title')}</Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('programs.subtitle')}
      </Text>
      <div className={styles.content}>
        <Card className={styles.highlightCard}>
          <Text as="h3" className={styles.highlightTitle}>{t('programs.activitiesTitle')}</Text>
          <Text as="p" className={styles.highlightText}>
            {t('programs.activitiesDescription')}
          </Text>
          <div className={styles.activitiesList}>
            {activities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
                <Text className={styles.activityText}>{activity}</Text>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.conferenceCallout}>
          <Text as="h3" className={styles.calloutTitle}>{t('programs.conferenceTitle')}</Text>
          <Text as="p" className={styles.calloutText}>
            {t('programs.conferenceDescription')}
          </Text>
          <Button 
            appearance="primary" 
            size="large"
            onClick={() => scrollToSection('conference')}
            style={{ 
              backgroundColor: tokens.colorNeutralForegroundInverted,
              color: tokens.colorBrandBackground 
            }}
          >
            {t('programs.learnMore')}
          </Button>
        </div>

        <div className={styles.getInvolvedSection}>
          <Text as="h3" className={styles.getInvolvedTitle}>{t('programs.getInvolvedTitle')}</Text>
          <Text as="p" className={styles.getInvolvedText}>
            {t('programs.getInvolvedDescription')}
          </Text>
          <Button 
            appearance="primary" 
            size="large"
            onClick={() => scrollToSection('contact')}
          >
            {t('programs.contactUs')}
          </Button>
        </div>

        <div className={styles.ctaSection}>
          <Text as="h3" className={styles.ctaTitle}>{t('programs.ctaTitle')}</Text>
          <Text as="p" className={styles.ctaText}>{t('programs.ctaText')}</Text>
          <div className={styles.ctaActions}>
            <Button appearance="primary" onClick={() => handleCtaNavigate('/membership')}>
              {t('programs.ctaPrimary')}
            </Button>
            <Button appearance="secondary" onClick={() => handleCtaNavigate('/volunteer')}>
              {t('programs.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Programs;
