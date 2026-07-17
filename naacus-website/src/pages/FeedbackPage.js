import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text
} from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import { trackPageView, trackFormEvent } from '../services/analyticsService';

const useStyles = makeStyles({
  feedbackSection: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('60px', '20px'),
    '@media (max-width: 768px)': {
      padding: '40px 20px',
    },
  },
  feedbackContent: {
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto'),
  },
  feedbackTitle: {
    fontSize: '2.75rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.75rem',
    },
  },
  feedbackSubtitle: {
    fontSize: '1.125rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    marginBottom: '40px',
    display: 'block',
  },
  formContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('20px'),
  },
  formIframe: {
    width: '100%',
    border: 'none',
    maxWidth: '100%',
    maxHeight: '100vh',
  },
});

function FeedbackPage() {
  const { t } = useTranslation();
  const styles = useStyles();

  useEffect(() => {
    // Track page view for feedback page
    trackPageView('Feedback');
    
    // Track that user started feedback form
    trackFormEvent('feedback_form');
  }, []);

  const handleFormLoad = () => {
    // Track when the iframe has fully loaded
    trackFormEvent('feedback_form');
  };

  return (
    <PageWrapper title={t('feedback.title')} description={t('feedback.description')}>
      <section className={styles.feedbackSection}>
        <div className={styles.feedbackContent}>
          <Text as="h1" className={styles.feedbackTitle}>
            {t('feedback.title')}
          </Text>
          <Text as="p" className={styles.feedbackSubtitle}>
            {t('feedback.subtitle')}
          </Text>
          
          <div className={styles.formContainer}>
            <iframe 
              title="Feedback Form"
              width="100%" 
              height="480px" 
              src="https://forms.office.com/r/kEXvM7iXAq?embed=true"
              className={styles.formIframe}
              allowFullScreen 
              webkitAllowFullScreen 
              mozAllowFullScreen 
              msAllowFullScreen
              onLoad={handleFormLoad}
            >
            </iframe>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default FeedbackPage;
