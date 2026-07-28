/**
 * Form Container Component
 * Standardized form wrapper with consistent styling and spacing
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  formContainer: {
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto', '32px'),
    ...shorthands.padding('32px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow8,
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px'),
      ...shorthands.margin('0', 'auto', '24px'),
    },
  },
  header: {
    textAlign: 'center',
    ...shorthands.margin('0', '0', '32px', '0'),
  },
  title: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    marginBottom: '8px',
    '@media (max-width: 768px)': {
      fontSize: '1.4rem',
    },
  },
  description: {
    display: 'block',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
  },
  form: {
    '& input, & textarea, & select': {
      width: '100%',
      padding: '12px',
      fontSize: '1rem',
      borderRadius: '6px',
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      fontFamily: 'inherit',
      transition: 'border-color 200ms ease, box-shadow 200ms ease',
      '&:focus': {
        outline: 'none',
        borderColor: tokens.colorBrandBackground,
        boxShadow: `0 0 0 3px ${tokens.colorBrandBackground}33`,
      },
    },
    '& textarea': {
      minHeight: '120px',
      resize: 'vertical',
    },
  },
});

export default function FormContainer({
  title,
  description,
  children
}) {
  const styles = useStyles();

  return (
    <div className={styles.formContainer}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <Text as="h2" className={styles.title}>{title}</Text>}
          {description && <Text as="p" className={styles.description}>{description}</Text>}
        </div>
      )}
      <form className={styles.form}>
        {children}
      </form>
    </div>
  );
}
