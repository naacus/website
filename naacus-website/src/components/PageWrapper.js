import React from 'react';
import { 
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  page: {
    // Header logo extends below the fixed menu; this keeps page titles fully visible.
    ...shorthands.padding('0', '20px', '0'),
    paddingTop: '64px',
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 768px)': {
      ...shorthands.padding('0', '12px', '40px'),
      paddingTop: '64px',
    },
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
});

export default function PageWrapper({ children }) {
  const styles = useStyles();
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
}
