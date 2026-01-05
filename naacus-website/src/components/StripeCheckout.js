import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Card,
  Text,
  Body2,
  Title2,
  Spinner,
  MessageBar,
} from '@fluentui/react-components';
import {
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';
import { colors, themeTokens } from '../config/theme';
import { getPlanById } from '../config/membershipPricingConfig';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing['2xl']),
    ...shorthands.padding(themeTokens.spacing.xl),
    maxWidth: '600px',
    ...shorthands.margin('0', 'auto'),
    '@media (max-width: 768px)': {
      ...shorthands.padding(themeTokens.spacing.lg),
      ...shorthands.gap(themeTokens.spacing.lg),
    },
  },
  productCard: {
    ...shorthands.padding(themeTokens.spacing.xl),
    backgroundColor: colors.neutral.offWhite,
    ...shorthands.borderRadius(themeTokens.spacing.md),
    border: `1px solid ${colors.neutral.border}`,
    boxShadow: tokens.shadow4,
    '@media (max-width: 768px)': {
      ...shorthands.padding(themeTokens.spacing.lg),
    },
  },
  productHeader: {
    fontSize: themeTokens.typography.fontSize['2xl'],
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: colors.primary.dark,
    marginBottom: themeTokens.spacing.md,
  },
  productPrice: {
    fontSize: themeTokens.typography.fontSize.xl,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: colors.status.success,
    marginBottom: themeTokens.spacing.lg,
  },
  productDescription: {
    fontSize: themeTokens.typography.fontSize.base,
    color: colors.neutral.mediumGray,
    lineHeight: themeTokens.typography.lineHeight.normal,
    marginBottom: themeTokens.spacing.lg,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary.dark,
    color: colors.neutral.white,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    marginTop: themeTokens.spacing.lg,
    '&:hover': {
      backgroundColor: colors.primary.darkest,
    },
  },
  successMessage: {
    backgroundColor: colors.overlay.successOverlay,
    borderLeftColor: colors.status.success,
    ...shorthands.borderLeft('4px', 'solid', colors.status.success),
  },
  errorMessage: {
    backgroundColor: colors.overlay.errorOverlay,
    borderLeftColor: colors.status.error,
    ...shorthands.borderLeft('4px', 'solid', colors.status.error),
  },
  successDisplay: {
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '4rem',
    color: colors.status.success,
    marginBottom: themeTokens.spacing.lg,
  },
  errorIcon: {
    fontSize: '4rem',
    color: colors.status.error,
    marginBottom: themeTokens.spacing.lg,
  },
  features: {
    marginTop: themeTokens.spacing.lg,
    paddingTop: themeTokens.spacing.lg,
    borderTop: `1px solid ${colors.neutral.border}`,
  },
  featureList: {
    listStyle: 'none',
    ...shorthands.padding('0'),
    ...shorthands.margin('0'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing.md),
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap(themeTokens.spacing.md),
    fontSize: themeTokens.typography.fontSize.base,
    color: colors.neutral.mediumGray,
  },
  featureCheckmark: {
    color: colors.status.success,
    flexShrink: 0,
    marginTop: '2px',
  },
  spinner: {
    marginRight: themeTokens.spacing.md,
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap(themeTokens.spacing.md),
  },
});

const ProductDisplay = ({
  onCheckout,
  loading = false,
  planId = 'individual',
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const plan = getPlanById(planId);

  return (
    <div className={classes.container}>
      <Card className={classes.productCard}>
        <Title2 className={classes.productHeader}>{plan.name}</Title2>
        <Text className={classes.productPrice}>
          ${plan.price.toFixed(2)} {plan.billingPeriod !== 'one-time' && `/ ${plan.billingPeriod}`}
        </Text>
        <Body2 className={classes.productDescription}>
          {plan.description}
        </Body2>
        <div className={classes.features}>
          <ul className={classes.featureList}>
            {plan.features.map((feature, index) => (
              <li key={index} className={classes.featureItem}>
                <CheckmarkCircle24Filled className={classes.featureCheckmark} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <Button
        appearance="primary"
        className={classes.button}
        onClick={onCheckout}
        disabled={loading}
      >
        {loading && <Spinner size="small" className={classes.spinner} />}
        {loading ? t('common.processing') : t('stripe.proceedCheckout') || 'Proceed to Checkout'}
      </Button>
    </div>
  );
};

const SuccessDisplay = ({ sessionId, onManageBilling }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <Card className={classes.productCard}>
        <div className={classes.successDisplay}>
          <div className={classes.successIcon}>
            <CheckmarkCircle24Filled />
          </div>
          <Title2 className={classes.productHeader}>
            {t('stripe.successTitle') || 'Subscription Successful!'}
          </Title2>
          <Body2 className={classes.productDescription}>
            {t('stripe.successMessage') || 'Your subscription has been activated. Thank you for joining NAACUS!'}
          </Body2>
          <MessageBar intent="success" style={{ marginTop: themeTokens.spacing.lg }}>
            {t('stripe.confirmationEmail') || 'A confirmation email has been sent to your registered email address.'}
          </MessageBar>
        </div>
      </Card>
      <Button appearance="primary" className={classes.button} onClick={onManageBilling}>
        {t('stripe.manageBilling') || 'Manage Your Subscription'}
      </Button>
    </div>
  );
};

const CanceledDisplay = ({ onRetry }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <Card className={classes.productCard}>
        <MessageBar intent="warning">
          {t('stripe.canceledMessage') || 'Your checkout was canceled. No charges have been made to your account. Feel free to try again whenever you\'re ready.'}
        </MessageBar>
      </Card>
      <Button appearance="primary" className={classes.button} onClick={onRetry}>
        {t('stripe.backToSubscription') || 'Back to Subscription'}
      </Button>
    </div>
  );
};

const StripeCheckout = ({ planId = 'individual' }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const plan = getPlanById(planId);
  const [status, setStatus] = useState('display'); // 'display', 'success', 'canceled'
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for URL parameters indicating return from Stripe Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setStatus('success');
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setStatus('canceled');
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookupKey: plan.lookupKey,
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
          billingPeriod: plan.billingPeriod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId: newSessionId } = await response.json();

      // Redirect to Stripe Checkout
      if (window.Stripe) {
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: newSessionId });
      } else {
        throw new Error('Stripe is not loaded');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || t('stripe.checkoutError') || 'An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Portal error:', err);
      setError(err.message || t('stripe.portalError') || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus('display');
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (error) {
    return (
      <div className={classes.container}>
        <Card className={classes.productCard}>
          <MessageBar intent="error">
            <strong>{t('common.error')}: </strong>
            {error}
          </MessageBar>
        </Card>
        <Button appearance="primary" className={classes.button} onClick={handleRetry}>
          {t('common.tryAgain') || 'Try Again'}
        </Button>
      </div>
    );
  }

  if (status === 'success') {
    return <SuccessDisplay sessionId={sessionId} onManageBilling={handleManageBilling} />;
  }

  if (status === 'canceled') {
    return <CanceledDisplay onRetry={handleRetry} />;
  }

  return (
    <ProductDisplay
      planId={planId}
      onCheckout={handleCheckout}
      loading={loading}
    />
  );
};

export default StripeCheckout;
