import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Text,
} from '@fluentui/react-components';
import { themeTokens } from '../config/theme';

const useStyles = makeStyles({
  cookieBanner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `2px solid ${tokens.colorBrandForeground1}`,
    ...shorthands.padding(themeTokens.spacing.xl),
    zIndex: 1400,
    animation: 'slideUp 0.3s ease-in-out',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap(themeTokens.spacing.lg),
  },
  content: {
    flex: '1',
    minWidth: '250px',
  },
  text: {
    fontSize: themeTokens.typography.fontSize.base,
    color: tokens.colorNeutralForeground1,
    marginBottom: themeTokens.spacing.sm,
  },
  link: {
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  buttons: {
    display: 'flex',
    ...shorthands.gap(themeTokens.spacing.md),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  acceptButton: {
    backgroundColor: tokens.colorBrandForeground1,
    color: tokens.colorNeutralBackground1,
    '&:hover': {
      backgroundColor: tokens.colorBrandForeground1Hover,
    },
  },
  rejectButton: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

function CookieConsent() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Re-initialize analytics if needed
    window.location.reload();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  // Function to show banner again (for settings)
  useEffect(() => {
    window.showCookieConsent = () => {
      setShowBanner(true);
    };
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Text className={styles.text}>
            {t('cookies.message') || 
              'We use cookies to enhance your experience and analyze site traffic. By continuing to use this site, you consent to our use of cookies.'}
          </Text>
          <Text as="div" className={styles.text} style={{ fontSize: themeTokens.typography.fontSize.sm, color: tokens.colorNeutralForeground2 }}>
            {t('cookies.learnMore') || 'Learn more about our'} <a href="/privacy" className={styles.link}>{t('cookies.privacyPolicy') || 'privacy policy'}</a>
          </Text>
        </div>
        <div className={styles.buttons}>
          <Button
            appearance="primary"
            className={styles.acceptButton}
            onClick={handleAccept}
          >
            {t('cookies.accept') || 'Accept All'}
          </Button>
          <Button
            appearance="secondary"
            className={styles.rejectButton}
            onClick={handleReject}
          >
            {t('cookies.reject') || 'Reject'}
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default CookieConsent;
