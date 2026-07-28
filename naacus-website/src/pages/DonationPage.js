import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands, Text, tokens } from '@fluentui/react-components';
import { PageHeader, Section, CardGrid } from '../components/PageLayout';
import PageWrapper from '../components/PageWrapper';
import PaymentItemCard from '../components/PaymentItemCard';
import paymentConfig from '../config/paymentConfig';
import { useAnalytics } from '../hooks/useAnalytics';
import useStripeBuyButtonScript from '../hooks/useStripeBuyButtonScript';
import { startSpan } from '../services/telemetryService';

const useStyles = makeStyles({
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
  stripeCard: {
    textAlign: 'center',
    alignItems: 'center',
  },
  initiativeTitle: {
    fontSize: '1.18rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.3',
    marginTop: '0',
    marginBottom: '8px',
    display: 'block',
  },
  initiativeDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: '0.98rem',
    lineHeight: '1.5',
    margin: '12px 0 0',
    textAlign: 'center',
    display: 'block',
  },
  cta: {
    marginTop: 'auto',
    minHeight: '40px',
    fontWeight: '700',
  },
  buyButtonWrap: {
    marginTop: '14px',
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    '& > stripe-buy-button': {
      width: 'min(100%, 420px)',
      justifySelf: 'center',
    },
  },
  note: {
    marginTop: '16px',
    color: tokens.colorNeutralForeground2,
    fontSize: '0.95rem',
    textAlign: 'center',
  },
});

function DonationPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { trackCTA } = useAnalytics();
  const stripePublishableKey = paymentConfig.stripe.publishableKey;

  const donationInitiativesFromCms = t('donation.initiativesPage.itemsList', {
    returnObjects: true,
    defaultValue: [],
  });

  const donationInitiatives = Array.isArray(donationInitiativesFromCms)
    ? donationInitiativesFromCms.map((item, index) => ({
      id: item.id || `initiative-${index + 1}`,
      title: item.title || '',
      description: item.description || '',
      buyButtonId: item.buyButtonId || '',
      stripeLinkId: item.stripeLinkId || item.stripeUrl || 'https://donate.naacus.org',
    }))
    : [];

  const openDonationItems = donationInitiatives;
  const donationItemsCount = openDonationItems.length;

  useStripeBuyButtonScript({ stripePublishableKey, items: openDonationItems });

  useEffect(() => {
    const span = startSpan('donation_page.view', {
      'page.name': 'donation',
      'initiatives.count': donationItemsCount,
    });
    trackCTA('donation_page', 'view_initiatives', 'donation');
    span.end({ code: 1 });
  }, [trackCTA, donationItemsCount]);

  const handleDonateClick = (initiativeTitle) => {
    trackCTA('donation_page', 'select_initiative', initiativeTitle);
  };

  const ALLOWED_STRIPE_HOSTS = ['donate.naacus.org', 'buy.stripe.com'];

  const isAllowedStripeUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && ALLOWED_STRIPE_HOSTS.includes(parsed.hostname);
    } catch {
      return false;
    }
  };

  const resolveStripeUrl = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://buy.stripe.com/${raw.replace(/^\/+/, '')}`;
  };

  const openStripeLink = (initiative) => {
    const label = initiative.title || initiative.id;
    const resolvedStripeUrl = resolveStripeUrl(initiative.stripeLinkId);
    const span = startSpan('donation_page.open_stripe_link', {
      'donation.initiative': label,
      'donation.url': resolvedStripeUrl,
    });
    handleDonateClick(label);
    if (isAllowedStripeUrl(resolvedStripeUrl)) {
      window.open(resolvedStripeUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn(`Blocked navigation to disallowed URL: ${resolvedStripeUrl}`);
    }
    span.end({ code: 1 });
  };

  const trackBuyButtonInteraction = (initiative) => {
    const label = initiative.title || initiative.id || 'donation_item';
    const span = startSpan('donation_page.buy_button_interaction', {
      'donation.initiative': label,
      'donation.buy_button_id': initiative.buyButtonId,
    });
    trackCTA('donation_page', 'buy_button_interaction', label);
    span.end({ code: 1 });
  };

  return (
    <PageWrapper>
      <PageHeader
        title={t('donation.initiativesPage.title')}
        subtitle={t('donation.initiativesPage.subtitle')}
      />

      <Section>
        <CardGrid columns={2}>
          {openDonationItems.map((initiative) => (
            <PaymentItemCard
              key={initiative.id}
              item={initiative}
              stripePublishableKey={stripePublishableKey}
              cardClassName={styles.card}
              stripeCardClassName={styles.stripeCard}
              titleClassName={styles.initiativeTitle}
              descriptionClassName={styles.initiativeDescription}
              buyButtonWrapClassName={styles.buyButtonWrap}
              fallbackButtonClassName={styles.cta}
              fallbackButtonText={t('donation.initiativesPage.donateButton')}
              onFallbackClick={openStripeLink}
              onBuyButtonClick={trackBuyButtonInteraction}
              descriptionAfterAction
            />
          ))}
        </CardGrid>
      </Section>

      <Section>
        <Text as="p" className={styles.note}>
          {t('donation.initiativesPage.helpText')} <Link to="/contact">{t('donation.initiativesPage.contactLinkText')}</Link>.
        </Text>
      </Section>
    </PageWrapper>
  );
}

export default DonationPage;
