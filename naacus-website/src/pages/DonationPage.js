import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands, Text, tokens } from '@fluentui/react-components';
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
    '@media (min-width: 769px)': {
      ...shorthands.padding('72px', '20px', '24px'),
    },
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
    maxWidth: '820px',
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
  sectionWrap: {
    marginBottom: '18px',
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
    marginTop: '20px',
    color: tokens.colorNeutralForeground2,
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  noteLine: {
    display: 'block',
  },
});

function DonationPage() {
  const styles = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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
      stripeUrl: item.stripeUrl || 'https://donate.naacus.org',
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

  const openStripeLink = (initiative) => {
    const span = startSpan('donation_page.open_stripe_link', {
      'donation.initiative': initiative.title,
      'donation.url': initiative.stripeUrl,
    });
    handleDonateClick(initiative.title);
    window.open(initiative.stripeUrl, '_blank', 'noopener,noreferrer');
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

  const handleDuesLinkClick = (event) => {
    event.preventDefault();
    handleNavigation({
      path: '/dues-registration',
      sectionId: null,
      currentPathname: location.pathname,
      navigate,
    });
  };

  return (
    <PageWrapper>
      <section className={styles.section}>
        <Text as="h1" className={styles.heading}>
          {t('donation.initiativesPage.title')}
        </Text>
        <Text as="p" className={styles.subheading}>
          {t('donation.initiativesPage.subtitle')}
        </Text>

        <div className={styles.sectionWrap}>
          <div className={styles.grid}>
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
              />
            ))}
          </div>
        </div>

        <Text as="p" className={styles.note}>
          <span className={styles.noteLine}>
            {t('donation.initiativesPage.helpText')} <Link to="/contact">{t('donation.initiativesPage.contactLinkText')}</Link>.
          </span>
          <span className={styles.noteLine}>
            {t('donation.initiativesPage.duesHelpText')} <Link to="/dues-registration" onClick={handleDuesLinkClick}>{t('donation.initiativesPage.duesLinkText')}</Link>.
          </span>
        </Text>
      </section>
    </PageWrapper>
  );
}

export default DonationPage;
