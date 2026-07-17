import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Button, Text } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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
});

const StripeDonateButton = () => {
  const styles = useStyles();
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);
  const [error, setError] = useState(null);

  const isPlaceholder = (value) => /your_|placeholder|example/i.test(value || '');

  useEffect(() => {
    if (scriptLoaded.current) return;

    const publishableKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    const buyButtonId = process.env.REACT_APP_STRIPE_BUY_BUTTON_ID;

    // Validate environment variables before loading Stripe script
    if (!publishableKey || isPlaceholder(publishableKey) || !/^pk_(test|live)_.+/.test(publishableKey)) {
      setError('Stripe public key not configured');
      console.error('StripeDonateButton: REACT_APP_STRIPE_PUBLIC_KEY is missing or not configured');
      return;
    }

    if (!buyButtonId || isPlaceholder(buyButtonId) || !/^buy_btn_.+/.test(buyButtonId)) {
      setError('Stripe buy button not configured');
      console.error('StripeDonateButton: REACT_APP_STRIPE_BUY_BUTTON_ID is missing or not configured');
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
          createBuyButton();
        };
        script.onerror = () => {
          setError('Failed to load Stripe');
          console.error('Failed to load Stripe Buy Button script');
        };
        document.body.appendChild(script);
      } else {
        scriptLoaded.current = true;
        createBuyButton();
      }
    };

    function createBuyButton() {
      if (containerRef.current && !containerRef.current.querySelector('stripe-buy-button')) {
        const buyButton = document.createElement('stripe-buy-button');
        buyButton.setAttribute('buy-button-id', buyButtonId);
        buyButton.setAttribute('publishable-key', publishableKey);
        containerRef.current.appendChild(buyButton);
      }
    }

    loadScript();

    return () => {
      // Cleanup: clear error state on unmount
      setError(null);
    };
  }, []);

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
          className={styles.fallbackButton}
          appearance="primary"
          onClick={() => window.open('https://donate.naacus.org', '_blank')}
        >
          Donate via Web Link
        </Button>
      </div>
    );
  }

  return <div ref={containerRef} className={styles.container} />;
};

export default StripeDonateButton;
