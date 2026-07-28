/**
 * Standardized Section Container Component
 * Provides consistent spacing, background, and layout for page sections
 */

import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('40px', '20px'),
    ...shorthands.margin('0', '0', '32px', '0'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('28px', '16px'),
      ...shorthands.margin('0', '0', '24px', '0'),
    },
  },
  sectionAlternate: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sectionContainer: {
    maxWidth: '1100px',
    ...shorthands.margin('0', 'auto'),
  },
});

export default function Section({ 
  children, 
  alternate = false, 
  className = '' 
}) {
  const styles = useStyles();

  return (
    <section className={`${styles.section} ${alternate ? styles.sectionAlternate : ''} ${className}`}>
      <div className={styles.sectionContainer}>
        {children}
      </div>
    </section>
  );
}
