import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands, Card, Text, Button, tokens } from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  section: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('40px', '20px', '24px'),
  },
  heading: {
    display: 'block',
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  subheading: {
    display: 'block',
    fontSize: '1rem',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    maxWidth: '780px',
    margin: '0 auto 28px',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    ...shorthands.gap('20px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('14px'),
    },
  },
  card: {
    minHeight: '230px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('18px', '16px'),
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '220ms',
    transitionTimingFunction: 'ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  initiativeTitle: {
    fontSize: '1.18rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.3',
    marginBottom: '8px',
    display: 'block',
  },
  initiativeDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: '0.98rem',
    lineHeight: '1.5',
    display: 'block',
  },
  amountPill: {
    display: 'inline-block',
    marginTop: '10px',
    fontSize: '0.83rem',
    fontWeight: '700',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius('999px'),
    ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
  },
  cta: {
    marginTop: 'auto',
    minHeight: '40px',
    fontWeight: '700',
  },
  buyButtonWrap: {
    marginTop: 'auto',
    '& stripe-buy-button': {
      width: '100%',
    },
  },
  note: {
    marginTop: '20px',
    color: tokens.colorNeutralForeground2,
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  noteLine: {
    display: 'block',
  },
});

function DuesRegistrationPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { trackCTA } = useAnalytics();
  const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';

  const duesItems = [
    {
      id: 'annualDues',
      title: t('donation.duesRegistrationPage.items.annualDues.title'),
      description: t('donation.duesRegistrationPage.items.annualDues.description'),
      amountLabel: t('donation.duesRegistrationPage.items.annualDues.amountLabel'),
      buyButtonId: t('donation.duesRegistrationPage.items.annualDues.buyButtonId', { defaultValue: '' }),
      accent: '#1f8a70',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_ANNUAL_DUES || 'https://donate.naacus.org',
    },
    {
      id: 'membershipRegistration',
      title: t('donation.duesRegistrationPage.items.membershipRegistration.title'),
      description: t('donation.duesRegistrationPage.items.membershipRegistration.description'),
      amountLabel: t('donation.duesRegistrationPage.items.membershipRegistration.amountLabel'),
      buyButtonId: t('donation.duesRegistrationPage.items.membershipRegistration.buyButtonId', { defaultValue: '' }),
      accent: '#c2410c',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_MEMBERSHIP_REGISTRATION || 'https://donate.naacus.org',
    },
  ];

  useEffect(() => {
    trackCTA('dues_page', 'view_dues_registration', 'dues_registration');
  }, [trackCTA]);

  useEffect(() => {
    if (!stripePublishableKey) {
      return;
    }

    const scriptSrc = 'https://js.stripe.com/v3/buy-button.js';
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);
  }, [stripePublishableKey]);

  const openStripeLink = (item) => {
    trackCTA('dues_page', 'pay_now', item.title);
    window.open(item.stripeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageWrapper>
      <section className={styles.section}>
        <Text as="h1" className={styles.heading}>{t('donation.duesRegistrationPage.title')}</Text>
        <Text as="p" className={styles.subheading}>{t('donation.duesRegistrationPage.subtitle')}</Text>

        <div className={styles.grid}>
          {duesItems.map((item) => (
            <Card key={item.id} className={styles.card}>
              <Text as="h3" className={styles.initiativeTitle}>{item.title}</Text>
              <Text as="p" className={styles.initiativeDescription}>{item.description}</Text>
              <Text as="span" className={styles.amountPill}>{item.amountLabel}</Text>
              {item.buyButtonId && stripePublishableKey ? (
                <div className={styles.buyButtonWrap}>
                  <stripe-buy-button
                    buy-button-id={item.buyButtonId}
                    publishable-key={stripePublishableKey}
                  />
                </div>
              ) : (
                <Button
                  appearance="primary"
                  className={styles.cta}
                  onClick={() => openStripeLink(item)}
                >
                  {t('donation.duesRegistrationPage.payButton')}
                </Button>
              )}
            </Card>
          ))}
        </div>

        <Text as="p" className={styles.note}>
          <span className={styles.noteLine}>
            <Link to="/donation">{t('donation.duesRegistrationPage.backToDonationLinkText')}</Link>.
          </span>
          <span className={styles.noteLine}>
            {t('donation.duesRegistrationPage.helpText')} <Link to="/contact">{t('donation.duesRegistrationPage.contactLinkText')}</Link>.
          </span>
        </Text>
      </section>
    </PageWrapper>
  );
}

export default DuesRegistrationPage;
