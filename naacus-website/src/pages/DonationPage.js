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
  cta: {
    marginTop: 'auto',
    minHeight: '40px',
    fontWeight: '700',
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
  const { trackCTA } = useAnalytics();

  const donationInitiatives = [
    {
      id: 1,
      title: t('donation.initiativesPage.items.convention.title'),
      description: t('donation.initiativesPage.items.convention.description'),
      accent: '#0ea5e9',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_CONVENTION_2027 || 'https://donate.naacus.org',
    },
    {
      id: 2,
      title: t('donation.initiativesPage.items.annualFund.title'),
      description: t('donation.initiativesPage.items.annualFund.description'),
      accent: '#f97316',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_ANNUAL_FUND || 'https://donate.naacus.org',
    },
    {
      id: 3,
      title: t('donation.initiativesPage.items.womenMinistry.title'),
      description: t('donation.initiativesPage.items.womenMinistry.description'),
      accent: '#16a34a',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_WOMEN_MINISTRY || 'https://donate.naacus.org',
    },
    {
      id: 4,
      title: t('donation.initiativesPage.items.youthPrograms.title'),
      description: t('donation.initiativesPage.items.youthPrograms.description'),
      accent: '#7c3aed',
      stripeUrl: process.env.REACT_APP_STRIPE_DONATION_LINK_YOUTH_PROGRAMS || 'https://donate.naacus.org',
    },
  ];

  const openDonationItems = donationInitiatives;

  useEffect(() => {
    trackCTA('donation_page', 'view_initiatives', 'donation');
  }, [trackCTA]);

  const handleDonateClick = (initiativeTitle) => {
    trackCTA('donation_page', 'select_initiative', initiativeTitle);
  };

  const openStripeLink = (initiative) => {
    handleDonateClick(initiative.title);
    window.open(initiative.stripeUrl, '_blank', 'noopener,noreferrer');
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
              <Card key={initiative.id} className={styles.card}>
                <Text as="h3" className={styles.initiativeTitle}>{initiative.title}</Text>
                <Text as="p" className={styles.initiativeDescription}>
                  {initiative.description}
                </Text>
                <Button
                  appearance="primary"
                  className={styles.cta}
                  onClick={() => openStripeLink(initiative)}
                >
                  {t('donation.initiativesPage.donateButton')}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Text as="p" className={styles.note}>
          <span className={styles.noteLine}>
            {t('donation.initiativesPage.helpText')} <Link to="/contact">{t('donation.initiativesPage.contactLinkText')}</Link>.
          </span>
          <span className={styles.noteLine}>
            {t('donation.initiativesPage.duesHelpText')} <Link to="/dues-registration">{t('donation.initiativesPage.duesLinkText')}</Link>.
          </span>
        </Text>
      </section>
    </PageWrapper>
  );
}

export default DonationPage;
