/**
 * Two-Column Layout Component
 * Text + image side-by-side with alternating layouts
 */

import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('48px'),
    alignItems: 'center',
    maxWidth: '1100px',
    ...shorthands.margin('0', 'auto', '40px'),
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('32px'),
      ...shorthands.margin('0', 'auto', '32px'),
    },
  },
  content: {
    '& h2': {
      fontSize: '2rem',
      fontWeight: '700',
      color: tokens.colorBrandBackground,
      marginBottom: '16px',
      lineHeight: '1.4',
      '@media (max-width: 768px)': {
        fontSize: '1.4rem',
      },
    },
    '& p': {
      fontSize: '1rem',
      color: tokens.colorNeutralForeground1,
      lineHeight: '1.8',
      marginBottom: '16px',
      '&:last-child': {
        marginBottom: '0',
      },
    },
    '& ul, & ol': {
      fontSize: '1rem',
      color: tokens.colorNeutralForeground1,
      lineHeight: '1.8',
      paddingLeft: '24px',
      marginBottom: '16px',
      '& li': {
        marginBottom: '10px',
      },
    },
  },
  imageWrapper: {
    overflow: 'hidden',
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow16,
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
    },
  },
  imageRight: {
    order: 2,
    '@media (max-width: 900px)': {
      order: 'unset',
    },
  },
  contentRight: {
    order: 1,
    '@media (max-width: 900px)': {
      order: 'unset',
    },
  },
});

export default function TwoColumnLayout({
  image,
  children,
  align = 'left' // 'left' or 'right'
}) {
  const styles = useStyles();

  const imageElement = (
    <div className={`${styles.imageWrapper} ${align === 'right' ? styles.imageRight : ''}`}>
      {typeof image === 'string' ? (
        <img src={image} alt="" />
      ) : (
        <img src={image.src} alt={image.alt || ''} />
      )}
    </div>
  );

  const content = (
    <div className={`${styles.content} ${align === 'right' ? styles.contentRight : ''}`}>
      {children}
    </div>
  );

  return (
    <div className={styles.container}>
      {align === 'left' ? (
        <>
          {content}
          {imageElement}
        </>
      ) : (
        <>
          {imageElement}
          {content}
        </>
      )}
    </div>
  );
}
