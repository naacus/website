import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Link
} from '@fluentui/react-components';
import { handleNavigation } from '../services/navigationService';
import { useAnalytics } from '../hooks/useAnalytics';
import { colors } from '../config/theme';

const useStyles = makeStyles({
  footer: {
    backgroundColor: colors.ui.footerBg,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('64px', '20px', '24px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('48px', '20px', '24px'),
    },
  },
  footerContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('40px'),
    marginBottom: '40px',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('15px'),
  },
  footerSectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    },
  },
  footerSectionSubtitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
  },
  footerTagline: {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    opacity: 0.9,
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
  },
  footerList: {
    listStyle: 'none',
    ...shorthands.padding(0),
    ...shorthands.margin(0),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('10px'),
  },
  footerLink: {
    color: tokens.colorNeutralForegroundInverted,
    textDecoration: 'none',
    opacity: 0.9,
    fontSize: '0.95rem',
    '&:hover': {
      opacity: 1,
      textDecoration: 'underline',
    },
    '@media (max-width: 768px)': {
      fontSize: '0.875rem',
    },
  },
  footerCta: {
    color: '#90e0ef',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  footerBottom: {
    textAlign: 'center',
    ...shorthands.padding('20px', '0', '0'),
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  footerBottomText: {
    fontSize: '0.9rem',
    marginBottom: '10px',
    color: tokens.colorNeutralForegroundInverted,
    opacity: 0.8,
    display: 'block',
  },
  msIntegration: {
    fontSize: '0.85rem',
    color: '#90e0ef',
    fontWeight: '500',
  },
  footerBottomLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      ...shorthands.gap('8px'),
    },
  },
  footerSeparator: {
    color: tokens.colorNeutralForegroundInverted,
    opacity: 0.5,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

function Footer() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const { trackCTA } = useAnalytics();
  const currentYear = new Date().getFullYear();

  const handleNavigationHelper = (path, action = '') => {
    if (action) trackCTA('navigation', action, 'footer_nav');
    handleNavigation({
      path,
      sectionId: null,
      currentPathname: '/',
      navigate,
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <Text as="h3" className={styles.footerSectionTitle}>{t('header.title')}</Text>
          <Text className={styles.footerSectionSubtitle}>{t('header.tagline')}</Text>
          <Text as="p" className={styles.footerTagline}>
            {t('footer.tagline')}
          </Text>
        </div>
        <div className={styles.footerSection}>
          <Text as="h4" className={styles.footerSectionTitle}>{t('footer.quickLinks')}</Text>
          <ul className={styles.footerList}>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/', 'Home')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.home')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/about', 'About')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.about')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/leadership', 'Leadership')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.leadership')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/events', 'Events')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.events')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/resources', 'Resources')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.resources')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/prayer-library', 'Prayer Library')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.prayerLibrary')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/contact', 'Contact')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.contact')}
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <Text as="h4" className={styles.footerSectionTitle}>{t('footer.engage')}</Text>
          <ul className={styles.footerList}>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/programs-activities', 'Programs')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.eventsActivities')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/events')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.nationalConference')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/contact')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.newsletter')}
              </Link>
            </li>
            <li>
              <Link 
                className={styles.footerLink} 
                onClick={() => handleNavigationHelper('/membership')}
                style={{ cursor: 'pointer' }}
              >
                {t('footer.membership')}
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <Text as="h4" className={styles.footerSectionTitle}>{t('footer.getInvolved')}</Text>
          <Link 
            className={styles.footerLink} 
            onClick={() => handleNavigationHelper('/membership')}
            style={{ cursor: 'pointer' }}
          >
            {t('footer.joinCommunity')}
          </Link>
          <Link 
            className={styles.footerLink} 
            onClick={() => handleNavigationHelper('/programs-activities')}
            style={{ cursor: 'pointer' }}
          >
            {t('footer.participatePrograms')}
          </Link>
          <Link 
            className={styles.footerCta} 
            onClick={() => handleNavigationHelper('/contact')}
            style={{ cursor: 'pointer' }}
          >
            {t('footer.contactUs')}
          </Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomLinks}>
          <Link 
            className={styles.footerLink}
            onClick={() => handleNavigationHelper('/privacy')}
            style={{ cursor: 'pointer' }}
          >
            {t('footer.privacyPolicy') || 'Privacy Policy'}
          </Link>
          <span className={styles.footerSeparator}>|</span>
          <button 
            onClick={() => window.showCookieConsent?.()}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colorNeutralForegroundInverted,
              textDecoration: 'none',
              opacity: 0.9,
              fontSize: '0.95rem',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.9'}
          >
            {t('footer.cookieSettings') || 'Cookie Settings'}
          </button>
          <span className={styles.footerSeparator}>|</span>
          <span style={{ color: tokens.colorNeutralForegroundInverted, opacity: 0.8, fontSize: '0.95rem' }}>
            © {currentYear} NAACUS. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
