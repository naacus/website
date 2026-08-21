import React from 'react';
import { Button, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { handleNavigation } from '../services/navigationService';

const useStyles = makeStyles({
  section: {
    backgroundColor: '#f4f8fb',
    ...shorthands.padding('72px', '24px'),
  },
  content: {
    maxWidth: '860px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    display: 'block',
    color: tokens.colorNeutralForeground1,
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    fontSize: '1.2rem',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
});

function HomeMission() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();

  return (
    <section id="mission" className={styles.section} aria-labelledby="mission-title">
      <div className={styles.content}>
        <Text as="h2" id="mission-title" className={styles.title}>{t('mission.title')}</Text>
        <Text as="p" className={styles.description}>{t('mission.description')}</Text>
        <Button
          appearance="primary"
          onClick={() => handleNavigation({ path: '/about', sectionId: null, currentPathname: '/', navigate })}
        >
          {t('mission.cta')}
        </Button>
      </div>
    </section>
  );
}

export default HomeMission;