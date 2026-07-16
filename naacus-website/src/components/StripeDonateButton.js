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
        const buyButton = document.createElement('stripe-buy-button');
        buyButton.setAttribute('buy-button-id', process.env.REACT_APP_STRIPE_BUY_BUTTON_ID || '');
        buyButton.setAttribute('publishable-key', process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');
        containerRef.current.appendChild(buyButton);
      }
    }
  }, []);

  return <div ref={containerRef} className={styles.container} />;
};

export default StripeDonateButton;
