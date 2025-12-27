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
import { dataService } from '../services/dataService';

const useStyles = makeStyles({
  whatWeDo: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('50px', '20px'),
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
    marginBottom: '40px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '800px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
    display: 'block',
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  activitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    ...shorthands.gap('30px'),
  },
  activityCard: {
    ...shorthands.padding('32px', '24px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  iconWrapper: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorNeutralBackground6,
    filter: 'grayscale(100%) contrast(1.1)',
  },
  cardTitle: {
    fontSize: '1.3rem',
    marginBottom: '12px',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    display: 'block',
    textAlign: 'center',
  },
  cardText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    textAlign: 'center',
  },
});

function WhatWeDo() {
  const { t } = useTranslation();
  const styles = useStyles();
  const activities = dataService.getWhatWeDo();

  return (
    <section id="what-we-do" className={styles.whatWeDo}>
      <Text as="h2" className={styles.sectionTitle}>{t('whatWeDo.title')}</Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('whatWeDo.subtitle')}
      </Text>
      <div className={styles.content}>
        <div className={styles.activitiesGrid}>
          {activities.map((activity, index) => (
            <Card key={index} className={styles.activityCard}>
              <div className={styles.iconWrapper}>
                {activity.icon}
              </div>
              <CardHeader
                header={<Text className={styles.cardTitle}>{activity.title}</Text>}
                description={
                  <Text className={styles.cardText}>
                    {activity.description}
                  </Text>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
