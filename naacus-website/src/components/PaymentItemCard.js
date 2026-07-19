import React from 'react';
import { Card, Text, mergeClasses } from '@fluentui/react-components';
import StripePaymentAction from './StripePaymentAction';

function PaymentItemCard({
  item,
  stripePublishableKey,
  cardClassName,
  stripeCardClassName,
  titleClassName,
  descriptionClassName,
  amountClassName,
  buyButtonWrapClassName,
  fallbackButtonClassName,
  fallbackButtonText,
  onFallbackClick,
  onBuyButtonClick,
  hideDetailsWhenStripe = false,
  hideTitleWhenStripe = true,
  showAmountLabel = false,
}) {
  const hasBuyButton = Boolean(item.buyButtonId && stripePublishableKey);
  const showTitle = !(hideTitleWhenStripe && hasBuyButton);
  const showDescription = Boolean(item.description) && !(hideDetailsWhenStripe && hasBuyButton);
  const showAmount = Boolean(item.amountLabel) && showAmountLabel && !(hideDetailsWhenStripe && hasBuyButton);

  return (
    <Card
      key={item.id}
      className={mergeClasses(
        cardClassName,
        hasBuyButton ? stripeCardClassName : null,
      )}
    >
      {showTitle && (
        <Text as="h2" className={titleClassName}>{item.title}</Text>
      )}
      {showDescription && (
        <Text as="p" className={descriptionClassName}>{item.description}</Text>
      )}
      {showAmount && (
        <Text as="span" className={amountClassName}>{item.amountLabel}</Text>
      )}
      <StripePaymentAction
        item={item}
        stripePublishableKey={stripePublishableKey}
        buyButtonWrapClassName={buyButtonWrapClassName}
        fallbackButtonClassName={fallbackButtonClassName}
        fallbackButtonText={fallbackButtonText}
        onFallbackClick={onFallbackClick}
        onBuyButtonClick={onBuyButtonClick}
      />
    </Card>
  );
}

export default PaymentItemCard;
