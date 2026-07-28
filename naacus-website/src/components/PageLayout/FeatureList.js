/**
 * Feature List Component
 * Numbered or bulleted list with optional icons
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  list: {
    listStyle: 'none',
    ...shorthands.padding('0'),
    ...shorthands.margin('0', '0', '32px', '0'),
  },
  item: {
    display: 'flex',
    ...shorthands.gap('16px'),
    ...shorthands.margin('0', '0', '20px', '0'),
    alignItems: 'flex-start',
    '@media (max-width: 768px)': {
      ...shorthands.gap('12px'),
      ...shorthands.margin('0', '0', '16px', '0'),
    },
  },
  number: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    minWidth: '40px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorBrandBackground,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    minWidth: '40px',
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorBrandBackground,
    color: '#ffffff',
    fontSize: '1.4rem',
  },
  content: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '6px',
  },
  description: {
    display: 'block',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
  },
});

export default function FeatureList({ features = [] }) {
  const styles = useStyles();

  return (
    <ul className={styles.list}>
      {features.map((feature, idx) => (
        <li key={idx} className={styles.item}>
          {feature.icon ? (
            <div className={styles.icon}>{feature.icon}</div>
          ) : (
            <div className={styles.number}>{idx + 1}</div>
          )}
          <div className={styles.content}>
            {feature.title && <Text className={styles.title}>{feature.title}</Text>}
            {feature.description && <Text className={styles.description}>{feature.description}</Text>}
          </div>
        </li>
      ))}
    </ul>
  );
}
