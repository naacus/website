/**
 * Standardized Article Component
 * For consistent text-based content sections with title and body
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  article: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto', '32px'),
    '@media (max-width: 768px)': {
      ...shorthands.margin('0', 'auto', '24px'),
    },
  },
  title: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '16px',
    lineHeight: '1.5',
    '@media (max-width: 768px)': {
      fontSize: '1.25rem',
      marginBottom: '12px',
    },
  },
  body: {
    display: 'block',
    fontSize: '1rem',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.8',
    '& p': {
      marginBottom: '16px',
      '&:last-child': {
        marginBottom: '0',
      },
    },
    '& ul, & ol': {
      marginBottom: '16px',
      paddingLeft: '24px',
      '& li': {
        marginBottom: '8px',
        lineHeight: '1.8',
      },
    },
    '& strong': {
      fontWeight: '700',
      color: tokens.colorNeutralForeground1,
    },
    '& em': {
      fontStyle: 'italic',
    },
  },
  byline: {
    display: 'block',
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    marginTop: '16px',
    paddingTop: '16px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
  },
});

export default function Article({ 
  title, 
  children,
  byline
}) {
  const styles = useStyles();

  return (
    <article className={styles.article}>
      {title && <Text as="h2" className={styles.title}>{title}</Text>}
      <div className={styles.body}>
        {children}
      </div>
      {byline && <Text className={styles.byline}>{byline}</Text>}
    </article>
  );
}
