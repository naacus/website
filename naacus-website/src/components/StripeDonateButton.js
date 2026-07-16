import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
});

const StripeDonateButton = () => {
  const styles = useStyles();
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        scriptLoaded.current = true;
        createBuyButton();
      };
    } else {
      scriptLoaded.current = true;
      createBuyButton();
    }

    function createBuyButton() {
      if (containerRef.current && !containerRef.current.querySelector('stripe-buy-button')) {
        const publishableKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
        const buyButtonId = process.env.REACT_APP_STRIPE_BUY_BUTTON_ID;

        if (!publishableKey || !buyButtonId) {
          console.warn('StripeDonateButton: REACT_APP_STRIPE_PUBLIC_KEY and REACT_APP_STRIPE_BUY_BUTTON_ID must be set.');
          return;
        }

        const buyButton = document.createElement('stripe-buy-button');
        buyButton.setAttribute('buy-button-id', buyButtonId);
        buyButton.setAttribute('publishable-key', publishableKey);
        containerRef.current.appendChild(buyButton);
      }
    }
  }, []);

  return <div ref={containerRef} className={styles.container} />;
};

export default StripeDonateButton;
