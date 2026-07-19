import React from 'react';
import { Button } from '@fluentui/react-components';

function StripePaymentAction({
  item,
  stripePublishableKey,
  buyButtonWrapClassName,
  fallbackButtonClassName,
  fallbackButtonText,
  onFallbackClick,
  onBuyButtonClick,
}) {
  const hasBuyButton = Boolean(item.buyButtonId && stripePublishableKey);

  if (hasBuyButton) {
    return (
      <div className={buyButtonWrapClassName}>
        <stripe-buy-button
          buy-button-id={item.buyButtonId}
          publishable-key={stripePublishableKey}
          onClick={() => onBuyButtonClick?.(item)}
        />
      </div>
    );
  }

  return (
    <Button
      appearance="primary"
      className={fallbackButtonClassName}
      onClick={() => onFallbackClick?.(item)}
    >
      {fallbackButtonText}
    </Button>
  );
}

export default StripePaymentAction;
