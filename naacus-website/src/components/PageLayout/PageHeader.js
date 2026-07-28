/**
 * Standardized Page Header Component
 * Provides consistent title, subtitle, and optional description across all pages
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  header: {
    ...shorthands.margin('0', '0', '40px', '0'),
    ...shorthands.padding('0', '20px'),
    '@media (max-width: 768px)': {
      ...shorthands.margin('0', '0', '28px', '0'),
      ...shorthands.padding('0', '16px'),
    },
  },
  title: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '12px',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.75rem',
      marginBottom: '10px',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: '500',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.7',
    marginBottom: '8px',
    maxWidth: '900px',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '6px',
    },
  },
  description: {
    display: 'block',
    fontSize: '0.98rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    maxWidth: '900px',
    marginTop: '8px',
  },
});

export default function PageHeader({ title, subtitle, description }) {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      {title && <Text as="h1" className={styles.title}>{title}</Text>}
      {subtitle && <Text as="p" className={styles.subtitle}>{subtitle}</Text>}
      {description && <Text as="p" className={styles.description}>{description}</Text>}
    </header>
  );
}
