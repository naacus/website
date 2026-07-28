import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Text
} from '@fluentui/react-components';
import { PageHeader, Section } from '../components/PageLayout';
import PageWrapper from '../components/PageWrapper';
import { trackPageView, trackFormEvent } from '../services/analyticsService';

const useStyles = {
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
    trackFormEvent('feedback_form', 'start');
  }, []);

  const handleFormLoad = () => {
    // Track when the iframe has fully loaded
    trackFormEvent('feedback_form');
  };

  return (
    <PageWrapper title={t('feedback.title')} description={t('feedback.description')}>
      <PageHeader 
        title={t('feedback.title')}
        subtitle={t('feedback.subtitle')}
      />
      <Section>
        <div style={useStyles.formIframe}>
          <iframe 
            title="Feedback Form"
            width="100%" 
            height="480px" 
            src="https://forms.office.com/r/kEXvM7iXAq?embed=true"
            style={useStyles.formIframe}
            allowFullScreen 
            webkitAllowFullScreen 
            mozAllowFullScreen 
            msAllowFullScreen
            onLoad={handleFormLoad}
          >
          </iframe>
        </div>
      </Section>
    </PageWrapper>
  );
}

export default FeedbackPage;
