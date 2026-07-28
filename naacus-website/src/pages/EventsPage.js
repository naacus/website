import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { PageHeader, Section, CardGrid, StandardCard } from '../components/PageLayout';
import { Events } from '../components/events/Events';
import { useAnalytics } from '../hooks/useAnalytics';

function EventsPage() {
  const { t } = useTranslation();
  const { trackPageViewEvent } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageViewEvent('EventsPage');
  }, [trackPageViewEvent]);

  return (
    <>
      <PageHeader 
        title={t('events.landing.title')}
        subtitle={t('events.landing.subtitle')}
      />

      <Section>
        <CardGrid columns={3}>
          <StandardCard 
            title={t('events.landing.cards.expect.title')}
            description={t('events.landing.cards.expect.body')}
          />
          <StandardCard 
            title={t('events.landing.cards.registration.title')}
            description={t('events.landing.cards.registration.body')}
          />
          <StandardCard 
            title={t('events.landing.cards.audience.title')}
            description={t('events.landing.cards.audience.body')}
          />
        </CardGrid>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          <Button appearance="primary" onClick={() => navigate('/membership')}>
            {t('events.landing.actions.primary')}
          </Button>
          <Button appearance="secondary" onClick={() => navigate('/convention-map')}>
            {t('events.landing.actions.mapHub', { defaultValue: 'Open Convention Map Hub' })}
          </Button>
          <Button appearance="secondary" onClick={() => navigate('/contact')}>
            {t('events.landing.actions.secondary')}
          </Button>
        </div>
      </Section>

      <Events />

      <Section>
        <StandardCard 
          title={t('events.support.title')}
          description={t('events.support.body')}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            <Button appearance="primary" onClick={() => navigate('/volunteer')}>
              {t('events.support.actions.primary')}
            </Button>
            <Button appearance="secondary" onClick={() => navigate('/contact')}>
              {t('events.support.actions.secondary')}
            </Button>
          </div>
        </StandardCard>
      </Section>
    </>
  );
}

export default EventsPage;
