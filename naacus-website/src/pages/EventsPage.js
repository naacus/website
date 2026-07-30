import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button,
} from '@fluentui/react-components';
import { Events } from '../components/events/Events';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  pageTop: {
    maxWidth: '1100px',
    ...shorthands.margin('0', 'auto', '20px'),
    ...shorthands.padding('64px', '20px', '0'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('64px', '20px', '0'),
    },
  },
  title: {
    display: 'block',
    fontSize: '1.95rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.03rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.65',
    marginBottom: '18px',
    maxWidth: '860px',
  },
  planningGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    ...shorthands.gap('14px'),
    marginBottom: '14px',
    '@media (max-width: 920px)': {
      gridTemplateColumns: '1fr',
    },
  },
  planningCard: {
    ...shorthands.padding('16px', '14px'),
  },
  planningTitle: {
    display: 'block',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
  },
  planningText: {
    display: 'block',
    fontSize: '0.96rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
  },
  actionRow: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
  pageBottom: {
    maxWidth: '1100px',
    ...shorthands.margin('18px', 'auto', '0'),
    ...shorthands.padding('0', '20px', '12px'),
  },
  supportCard: {
    ...shorthands.padding('22px', '18px'),
    backgroundColor: '#f7f9fc',
  },
  supportTitle: {
    display: 'block',
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  supportBody: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '14px',
  },
});

function EventsPage() {
  const { t } = useTranslation();
  const { trackPageViewEvent } = useAnalytics();
  const styles = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageViewEvent('EventsPage');
  }, [trackPageViewEvent]);
  return (
    <>
      <section className={styles.pageTop}>
        <Text as="h1" className={styles.title}>{t('events.landing.title')}</Text>
        <Text as="p" className={styles.subtitle}>
          {t('events.landing.subtitle')}
        </Text>

        <div className={styles.planningGrid}>
          <Card className={styles.planningCard}>
            <Text className={styles.planningTitle}>{t('events.landing.cards.expect.title')}</Text>
            <Text className={styles.planningText}>
              {t('events.landing.cards.expect.body')}
            </Text>
          </Card>
          <Card className={styles.planningCard}>
            <Text className={styles.planningTitle}>{t('events.landing.cards.registration.title')}</Text>
            <Text className={styles.planningText}>
              {t('events.landing.cards.registration.body')}
            </Text>
          </Card>
          <Card className={styles.planningCard}>
            <Text className={styles.planningTitle}>{t('events.landing.cards.audience.title')}</Text>
            <Text className={styles.planningText}>
              {t('events.landing.cards.audience.body')}
            </Text>
          </Card>
        </div>

        <div className={styles.actionRow}>
          <Button appearance="primary" onClick={() => navigate('/membership')}>{t('events.landing.actions.primary')}</Button>
          <Button appearance="secondary" onClick={() => navigate('/convention-map')}>
            {t('events.landing.actions.mapHub', { defaultValue: 'Open Convention Map Hub' })}
          </Button>
          <Button appearance="secondary" onClick={() => navigate('/contact')}>{t('events.landing.actions.secondary')}</Button>
        </div>
      </section>

      <Events />

      <section className={styles.pageBottom}>
        <Card className={styles.supportCard}>
          <Text className={styles.supportTitle}>{t('events.support.title')}</Text>
          <Text className={styles.supportBody}>
            {t('events.support.body')}
          </Text>
          <div className={styles.actionRow}>
            <Button appearance="primary" onClick={() => navigate('/volunteer')}>{t('events.support.actions.primary')}</Button>
            <Button appearance="secondary" onClick={() => navigate('/contact')}>{t('events.support.actions.secondary')}</Button>
          </div>
        </Card>
      </section>
    </>
  );
}

export default EventsPage;
