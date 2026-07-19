import { useEffect } from 'react';

const STRIPE_BUY_BUTTON_SCRIPT_SRC = 'https://js.stripe.com/v3/buy-button.js';

function useStripeBuyButtonScript({ stripePublishableKey, items = [] }) {
  const hasBuyButton = Array.isArray(items) && items.some((item) => item.buyButtonId);

  useEffect(() => {
    if (!(stripePublishableKey && hasBuyButton)) {
      return;
    }

    if (document.querySelector(`script[src="${STRIPE_BUY_BUTTON_SCRIPT_SRC}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.src = STRIPE_BUY_BUTTON_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [hasBuyButton, stripePublishableKey]);
}

export default useStripeBuyButtonScript;
