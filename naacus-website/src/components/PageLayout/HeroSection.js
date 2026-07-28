/**
 * Hero Section Component
 * Large banner intro with background image/gradient + title, subtitle, and optional CTA
 */

import React from 'react';
import { makeStyles, shorthands, tokens, Text, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  hero: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    ...shorthands.padding('80px', '20px'),
    ...shorthands.margin('0', '0', '40px', '0'),
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#ffffff',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      ...shorthands.padding('50px', '16px'),
      minHeight: '280px',
      backgroundAttachment: 'scroll',
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '900px',
  },
  title: {
    display: 'block',
    fontSize: '3.5rem',
    fontWeight: '900',
    marginBottom: '16px',
    lineHeight: '1.2',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '2rem',
      marginBottom: '12px',
    },
  },
  subtitle: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: '500',
    marginBottom: '28px',
    lineHeight: '1.6',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
    '@media (max-width: 768px)': {
      fontSize: '1.1rem',
      marginBottom: '20px',
    },
  },
  ctaButton: {
    minWidth: '180px',
    height: '48px',
    fontSize: '1.05rem',
    fontWeight: '700',
  },
});

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundGradient = 'linear-gradient(135deg, #0067b8 0%, #004578 100%)',
  cta,
  children
}) {
  const styles = useStyles();

  const backgroundStyle = {
    backgroundImage: backgroundImage ? `${backgroundGradient}, url(${backgroundImage})` : backgroundGradient,
  };

  return (
    <section className={styles.hero} style={backgroundStyle}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {title && <Text as="h1" className={styles.title}>{title}</Text>}
        {subtitle && <Text as="p" className={styles.subtitle}>{subtitle}</Text>}
        {children}
        {cta && (
          <Button
            appearance="primary"
            size="large"
            className={styles.ctaButton}
            onClick={cta.onClick}
            as={cta.href ? 'a' : 'button'}
            href={cta.href}
          >
            {cta.label}
          </Button>
        )}
      </div>
    </section>
  );
}
