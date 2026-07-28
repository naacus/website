/**
 * Testimonial Card Component
 * Specialized card for quotes, testimonials, and reviews with author attribution
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('28px'),
    height: '100%',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px'),
    },
  },
  quoteIcon: {
    fontSize: '2rem',
    color: tokens.colorBrandBackground,
    marginBottom: '12px',
    opacity: '0.7',
    lineHeight: '1',
  },
  quote: {
    display: 'block',
    fontSize: '1.05rem',
    fontStyle: 'italic',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.8',
    marginBottom: '20px',
    flexGrow: 1,
  },
  authorSection: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    paddingTop: '16px',
  },
  author: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  title: {
    display: 'block',
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground2,
    fontWeight: '500',
  },
  rating: {
    marginTop: '8px',
    color: '#FFC700',
    fontSize: '1.1rem',
  },
});

export default function TestimonialCard({
  quote,
  author,
  title,
  rating // 1-5 stars
}) {
  const styles = useStyles();

  const stars = '⭐'.repeat(Math.min(5, Math.max(1, Math.round(rating || 5))));

  return (
    <Card className={styles.card}>
      <div className={styles.quoteIcon}>&quot;</div>
      {quote && <Text as="blockquote" className={styles.quote}>{quote}</Text>}
      <div className={styles.authorSection}>
        {author && <Text as="cite" className={styles.author}>{author}</Text>}
        {title && <Text as="span" className={styles.title}>{title}</Text>}
        {rating && <div className={styles.rating}>{stars}</div>}
      </div>
    </Card>
  );
}
