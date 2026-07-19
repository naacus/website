import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands, Text, tokens, mergeClasses } from '@fluentui/react-components';
import PageWrapper from '../components/PageWrapper';
import PaymentItemCard from '../components/PaymentItemCard';
import paymentConfig from '../config/paymentConfig';
import { useAnalytics } from '../hooks/useAnalytics';
import useStripeBuyButtonScript from '../hooks/useStripeBuyButtonScript';
import { handleNavigation } from '../services/navigationService';
import { startSpan } from '../services/telemetryService';

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
    margin: '0',
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
  paymentArea: {
    marginTop: '14px',
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
  const navigate = useNavigate();
  const location = useLocation();
  const { trackCTA } = useAnalytics();
  const stripePublishableKey = paymentConfig.stripe.publishableKey;

  const duesItemsFromCms = t('donation.duesRegistrationPage.itemsList', {
    returnObjects: true,
    defaultValue: [],
  });

  const duesItems = Array.isArray(duesItemsFromCms)
    ? duesItemsFromCms.map((item, index) => ({
      id: item.id || `dues-item-${index + 1}`,
      title: item.title || '',
      description: item.description || '',
      amountLabel: item.amountLabel || '',
      buyButtonId: item.buyButtonId || '',
      stripeUrl: item.stripeUrl || 'https://donate.naacus.org',
    }))
    : [];
  const duesItemsCount = duesItems.length;

  useEffect(() => {
    const span = startSpan('dues_page.view', {
      'page.name': 'dues_registration',
      'dues.items.count': duesItemsCount,
    });
    trackCTA('dues_page', 'view_dues_registration', 'dues_registration');
    span.end({ code: 1 });
  }, [trackCTA, duesItemsCount]);

  useStripeBuyButtonScript({ stripePublishableKey, items: duesItems });

  const ALLOWED_STRIPE_HOSTS = ['donate.naacus.org', 'buy.stripe.com'];

  const isAllowedStripeUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && ALLOWED_STRIPE_HOSTS.includes(parsed.hostname);
    } catch {
      return false;
    }
  };

  const openStripeLink = (item) => {
    const label = item.title || item.id;
    const span = startSpan('dues_page.open_stripe_link', {
      'dues.item': label,
      'dues.url': item.stripeUrl,
    });
    trackCTA('dues_page', 'pay_now', label);
    if (isAllowedStripeUrl(item.stripeUrl)) {
      window.open(item.stripeUrl, '_blank', 'noopener,noreferrer');
    }
    span.end({ code: 1 });
  };

  const trackBuyButtonInteraction = (item) => {
    const label = item.title || item.id;
    const span = startSpan('dues_page.buy_button_interaction', {
      'dues.item': label,
      'dues.buy_button_id': item.buyButtonId,
    });
    trackCTA('dues_page', 'buy_button_interaction', label);
    span.end({ code: 1 });
  };

  const handleBackToDonationClick = (event) => {
    event.preventDefault();
    handleNavigation({
      path: '/donation',
      sectionId: null,
      currentPathname: location.pathname,
      navigate,
    });
  };

  return (
    <PageWrapper>
      <section className={styles.section}>
        <Text as="h1" className={styles.heading}>{t('donation.duesRegistrationPage.title')}</Text>
        <Text as="p" className={styles.subheading}>{t('donation.duesRegistrationPage.subtitle')}</Text>

        <div className={styles.grid}>
          {duesItems.map((item) => (
            <PaymentItemCard
              key={item.id}
              item={item}
              stripePublishableKey={stripePublishableKey}
              cardClassName={styles.card}
              stripeCardClassName={styles.stripeCard}
              titleClassName={styles.initiativeTitle}
              descriptionClassName={styles.initiativeDescription}
              amountClassName={styles.amountPill}
              buyButtonWrapClassName={styles.buyButtonWrap}
              fallbackButtonClassName={mergeClasses(styles.cta, styles.paymentArea)}
              fallbackButtonText={t('donation.duesRegistrationPage.payButton')}
              onFallbackClick={openStripeLink}
              onBuyButtonClick={trackBuyButtonInteraction}
              hideDetailsWhenStripe
              showAmountLabel
            />
          ))}
        </div>

        <Text as="p" className={styles.note}>
          <span className={styles.noteLine}>
            <Link to="/donation" onClick={handleBackToDonationClick}>{t('donation.duesRegistrationPage.backToDonationLinkText')}</Link>.
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
