import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Avatar
} from '@fluentui/react-components';
import { dataService } from '../services/dataService';

const useStyles = makeStyles({
  testimonials: {
    backgroundColor: '#f8f9fa',
    ...shorthands.padding('60px', '20px'),
  },
  testimonialsTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  testimonialsSubtitle: {
    fontSize: '1.25rem',
    textAlign: 'center',
    marginBottom: '48px',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    maxWidth: '700px',
    margin: '0 auto 48px',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '32px',
      padding: '0 10px',
    },
  },
  testimonialsContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    ...shorthands.gap('32px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('24px'),
    },
  },
  testimonialCard: {
    ...shorthands.padding('32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    ...shorthands.borderRadius('12px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    },
  },
  quoteIcon: {
    fontSize: '3rem',
    color: tokens.colorBrandBackground,
    opacity: 0.2,
    position: 'absolute',
    top: '20px',
    right: '24px',
  },
  testimonialText: {
    fontSize: '1.125rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground1,
    marginBottom: '24px',
    fontStyle: 'italic',
    display: 'block',
    flex: 1,
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      lineHeight: '1.6',
    },
  },
  authorSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.borderTop('2px', 'solid', '#e0e0e0'),
    paddingTop: '20px',
  },
  authorAvatar: {
    width: '50px',
    height: '50px',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '4px',
  },
  authorLocation: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },
});

function Testimonials() {
  const { t } = useTranslation();
  const styles = useStyles();

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      const data = await dataService.getTestimonials();
      if (isMounted) {
        setTestimonials(Array.isArray(data) ? data : []);
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.testimonialsContent}>
        <Text as="h2" className={styles.testimonialsTitle}>
          {t('testimonials.title')}
        </Text>
        <Text as="p" className={styles.testimonialsSubtitle}>
          {t('testimonials.subtitle')}
        </Text>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>"</div>
              <Text className={styles.testimonialText}>
                {testimonial.text}
              </Text>
              <div className={styles.authorSection}>
                <Avatar
                  name={testimonial.author}
                  initials={testimonial.initial}
                  image={testimonial.photo ? { src: testimonial.photo } : undefined}
                  size={48}
                  color="brand"
                />
                <div className={styles.authorInfo}>
                  <Text className={styles.authorName}>{testimonial.author}</Text>
                  <Text className={styles.authorLocation}>{testimonial.location}</Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
