/**
 * Standardized Section Header Component
 * For section titles and descriptions within page sections
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  header: {
    textAlign: 'center',
    ...shorthands.margin('0', '0', '32px', '0'),
    '@media (max-width: 768px)': {
      ...shorthands.margin('0', '0', '24px', '0'),
    },
  },
  title: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '12px',
    letterSpacing: '-0.01em',
    '@media (max-width: 768px)': {
      fontSize: '1.4rem',
      marginBottom: '10px',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.02rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto'),
  },
});

export default function SectionHeader({ title, subtitle, centered = true }) {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      {title && <Text as="h2" className={styles.title}>{title}</Text>}
      {subtitle && <Text as="p" className={styles.subtitle}>{subtitle}</Text>}
    </header>
  );
}
