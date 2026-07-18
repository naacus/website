import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Button, Text } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { paymentConfig } from '../config/paymentConfig';
import { startSpan, recordException } from '../services/telemetryService';

const isPlaceholder = (value) => /your_|placeholder|example/i.test(value || '');

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  compactContainer: {
    width: 'auto',
    transform: 'scaleX(0.66)',
    transformOrigin: 'right bottom',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    borderRadius: '4px',
    backgroundColor: '#FFF4F2',
    border: '1px solid #FDBEBE',
    width: '100%',
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    color: '#D13438',
  },
  errorText: {
    color: '#323130',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  fallbackButton: {
    marginTop: '8px',
    alignSelf: 'flex-start',
  },
  compactFallbackButton: {
    marginTop: 0,
    minHeight: '40px',
    paddingLeft: '18px',
    paddingRight: '18px',
    borderRadius: '999px',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
});

const StripeDonateButton = ({ compact = false }) => {
  const styles = useStyles();
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);
  const [error, setError] = useState(null);
  const publishableKey = paymentConfig.stripe.publishableKey;
  const buyButtonId = paymentConfig.stripe.buyButtonId;
  const hasStripeConfig =
    !!publishableKey &&
    !!buyButtonId &&
    !isPlaceholder(publishableKey) &&
    !isPlaceholder(buyButtonId) &&
    /^pk_(test|live)_.+/.test(publishableKey) &&
    /^buy_btn_.+/.test(buyButtonId);

  const handleFallbackDonateClick = () => {
    const span = startSpan('donation.fallback_open', {
      'donation.provider': 'stripe',
      'donation.compact': compact,
    });
    span.end({ code: 1 });
    window.open('https://donate.naacus.org', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (scriptLoaded.current) return;

    const loadSpan = startSpan('stripe.buy_button.load', {
      'payment.provider': 'stripe',
      'payment.compact': compact,
      'payment.config_present': hasStripeConfig,
    });

    if (!hasStripeConfig) {
      loadSpan.end({ code: 1 });
      return;
    }

    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');

    const loadScript = () => {
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/buy-button.js';
        script.async = true;
        script.onload = () => {
          scriptLoaded.current = true;
          loadSpan.addEvent('stripe_script_loaded');
          createBuyButton();
        };
        script.onerror = () => {
          const scriptError = new Error('Failed to load Stripe Buy Button script');
          loadSpan.recordException(scriptError);
          loadSpan.end({ code: 2, message: scriptError.message });
          recordException(scriptError, {
            'payment.provider': 'stripe',
            'payment.component': 'StripeDonateButton',
          });
          setError('Failed to load Stripe');
          console.error('Failed to load Stripe Buy Button script');
        };
        document.body.appendChild(script);
      } else {
        scriptLoaded.current = true;
        loadSpan.addEvent('stripe_script_reused');
        createBuyButton();
      }
    };

    function createBuyButton() {
      if (containerRef.current && !containerRef.current.querySelector('stripe-buy-button')) {
        const buyButton = document.createElement('stripe-buy-button');
        buyButton.setAttribute('buy-button-id', buyButtonId);
        buyButton.setAttribute('publishable-key', publishableKey);
        containerRef.current.appendChild(buyButton);
        loadSpan.end({ code: 1 });
      }
    }

    loadScript();

    return () => {
      // Cleanup: clear error state on unmount
      setError(null);
    };
  }, [buyButtonId, compact, hasStripeConfig, publishableKey]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorHeader}>
          <DismissRegular />
          <Text>Donation Feature Temporarily Unavailable</Text>
        </div>
        <Text className={styles.errorText}>
          The donation button is not properly configured. Please try again later or contact support.
        </Text>
        <Button
          className={`${styles.fallbackButton} ${compact ? styles.compactFallbackButton : ''}`}
          appearance="primary"
          onClick={handleFallbackDonateClick}
        >
          Donate via Web Link
        </Button>
      </div>
    );
  }

  if (!hasStripeConfig) {
    return (
      <Button
        appearance="primary"
        className={`${styles.fallbackButton} ${compact ? styles.compactFallbackButton : ''}`}
        onClick={handleFallbackDonateClick}
      >
        Donate via Web Link
      </Button>
    );
  }

  return <div ref={containerRef} className={`${styles.container} ${compact ? styles.compactContainer : ''}`} />;
};

export default StripeDonateButton;
