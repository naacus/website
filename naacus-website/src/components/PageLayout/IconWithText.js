/**
 * Icon with Text Component
 * Icon above or beside text label/description
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      '&.beside': {
        flexDirection: 'row',
        alignItems: 'flex-start',
        textAlign: 'left',
      },
    },
  },
  containerBeside: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'left',
    ...shorthands.gap('16px'),
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    minWidth: '60px',
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorBrandBackground,
    color: '#ffffff',
    fontSize: '2rem',
  },
  content: {
    ...shorthands.gap('8px'),
  },
  label: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
  },
  description: {
    display: 'block',
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
  },
});

export default function IconWithText({
  icon,
  label,
  description,
  layout = 'vertical' // 'vertical' or 'beside'
}) {
  const styles = useStyles();

  return (
    <div className={`${styles.container} ${layout === 'beside' ? styles.containerBeside : ''}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        {label && <Text className={styles.label}>{label}</Text>}
        {description && <Text className={styles.description}>{description}</Text>}
      </div>
    </div>
  );
}
