/**
 * Stats Grid Component
 * Display key metrics or statistics (members, events, programs, etc.)
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text, Card } from '@fluentui/react-components';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    ...shorthands.gap('24px'),
    ...shorthands.margin('0', '0', '32px', '0'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('18px'),
      ...shorthands.margin('0', '0', '24px', '0'),
    },
  },
  card: {
    textAlign: 'center',
    ...shorthands.padding('32px', '24px'),
    backgroundColor: tokens.colorNeutralBackground2,
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  number: {
    display: 'block',
    fontSize: '3rem',
    fontWeight: '900',
    color: tokens.colorBrandBackground,
    lineHeight: '1',
    marginBottom: '12px',
    '@media (max-width: 768px)': {
      fontSize: '2.2rem',
    },
  },
  label: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.4',
  },
  description: {
    display: 'block',
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    marginTop: '8px',
    lineHeight: '1.5',
  },
});

export default function StatCard({ 
  number, 
  label, 
  description 
}) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      {number && <Text as="div" className={styles.number}>{number}</Text>}
      {label && <Text as="div" className={styles.label}>{label}</Text>}
      {description && <Text as="p" className={styles.description}>{description}</Text>}
    </Card>
  );
}

function StatsGrid({ children }) {
  const styles = useStyles();
  return <div className={styles.grid}>{children}</div>;
}

export { StatsGrid };
