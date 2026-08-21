import React from 'react';
import { Button, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { handleNavigation } from '../services/navigationService';

const useStyles = makeStyles({
  section: {
    backgroundColor: '#ffffff',
    ...shorthands.padding('72px', '24px'),
  },
  content: {
    maxWidth: '980px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    display: 'block',
    color: tokens.colorNeutralForeground1,
    fontSize: '2rem',
    fontWeight: '600',
    marginBottom: '16px',
  },
  description: {
    display: 'block',
    color: tokens.colorNeutralForeground2,
    fontSize: '1.15rem',
    lineHeight: '1.7',
    maxWidth: '760px',
    margin: '0 auto 32px',
  },
  outcomes: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    listStyleType: 'none',
    padding: '0',
    margin: '0 0 32px',
  },
  outcome: {
    color: '#0f4c81',
    backgroundColor: '#eef5fa',
    ...shorthands.padding('10px', '16px'),
    ...shorthands.borderRadius('4px'),
    fontWeight: '600',
  },
});

const WhyJoin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();
  const outcomes = ['faith', 'connection', 'heritage', 'leadership', 'service'];

  return (
    <section id="why-join" className={styles.section} aria-labelledby="why-join-title">
      <div className={styles.content}>
        <Text as="h2" id="why-join-title" className={styles.title}>{t('whyJoin.title')}</Text>
        <Text as="p" className={styles.description}>{t('whyJoin.description')}</Text>
        <ul className={styles.outcomes}>
          {outcomes.map((outcome) => (
            <Text as="li" key={outcome} className={styles.outcome}>
              {t(`whyJoin.outcomes.${outcome}`)}
            </Text>
          ))}
        </ul>
        <Button
          appearance="primary"
          onClick={() => handleNavigation({ path: '/membership', sectionId: null, currentPathname: '/', navigate })}
        >
          {t('whyJoin.cta')}
        </Button>
      </div>
    </section>
  );
};

export default WhyJoin;