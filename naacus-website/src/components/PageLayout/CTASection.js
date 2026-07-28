/**
 * CTA (Call-To-Action) Section Component
 * Prominent action area with title, description, and button(s)
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  ctaSection: {
    backgroundColor: tokens.colorBrandBackground,
    color: '#ffffff',
    ...shorthands.padding('56px', '20px'),
    ...shorthands.margin('0', '0', '40px', '0'),
    textAlign: 'center',
    ...shorthands.borderRadius('12px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('40px', '16px'),
      ...shorthands.margin('0', '0', '28px', '0'),
    },
  },
  container: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto'),
  },
  title: {
    display: 'block',
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '12px',
    lineHeight: '1.4',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
  },
  description: {
    display: 'block',
    fontSize: '1.05rem',
    marginBottom: '28px',
    lineHeight: '1.6',
    opacity: '0.95',
    '@media (max-width: 768px)': {
      fontSize: '0.95rem',
      marginBottom: '20px',
    },
  },
  buttonGroup: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    minWidth: '140px',
    height: '44px',
    fontSize: '1rem',
    fontWeight: '700',
  },
});

export default function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  children
}) {
  const styles = useStyles();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        {title && <Text as="h2" className={styles.title}>{title}</Text>}
        {description && <Text as="p" className={styles.description}>{description}</Text>}
        {children}
        {(primaryCta || secondaryCta) && (
          <div className={styles.buttonGroup}>
            {primaryCta && (
              <Button
                appearance="primary"
                className={styles.button}
                onClick={primaryCta.onClick}
                as={primaryCta.href ? 'a' : 'button'}
                href={primaryCta.href}
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                appearance="secondary"
                className={styles.button}
                onClick={secondaryCta.onClick}
                as={secondaryCta.href ? 'a' : 'button'}
                href={secondaryCta.href}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
