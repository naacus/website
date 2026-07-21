import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Input,
  Textarea,
  Button,
  Field
} from '@fluentui/react-components';
import { useAnalytics } from '../hooks/useAnalytics';
import { themeTokens } from '../config/theme';

const useStyles = makeStyles({
  contact: {
    backgroundColor: themeTokens.colors.background.light,
    ...shorthands.padding(themeTokens.spacing['5xl'], themeTokens.spacing.lg),
    '@media (max-width: 768px)': {
      ...shorthands.padding(themeTokens.spacing['4xl'], themeTokens.spacing.lg),
    },
  },
  contactTitle: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    textAlign: 'center',
    marginBottom: themeTokens.spacing['4xl'],
    color: tokens.colorNeutralForeground1,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
      marginBottom: themeTokens.spacing['2xl'],
    },
  },
  contactContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap(themeTokens.spacing['6xl']),
    maxWidth: '1000px',
    ...shorthands.margin('0', 'auto'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap(themeTokens.spacing['4xl']),
      ...shorthands.padding('0', themeTokens.spacing.sm),
    },
  },
  contactInfoTitle: {
    fontSize: themeTokens.typography.fontSize['1.875rem'],
    marginBottom: themeTokens.spacing.lg,
    color: tokens.colorNeutralForeground1,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
    },
  },
  contactInfoText: {
    fontSize: themeTokens.typography.fontSize['1rem'],
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    marginBottom: themeTokens.spacing['3xl'],
    display: 'block',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing.xl),
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(themeTokens.spacing.xl),
  },
  contactIcon: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    color: tokens.colorNeutralForeground2,
    filter: 'grayscale(100%) contrast(1.1)',
  },
  contactItemTitle: {
    fontSize: themeTokens.typography.fontSize['1.1rem'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: themeTokens.spacing.sm,
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1rem'],
    },
  },
  contactItemText: {
    fontSize: themeTokens.typography.fontSize['1rem'],
    color: tokens.colorNeutralForeground2,
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.9rem'],
    },
  },
  contactLink: {
    color: tokens.colorBrandForeground1,
    textDecorationLine: 'none',
    ':hover': {
      textDecorationLine: 'underline',
    },
  },
  formContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
  }
});

function Contact() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackForm } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  // Track form open event
  useEffect(() => {
    trackForm('ContactForm', 'form_start');
  }, [trackForm]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    trackForm('ContactForm', 'form_submit', {
      email: formData.email,
      name: formData.name,
      organization: formData.organization
    });
    // This will be integrated with Microsoft 365 services
    alert('Thank you for your interest! Form submission will be integrated with Microsoft 365 services.');
    console.log('Form data:', formData);
  };

  return (
    <section id="contact" className={styles.contact}>
      <Text as="h2" className={styles.contactTitle}>{t('contact.title')}</Text>
      <div className={styles.contactContent}>
        <div>
          <Text as="p" className={styles.contactInfoText}>
            {t('contact.description')}
          </Text>
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📧</div>
              <div>
                <Text className={styles.contactItemTitle}>{t('contact.emailLabel')}</Text>
                <Text className={styles.contactItemText}>{t('contact.emailValue')}</Text>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>🤝</div>
              <div>
                <Text className={styles.contactItemTitle}>{t('contact.joinUsLabel')}</Text>
                <Text className={styles.contactItemText}>{t('contact.joinUsValue')}</Text>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>🌐</div>
              <div>
                <Text className={styles.contactItemTitle}>{t('contact.communityLabel')}</Text>
                <Text className={styles.contactItemText}>{t('contact.communityValue')}</Text>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>⛪</div>
              <div>
                <Text className={styles.contactItemTitle}>{t('contact.spiritualDirectorLabel')}</Text>
                <Text className={styles.contactItemText}>
                  <a href={`mailto:${t('contact.emailValue')}`} className={styles.contactLink}>
                    {t('contact.emailValue')}
                  </a>
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formContainer}>
          <Field label={t('contact.nameLabel')} required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('contact.namePlaceholder')}
            />
          </Field>
          <Field label={t('contact.emailFieldLabel')} required style={{ marginTop: '20px' }}>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('contact.emailPlaceholder')}
            />
          </Field>
          <Field label={t('contact.parishLabel')} style={{ marginTop: '20px' }}>
            <Input
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder={t('contact.parishPlaceholder')}
            />
          </Field>
          <Field label={t('contact.messageLabel')} required style={{ marginTop: '20px' }}>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder={t('contact.messagePlaceholder')}
            />
          </Field>
          <Button 
            appearance="primary" 
            size="large"
            style={{ marginTop: '20px' }}
            onClick={handleSubmit}
          >
            {t('contact.sendButton')}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Contact;
