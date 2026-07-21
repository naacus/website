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
import Resources from '../components/Resources';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  pageIntro: {
    maxWidth: '1100px',
    ...shorthands.margin('0', 'auto', '28px'),
    ...shorthands.padding('20px', '20px', '0'),
  },
  title: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '1.55rem',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.04rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.65',
    marginBottom: '22px',
    maxWidth: '860px',
  },
  outcomesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    ...shorthands.gap('14px'),
    marginBottom: '18px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  outcomeCard: {
    ...shorthands.padding('18px', '16px'),
    minHeight: '160px',
  },
  outcomeTitle: {
    display: 'block',
    fontWeight: '700',
    marginBottom: '8px',
    color: tokens.colorBrandForeground1,
  },
  outcomeBody: {
    display: 'block',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    fontSize: '0.97rem',
  },
  actionRow: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
});

export default function ResourcesPage() {
  const { t } = useTranslation();
  const { trackPageViewEvent } = useAnalytics();
  const styles = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageViewEvent('ResourcesPage');
  }, [trackPageViewEvent]);
  return (
    <PageWrapper>
      <section className={styles.pageIntro}>
        <Text as="h1" className={styles.title}>{t('resourcesPage.landing.title')}</Text>
        <Text as="p" className={styles.subtitle}>
          {t('resourcesPage.landing.subtitle')}
        </Text>

        <div className={styles.outcomesGrid}>
          <Card className={styles.outcomeCard}>
            <Text className={styles.outcomeTitle}>{t('resourcesPage.landing.outcomes.formation.title')}</Text>
            <Text className={styles.outcomeBody}>
              {t('resourcesPage.landing.outcomes.formation.body')}
            </Text>
          </Card>

          <Card className={styles.outcomeCard}>
            <Text className={styles.outcomeTitle}>{t('resourcesPage.landing.outcomes.contacts.title')}</Text>
            <Text className={styles.outcomeBody}>
              {t('resourcesPage.landing.outcomes.contacts.body')}
            </Text>
          </Card>

          <Card className={styles.outcomeCard}>
            <Text className={styles.outcomeTitle}>{t('resourcesPage.landing.outcomes.support.title')}</Text>
            <Text className={styles.outcomeBody}>
              {t('resourcesPage.landing.outcomes.support.body')}
            </Text>
          </Card>
        </div>

        <div className={styles.actionRow}>
          <Button appearance="primary" onClick={() => navigate('/membership')}>{t('resourcesPage.landing.actions.primary')}</Button>
          <Button appearance="secondary" onClick={() => navigate('/events')}>{t('resourcesPage.landing.actions.events')}</Button>
          <Button appearance="secondary" onClick={() => navigate('/contact')}>{t('resourcesPage.landing.actions.support')}</Button>
        </div>
      </section>

      <Resources />
    </PageWrapper>
  );
}
