/**
 * Standardized Card Component
 * Consistent styling for all card-based content across pages
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('24px'),
    height: '100%',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('18px'),
    },
  },
  cardCompact: {
    ...shorthands.padding('18px', '16px'),
  },
  title: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  description: {
    display: 'block',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: '12px',
    flexGrow: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '12px',
  },
});

export default function StandardCard({
  title,
  description,
  children,
  footer,
  compact = false,
  onClick
}) {
  const styles = useStyles();

  return (
    <Card 
      className={`${styles.card} ${compact ? styles.cardCompact : ''}`}
      onClick={onClick}
    >
      {title && <Text className={styles.title}>{title}</Text>}
      {description && <Text className={styles.description}>{description}</Text>}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
  );
}
