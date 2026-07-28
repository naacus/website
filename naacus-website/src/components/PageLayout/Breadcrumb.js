/**
 * Breadcrumb Component
 * Navigation context breadcrumb trail
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';
import { ChevronRight20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  breadcrumb: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
    ...shorthands.margin('0', '0', '20px', '0'),
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      ...shorthands.margin('0', '0', '16px', '0'),
    },
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  link: {
    color: tokens.colorBrandBackground,
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 200ms ease',
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.8',
      textDecoration: 'underline',
    },
  },
  current: {
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
  },
  separator: {
    color: tokens.colorNeutralForeground3,
  },
});

export default function Breadcrumb({ items = [] }) {
  const styles = useStyles();

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className={styles.item}>
            {item.href ? (
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            ) : (
              <Text className={styles.current}>{item.label}</Text>
            )}
          </div>
          {idx < items.length - 1 && (
            <ChevronRight20Regular className={styles.separator} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
