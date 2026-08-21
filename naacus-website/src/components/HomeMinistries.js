import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Heart24Regular,
  People24Regular,
  PeopleTeam24Regular,
  PersonAccounts24Regular,
} from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { handleNavigation } from '../services/navigationService';

const featuredMinistryIds = ['women', 'youth', 'youngAdults', 'men'];

const ministryIcons = {
  women: <PersonAccounts24Regular />,
  youth: <PeopleTeam24Regular />,
  youngAdults: <Heart24Regular />,
  men: <People24Regular />,
};

const useStyles = makeStyles({
  section: {
    backgroundColor: '#f5f9fc',
    ...shorthands.padding('72px', '24px'),
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    display: 'block',
    color: tokens.colorNeutralForeground1,
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '16px',
  },
  subtitle: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    fontSize: '1.125rem',
    lineHeight: '1.7',
    maxWidth: '760px',
    margin: '0 auto 40px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '32px',
  },
  card: {
    ...shorthands.padding('28px', '24px'),
    ...shorthands.borderRadius('8px'),
  },
  icon: {
    color: tokens.colorBrandForeground1,
    fontSize: '32px',
    marginBottom: '16px',
  },
  cardTitle: {
    display: 'block',
    color: tokens.colorNeutralForeground1,
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '10px',
  },
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  actions: {
    textAlign: 'center',
  },
});

const HomeMinistries = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();
  const [ministries, setMinistries] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadMinistries = async () => {
      try {
        const data = await dataService.getMinistries();
        if (!isMounted) return;

        const verifiedMinistries = featuredMinistryIds
          .map((id) => data.find((ministry) => ministry.id === id))
          .filter((ministry) => ministry?.title && ministry?.description);
        setMinistries(verifiedMinistries);
      } catch (error) {
        if (isMounted) setMinistries([]);
      }
    };

    loadMinistries();
    return () => {
      isMounted = false;
    };
  }, []);

  const navigateTo = (path) => {
    handleNavigation({ path, sectionId: null, currentPathname: '/', navigate });
  };

  return (
    <section id="home-ministries" className={styles.section} aria-labelledby="home-ministries-title">
      <div className={styles.content}>
        <Text as="h2" id="home-ministries-title" className={styles.title}>
          {t('homeMinistries.title')}
        </Text>
        <Text as="p" className={styles.subtitle}>{t('homeMinistries.subtitle')}</Text>
        {ministries.length > 0 && (
          <div className={styles.grid}>
            {ministries.map((ministry) => (
              <Card key={ministry.id} className={styles.card}>
                <div className={styles.icon} aria-hidden="true">{ministryIcons[ministry.id]}</div>
                <Text as="h3" className={styles.cardTitle}>
                  {t(`homeMinistries.items.${ministry.id}.title`, { defaultValue: ministry.title })}
                </Text>
                <Text as="p" className={styles.description}>
                  {t(`homeMinistries.items.${ministry.id}.description`, { defaultValue: ministry.description })}
                </Text>
                <Button appearance="secondary" onClick={() => navigateTo(`/ministries/${ministry.id}`)}>
                  {t('homeMinistries.viewDetails')}
                </Button>
              </Card>
            ))}
          </div>
        )}
        <div className={styles.actions}>
          <Button appearance="primary" onClick={() => navigateTo('/fellowship-ministries')}>
            {t('homeMinistries.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeMinistries;