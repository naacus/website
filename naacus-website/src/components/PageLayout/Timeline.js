/**
 * Timeline Component
 * Chronological events display with alternating layout
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text, Card } from '@fluentui/react-components';

const useStyles = makeStyles({
  timeline: {
    position: 'relative',
    ...shorthands.padding('20px', '0'),
    ...shorthands.margin('32px', '0'),
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '0',
      bottom: '0',
      width: '2px',
      backgroundColor: tokens.colorBrandBackground,
      transform: 'translateX(-50%)',
      '@media (max-width: 768px)': {
        left: '20px',
      },
    },
  },
  item: {
    ...shorthands.margin('0', '0', '40px', '0'),
    '&:last-child': {
      marginBottom: '0',
    },
  },
  itemOdd: {
    '@media (min-width: 769px)': {
      textAlign: 'right',
      paddingRight: '55%',
    },
  },
  itemEven: {
    '@media (min-width: 769px)': {
      textAlign: 'left',
      paddingLeft: '55%',
    },
  },
  dot: {
    position: 'absolute',
    left: '50%',
    top: '20px',
    width: '16px',
    height: '16px',
    backgroundColor: tokens.colorBrandBackground,
    border: `3px solid #ffffff`,
    ...shorthands.borderRadius('50%'),
    transform: 'translateX(-50%)',
    boxShadow: tokens.shadow8,
    '@media (max-width: 768px)': {
      left: '20px',
    },
  },
  card: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('8px'),
    display: 'inline-block',
    maxWidth: '100%',
    textAlign: 'left',
    '@media (max-width: 768px)': {
      width: '100%',
      maxWidth: '100%',
    },
  },
  date: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '6px',
  },
  title: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  description: {
    display: 'block',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
  },
});

export default function Timeline({ events = [] }) {
  const styles = useStyles();

  return (
    <div className={styles.timeline}>
      {events.map((event, idx) => (
        <div
          key={idx}
          className={`${styles.item} ${idx % 2 === 0 ? styles.itemOdd : styles.itemEven}`}
        >
          <div className={styles.dot} />
          <Card className={styles.card}>
            {event.date && <Text className={styles.date}>{event.date}</Text>}
            {event.title && <Text className={styles.title}>{event.title}</Text>}
            {event.description && <Text className={styles.description}>{event.description}</Text>}
          </Card>
        </div>
      ))}
    </div>
  );
}
