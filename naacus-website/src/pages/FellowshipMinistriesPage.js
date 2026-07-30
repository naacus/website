import React, { useEffect } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import Ministries from '../components/Ministries';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  page: {
    paddingTop: '114px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('0', '20px', '0'),
    '@media (max-width: 768px)': {
      padding: '0 0 60px',
    },
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
});

export default function FellowshipMinistriesPage() {
  const styles = useStyles();
  const { trackPageViewEvent } = useAnalytics();

  useEffect(() => {
    trackPageViewEvent('FellowshipMinistriesPage');
  }, [trackPageViewEvent]);
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Ministries />
      </div>
    </div>
  );
}
