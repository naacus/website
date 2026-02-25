import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands, Button } from '@fluentui/react-components';
import { themeTokens, colors } from '../config/theme';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  donateButton: {
    backgroundColor: colors.primary.dark,
    color: colors.neutral.white,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize.xs,
      whiteSpace: 'nowrap',
      minWidth: 'auto',
      height: '24px',
      lineHeight: '24px',
    },
    '@media (min-width: 769px)': {
      minWidth: '100px',
      fontSize: themeTokens.typography.fontSize['0.95rem'],
    },
  },
});

const StripeDonateButton = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);
  const [showStripeButton, setShowStripeButton] = React.useState(false);

  useEffect(() => {
    if (!showStripeButton) return;
    
    // Only load the script once
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
        buyButton.setAttribute('buy-button-id', 'buy_btn_1SxJKHL5FQlMr7HP0P0MErFH');
        buyButton.setAttribute('publishable-key', 'pk_live_51Sk9xsL5FQlMr7HPulQzQr9HJCrdMoJFs7HL8l0j3UHsLfBmMs1wcgQRzESLTgkwg6pPAMfa5tVbsEz1CzVizYGl00xjdhrqjH');
        containerRef.current.appendChild(buyButton);
      }
    }
  }, [showStripeButton]);

  const handleClick = () => {
    setShowStripeButton(true);
  };

  if (showStripeButton) {
    return <div ref={containerRef} className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      <Button
        appearance="primary"
        className={styles.donateButton}
        onClick={handleClick}
      >
        💝 {t('header.donate', 'Donate')}
      </Button>
    </div>
  );
};

export default StripeDonateButton;
