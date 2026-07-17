import React from 'react';
import { Radio, RadioGroup, Text } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '8px',
  },
  radioOption: {
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: '0',
      paddingBottom: '0',
    },
  },
  radioLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  description: {
    fontSize: '13px',
    marginLeft: '32px',
    marginTop: '4px',
    color: tokens.colorNeutralForeground2,
  },
});

/**
 * PaymentMethodSelector - Reusable payment method selection component
 * 
 * Supports both simple (Stripe/Manual) and complex (card, wallet, etc.) payment options
 * 
 * Props:
 *   value: string - Current selected payment method
 *   onChange: function - Callback when payment method changes (receives new value)
 *   options: Array<{id: string, label: string, description?: string, icon?: string}> - Payment options
 *   label?: string - Custom label for the radio group
 *   useSimpleStyle?: boolean - If true, uses simple inline style (for membership form)
 *   disabled?: boolean - Disable payment method selection
 * 
 * Example usage:
 *   <PaymentMethodSelector
 *     value={formData.paymentMethod}
 *     onChange={(value) => handleInputChange('paymentMethod', value)}
 *     options={[
 *       { id: 'stripe', label: 'Pay Online with Credit/Debit Card', description: 'Fast, secure payment via Stripe' },
 *       { id: 'manual', label: 'Manual Payment', description: 'We will contact you with payment instructions' }
 *     ]}
 *     label="Payment Method"
 *   />
 */
const PaymentMethodSelector = ({
  value,
  onChange,
  options = [],
  label,
  useSimpleStyle = true,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const displayLabel = label || t('membership.paymentMethod') || 'Payment Method';

  return (
    <div className={styles.container}>
      <label className={styles.label}>{displayLabel}</label>

      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.id} className={styles.radioOption}>
            <Radio
              value={option.id}
              label={option.label}
              className={styles.radioLabel}
              disabled={disabled}
            />
            {option.description && (
              <Text className={styles.description}>
                {option.description}
              </Text>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
