/**
 * Standardized Card Grid Component
 * Provides responsive grid layout for cards (2, 3, or 4 columns)
 */

import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    ...shorthands.gap('24px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('18px'),
    },
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    ...shorthands.gap('24px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('18px'),
    },
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    ...shorthands.gap('24px'),
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('18px'),
    },
  },
});

export default function CardGrid({ 
  children, 
  columns = 3,
  className = ''
}) {
  const styles = useStyles();
  
  const gridClass = columns === 2 
    ? styles.grid2 
    : columns === 4 
    ? styles.grid4 
    : styles.grid3;

  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  );
}
