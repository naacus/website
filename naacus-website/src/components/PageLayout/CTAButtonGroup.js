/**
 * CTA Button Group Component
 * Multiple action buttons clustered for emphasis
 */

import React from 'react';
import { makeStyles, shorthands, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  group: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    justifyContent: 'center',
    ...shorthands.margin('24px', '0'),
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      '& button': {
        width: '100%',
      },
    },
  },
  button: {
    minWidth: '140px',
    height: '44px',
    fontSize: '1rem',
    fontWeight: '700',
  },
});

export default function CTAButtonGroup({ buttons = [] }) {
  const styles = useStyles();

  if (buttons.length === 0) return null;

  return (
    <div className={styles.group}>
      {buttons.map((btn, idx) => (
        <Button
          key={idx}
          appearance={btn.appearance || (idx === 0 ? 'primary' : 'secondary')}
          size="large"
          className={styles.button}
          onClick={btn.onClick}
          as={btn.href ? 'a' : 'button'}
          href={btn.href}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
}
