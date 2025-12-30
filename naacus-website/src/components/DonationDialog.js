import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogSurface,
  Button,
  Input,
  makeStyles,
  shorthands,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import paymentService from '../services/paymentService';
import paymentConfig from '../config/paymentConfig';
import { trackCTAEvent } from '../services/analyticsService';
import { themeTokens, colors } from '../config/theme';

const useStyles = makeStyles({
  donateButtonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  donateButtonMobileHeader: {
    display: 'none',
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
  dialogSurface: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    '@media (max-width: 968px)': {
      maxWidth: '95vw',
      maxHeight: '95vh',
    },
    '@media (max-width: 768px)': {
      maxHeight: '98vh',
      width: '95vw',
      maxWidth: '95vw',
      minWidth: 0,
    },
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    '&:hover': {
      color: tokens.colorNeutralForeground1,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  dialogContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap(themeTokens.spacing['2xl']),
    ...shorthands.padding(themeTokens.spacing.lg),
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: 1,
    minWidth: 0,
    '@media (max-width: 968px)': {
      ...shorthands.gap(themeTokens.spacing.lg),
      ...shorthands.padding(themeTokens.spacing.md),
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap(themeTokens.spacing.md),
      ...shorthands.padding(themeTokens.spacing.sm),
    },
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing.md),
    minWidth: 0,
  },
  paymentSection: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(themeTokens.spacing.xs),
    marginBottom: themeTokens.spacing.sm,
    minWidth: 0,
    width: '100%',
  },
  label: {
    fontSize: themeTokens.typography.fontSize.xs,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: themeTokens.colors.status.error,
  },
  paymentMethods: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    ...shorthands.gap(themeTokens.spacing.sm),
    marginBottom: themeTokens.spacing.lg,
  },
  paymentMethodCategory: {
    gridColumn: '1 / -1',
    fontSize: themeTokens.typography.fontSize['0.85rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    color: tokens.colorBrandBackground,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: themeTokens.spacing.sm,
    marginBottom: themeTokens.spacing.xs,
    paddingBottom: themeTokens.spacing.xs,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  paymentCategoryFirst: {
    marginTop: '0',
  },
  paymentOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    minHeight: 'auto',
    width: 'auto',
    ...shorthands.padding(themeTokens.spacing.xs, themeTokens.spacing.xs),
  },
  paymentOptionSelected: {},
  speedBadge: {
    backgroundColor: tokens.colorBrandBackground,
    color: colors.neutral.white,
    fontSize: '0.5rem',
    fontWeight: themeTokens.typography.fontWeight.bold,
    ...shorthands.padding('2px', themeTokens.spacing.xs),
    ...shorthands.borderRadius('3px'),
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  amountPresets: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    ...shorthands.gap(themeTokens.spacing.xs),
    marginBottom: themeTokens.spacing.sm,
  },
  amountButton: {
    ...shorthands.padding(themeTokens.spacing.xs),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
    cursor: 'pointer',
    backgroundColor: tokens.colorNeutralBackground1,
    fontSize: themeTokens.typography.fontSize.xs,
    fontWeight: themeTokens.typography.fontWeight.medium,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderTopColor: tokens.colorBrandBackground,
      borderRightColor: tokens.colorBrandBackground,
      borderBottomColor: tokens.colorBrandBackground,
      borderLeftColor: tokens.colorBrandBackground,
    },
  },
  amountButtonSelected: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    borderTopColor: tokens.colorBrandBackground,
    borderRightColor: tokens.colorBrandBackground,
    borderBottomColor: tokens.colorBrandBackground,
    borderLeftColor: tokens.colorBrandBackground,
  },
  dialogTitle: {
    fontSize: themeTokens.typography.fontSize['1.2rem'],
    fontWeight: themeTokens.typography.fontWeight.bold,
    color: tokens.colorNeutralForeground1,
  },
  dialogActions: {
    display: 'flex',
    ...shorthands.gap(themeTokens.spacing.md),
    justifyContent: 'flex-end',
    ...shorthands.padding(themeTokens.spacing.lg, themeTokens.spacing['2xl']),
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  errorMessage: {
    color: themeTokens.colors.status.error,
    fontSize: themeTokens.typography.fontSize['0.85rem'],
    marginTop: themeTokens.spacing.xs,
    ...shorthands.padding(themeTokens.spacing.sm, themeTokens.spacing.md),
    backgroundColor: themeTokens.colors.overlay.errorOverlay,
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
  },
  successMessage: {
    color: themeTokens.colors.status.success,
    fontSize: themeTokens.typography.fontSize['0.85rem'],
    marginTop: themeTokens.spacing.xs,
    ...shorthands.padding(themeTokens.spacing.sm, themeTokens.spacing.md),
    backgroundColor: themeTokens.colors.overlay.successOverlay,
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
  },
  warningMessage: {
    color: '#ff8c00',
    fontSize: themeTokens.typography.fontSize['0.85rem'],
    marginTop: themeTokens.spacing.xs,
    ...shorthands.padding(themeTokens.spacing.sm, themeTokens.spacing.md),
    backgroundColor: themeTokens.colors.overlay.warningOverlay,
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
  },
  infoMessage: {
    color: '#0078d4',
    fontSize: themeTokens.typography.fontSize['0.85rem'],
    marginTop: themeTokens.spacing.xs,
    ...shorthands.padding(themeTokens.spacing.sm, themeTokens.spacing.md),
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
  },
  processingTime: {
    fontSize: '0.8rem',
    color: tokens.colorNeutralForeground3,
    marginTop: '6px',
    fontWeight: '500',
  },
  paymentMethodCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(themeTokens.borderRadius.sm),
    ...shorthands.padding(themeTokens.spacing.xs, themeTokens.spacing.xs),
    boxShadow: themeTokens.shadows.card,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(45, 90, 123, 0.08)',
      boxShadow: themeTokens.shadows.cardHover,
    },
  },
  paymentMethodCardSelected: {
    backgroundColor: 'rgba(45, 90, 123, 0.12)',
    boxShadow: themeTokens.shadows.cardHover,
  },
  paymentMethodIconLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    textAlign: 'center',
  },
  paymentMethodIcon: {
    width: '24px',
    height: '24px',
    color: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
    fontSize: themeTokens.typography.fontSize['0.9rem'],
    flexShrink: 0,
  },
  paymentMethodLabel: {
    fontSize: '0.6rem',
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: themeTokens.typography.lineHeight.tight,
    whiteSpace: 'nowrap',
  },
  paymentMethodTime: {
    fontSize: themeTokens.typography.fontSize['0.75rem'],
    color: tokens.colorNeutralForeground3,
    fontWeight: themeTokens.typography.fontWeight.medium,
    marginTop: themeTokens.spacing.xs,
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap(themeTokens.spacing.sm),
    ...shorthands.padding(themeTokens.spacing.sm),
  },
  paymentMethodFormSection: {
    gridColumn: '1 / -1',
    ...shorthands.padding('8px', '0'),
    marginTop: themeTokens.spacing.xs,
    marginBottom: '0',
  },
  twoColGridEven: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '12px',
    minWidth: 0,
    width: '100%',
  },
  twoColGridWideNarrow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '12px',
    minWidth: 0,
    width: '100%',
  },
  fullWidthInput: {
    width: '100%',
  },
});

export function DonationDialog() {
  const styles = useStyles();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [supportedMethods, setSupportedMethods] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
    // Payment method specific fields
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankRoutingNumber: '',
    cryptoWalletAddress: '',
    cashappUsername: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [cardType, setCardType] = useState('');

  const amountPresets = [25, 50, 100, 250];

  // Check for openDonation query parameter to auto-open dialog
  useEffect(() => {
    if (searchParams.get('openDonation') === 'true') {
      setOpen(true);
      // Remove the query parameter from URL
      searchParams.delete('openDonation');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Backend calls are only allowed when liveMode is enabled and an API base URL is configured
  const canCallBackend = paymentConfig.general.liveMode && Boolean(paymentConfig.general.apiBaseUrl);

  // Detect card type based on card number
  const detectCardType = (cardNumber) => {
    const num = cardNumber.replace(/\D/g, '');
    if (!num) return '';
    
    // Visa: starts with 4
    if (/^4/.test(num)) return '💳 Visa';
    // Mastercard: starts with 5[1-5]
    if (/^5[1-5]/.test(num)) return '💳 Mastercard';
    // American Express: starts with 3[47]
    if (/^3[47]/.test(num)) return '💳 Amex';
    // Discover: starts with 6011
    if (/^6011/.test(num)) return '💳 Discover';
    // Diners Club: starts with 3[068]
    if (/^3[068]/.test(num)) return '💳 Diners';
    // JCB: starts with 35
    if (/^35/.test(num)) return '💳 JCB';
    
    return '💳';
  };

  // Payment method configurations with icons
  const paymentMethodsConfig = {
    card: {
      id: 'card',
      label: t('donation.creditDebit', 'Credit/Debit Card'),
      iconPath: '/icons/credit-card.svg',
      processingTime: t('donation.instant', 'Instant'),
      hasFee: true,
      feeInfo: t('donation.cardFee', '2-3% processing fee'),
    },
    applePay: {
      id: 'applePay',
      label: t('donation.applePay', 'Apple Pay'),
      iconPath: '/icons/apple-pay.svg',
      processingTime: t('donation.instant', 'Instant'),
      hasFee: true,
      feeInfo: t('donation.applePayFee', 'Fee depends on payment method'),
    },
    googlePay: {
      id: 'googlePay',
      label: t('donation.googlePay', 'Google Pay'),
      iconPath: '/icons/google-pay.svg',
      processingTime: t('donation.instant', 'Instant'),
      hasFee: true,
      feeInfo: t('donation.googlePayFee', 'Fee depends on payment method'),
    },
    paypal: {
      id: 'paypal',
      label: t('donation.paypal', 'PayPal'),
      iconPath: '/icons/paypal.svg',
      processingTime: t('donation.instant', 'Instant'),
      hasFee: true,
      feeInfo: t('donation.paypalFee', '2.2% + $0.30 fee'),
    },
    bank: {
      id: 'bank',
      label: t('donation.bankTransfer', 'Bank Transfer'),
      iconPath: '/icons/bank-transfer.svg',
      processingTime: t('donation.processingTime', '1-5 business days'),
      hasFee: false,
    },
    crypto: {
      id: 'crypto',
      label: t('donation.bitcoin', 'Bitcoin/Crypto'),
      iconPath: '/icons/bitcoin.svg',
      processingTime: t('donation.blockchainConfirm', 'Blockchain confirmed'),
      hasFee: true,
      feeInfo: t('donation.cryptoFee', 'Network fees apply'),
    },
    cashapp: {
      id: 'cashapp',
      label: t('donation.cashapp', 'Cash App'),
      iconPath: '/icons/cash-app.svg',
      processingTime: t('donation.instant', 'Instant'),
      hasFee: false,
    },
  };

  // Initialize payment service and get supported methods
  useEffect(() => {
    const initPayments = async () => {
      try {
        await paymentService.initialize();
        const methods = paymentService.getSupportedPaymentMethods();
        setSupportedMethods(methods);
        // If no methods available, show warning
        if (!methods || methods.length === 0) {
          setError(t('donation.paymentFailed', 'Payment methods not available. Please try again later.'));
        }
      } catch (err) {
        console.warn('Payment initialization warning:', err);
        // Still try to load methods even if initialization had issues
        const methods = paymentService.getSupportedPaymentMethods();
        setSupportedMethods(methods);
      }
    };

    if (open) {
      initPayments();
    }
  }, [open, t]);

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Apply expiry date masking
    if (name === 'cardExpiry') {
      formattedValue = formatExpiryDate(value);
    }
    
    // Remove $ from cashapp username if user types it
    if (name === 'cashappUsername') {
      formattedValue = value.replace(/\$/g, '').trim();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Detect card type when card number changes
    if (name === 'cardNumber') {
      setCardType(detectCardType(value));
    }
    
    setError('');
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
    }));
    setError('');
  };

  const handleDonate = async () => {
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.amount) {
        setError(t('donation.requiredFields', 'Please fill in all required fields'));
        return;
      }

      setLoading(true);
      setError('');

      // Process payment based on liveMode configuration
      // When liveMode is false, always succeed since app is under construction
      let paymentResult;
      
      if (!paymentConfig.general.liveMode) {
        // Mock successful payment when not in live mode
        paymentResult = { success: true, message: 'Construction mode - payment bypassed' };
      } else {
        paymentResult = await paymentService.processPayment(formData, selectedPayment);
        if (!paymentResult || !paymentResult.success) {
          const paymentLabel = getPaymentLabel(selectedPayment);
          throw new Error(
            paymentResult?.message ||
              t(
                'donation.paymentProcessingFailed',
                '{{paymentMethod}} payment processing failed. Please check your information and try again.',
                { paymentMethod: paymentLabel }
              )
          );
        }
      }

      // Track donation event
      try {
        await trackCTAEvent(
          'donation',
          'donation_initiated',
          selectedPayment,
          { value: formData.amount }
        );
      } catch (analyticsErr) {
        console.warn('Analytics tracking warning:', analyticsErr);
      }

      // Track donation only when backend is available
      if (canCallBackend) {
        try {
          await paymentService.trackDonation(formData, selectedPayment, 'success');
        } catch (trackErr) {
          console.warn('Donation tracking warning:', trackErr);
        }
      }

      // Show success message based on payment method
      let successMsg = '';

      if (selectedPayment === 'bank') {
        successMsg = t('donation.bankSuccess', 'Bank transfer initiated. Check your email for payment instructions.');
      } else if (selectedPayment === 'crypto') {
        successMsg = t('donation.cryptoSuccess', 'Cryptocurrency charge created. Please complete the transaction on the payment page.');
      } else if (selectedPayment === 'cashapp') {
        successMsg = t('donation.cashappSuccess', 'Cash App payment initiated. Thank you for your donation!');
      } else {
        successMsg = t('donation.paymentSuccess', 'Thank you! Your donation is being processed.');
      }

      setSuccess(successMsg);

      // Send confirmation email only when backend is available
      if (canCallBackend) {
        try {
          await paymentService.sendConfirmationEmail(formData, selectedPayment, 'processing');
        } catch (emailErr) {
          console.warn('Email sending warning:', emailErr);
        }
      }

      // Keep dialog open in construction mode; user can close manually when ready
    } catch (err) {
      const errorMsg = err.message || t('donation.paymentFailed', 'Payment processing failed. Please try again.');
      setError(errorMsg);
      console.error('Donation error:', err);

      // Track failed donation only when backend is available
      if (canCallBackend) {
        try {
          await paymentService.trackDonation(formData, selectedPayment, 'failed');
        } catch (trackErr) {
          console.warn('Failed donation tracking warning:', trackErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      amount: '',
      message: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      bankAccountHolder: '',
      bankAccountNumber: '',
      bankRoutingNumber: '',
      cryptoWalletAddress: '',
      cashappUsername: '',
    });
    setSelectedAmount('');
    setSelectedPayment('card');
    setCardType('');
    setError('');
    setSuccess('');
  };

  const renderPaymentMethodForm = (methodId) => {
    switch (methodId) {
      case 'card':
        return (
          <div className={styles.paymentMethodFormSection}>
            <div className={styles.formField}>
              <label className={styles.label}>
                {t('donation.cardNumber', 'Card Number')} <span className={styles.required}>*</span>
              </label>
              <Input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder={t('donation.cardNumberPlaceholder', '1234 5678 9012 3456')}
                disabled={loading}
                contentBefore={cardType}
              />
            </div>
            <div className={styles.twoColGridEven}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.expiry', 'Expiry')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  disabled={loading}
                  className={styles.fullWidthInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.cvv', 'CVV')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="cardCVV"
                  value={formData.cardCVV}
                  onChange={handleInputChange}
                  placeholder="123"
                  disabled={loading}
                  className={styles.fullWidthInput}
                />
              </div>
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className={styles.paymentMethodFormSection}>
            <div className={styles.formField}>
              <label className={styles.label}>
                {t('donation.accountHolder', 'Account Holder Name')} <span className={styles.required}>*</span>
              </label>
              <Input
                name="bankAccountHolder"
                value={formData.bankAccountHolder}
                onChange={handleInputChange}
                placeholder={t('donation.accountHolder', 'Account Holder Name')}
                disabled={loading}
                className={styles.fullWidthInput}
              />
            </div>
            <div className={styles.twoColGridWideNarrow}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.accountNumber', 'Account Number')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  placeholder={t('donation.accountNumber', 'Account Number')}
                  disabled={loading}
                  className={styles.fullWidthInput}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.routingNumber', 'Routing Number')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="bankRoutingNumber"
                  value={formData.bankRoutingNumber}
                  onChange={handleInputChange}
                  placeholder={t('donation.routingNumber', 'Routing Number')}
                  disabled={loading}
                  className={styles.fullWidthInput}
                />
              </div>
            </div>
            <div className={styles.infoMessage}>
              ℹ️ {t('donation.paymentInstructions', 'You will receive payment instructions via email')}
            </div>
          </div>
        );
      case 'crypto':
        return (
          <div className={styles.paymentMethodFormSection}>
            <div className={styles.formField}>
              <label className={styles.label}>
                {t('donation.walletAddress', 'Wallet Address')} <span className={styles.required}>*</span>
              </label>
              <Input
                name="cryptoWalletAddress"
                value={formData.cryptoWalletAddress}
                onChange={handleInputChange}
                placeholder={t('donation.walletAddressPlaceholder', 'Enter your Bitcoin/Crypto wallet address')}
                disabled={loading}
              />
            </div>
            <div className={styles.infoMessage}>
              ℹ️ {t('donation.cryptoSecure', 'Cryptocurrency charges are processed securely on blockchain')}
            </div>
          </div>
        );
      case 'cashapp':
        return (
          <div className={styles.paymentMethodFormSection}>
            <div className={styles.formField}>
              <label className={styles.label}>
                {t('donation.cashappUsername', 'Cash App Username')} <span className={styles.required}>*</span>
              </label>
              <Input
                name="cashappUsername"
                value={formData.cashappUsername}
                onChange={handleInputChange}
                placeholder={t('donation.cashappUsernamePlaceholder', 'username')}
                disabled={loading}
                contentBefore="$"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const paymentMethods = supportedMethods
    .map(method => {
      const config = paymentMethodsConfig[method.id];
      if (!config) {
        console.warn(`No UI config found for payment method: ${method.id}`);
        return null;
      }
      return {
        ...config,
        ...method,
      };
    })
    .filter(method => method !== null);

  const getSpeedBadge = (methodId) => {
    if (methodId === 'bank') {
      return t('donation.bankSpeed', '📅 1-5 days');
    } else if (methodId === 'crypto') {
      return t('donation.cryptoSpeed', '⛓️ Blockchain');
    }
    return t('donation.fastSpeed', '⚡ Fast');
  };

  const getPaymentLabel = (methodId) => {
    return paymentMethodsConfig[methodId]?.label || t('donation.paymentMethodUnknown', 'Selected payment method');
  };

  // Check if method requires authentication (no additional form)
  const requiresAuthentication = (methodId) => {
    const methodsWithForm = ['card', 'bank', 'crypto', 'cashapp'];
    return !methodsWithForm.includes(methodId);
  };

  // Get fee information for a payment method
  const getMethodFeeInfo = (methodId) => {
    const config = paymentMethodsConfig[methodId];
    return config?.feeInfo;
  };

  return (
    <>
      <div className={styles.donateButtonContainer}>
        <Button
          appearance="primary"
          className={styles.donateButton}
          onClick={() => setOpen(true)}
        >
          💝 {t('header.donate', 'Donate')}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(event, data) => {
        if (!data.open) {
          setOpen(false);
          resetForm();
        }
      }}>
        <DialogSurface className={styles.dialogSurface}>
            {/* Title and Close Button */}
            <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: themeTokens.spacing.sm, flexWrap: 'wrap' }}>
                <h2 className={styles.dialogTitle}>{t('donation.title', 'Make a Donation')}</h2>
                <div
                  className={styles.warningMessage}
                  style={{
                    marginBottom: 0,
                    paddingTop: themeTokens.spacing.xs,
                    paddingBottom: themeTokens.spacing.xs,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  ⚠️ {t('donation.demoDisclaimer', 'Demo only: please do not enter real payment information.')}
                </div>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => { setOpen(false); resetForm(); }}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className={styles.successMessage}>
                ✓ {success}
              </div>
            )}

            {/* Main Content Grid */}
            <div className={styles.dialogContent}>
              {/* Form Section */}
              <div className={styles.formSection}>

              {/* Full Name */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.fullName', 'Full Name')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('donation.fullName', 'Full Name')}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.email', 'Email')} <span className={styles.required}>*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('donation.email', 'Email')}
                  disabled={loading}
                />
              </div>

              {/* Phone (Optional) */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.phone', 'Phone Number')} ({t('donation.optional', 'Optional')})
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('donation.phone', 'Phone Number')}
                  disabled={loading}
                />
              </div>

              {/* Amount */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.selectAmount', 'Amount')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.amountPresets}>
                  {amountPresets.map(amount => (
                    <button
                      key={amount}
                      className={`${styles.amountButton} ${
                        selectedAmount === amount ? styles.amountButtonSelected : ''
                      }`}
                      onClick={() => handleAmountSelect(amount)}
                      disabled={loading}
                      style={{ opacity: loading ? 0.6 : 1 }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder={t('donation.customAmount', 'Enter custom amount')}
                  min="1"
                  disabled={loading}
                  contentBefore="$"
                />
              </div>

              {/* Message (Optional) */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.message', 'Message')} ({t('donation.optional', 'Optional')})
                </label>
                <Input
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('donation.messagePlaceholder', 'Share why you support NAACUS')}
                  disabled={loading}
                  multiline
                  rows={2}
                />
              </div>

              </div>

              {/* Payment Method Section */}
              <div className={styles.paymentSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: themeTokens.spacing.sm, marginBottom: themeTokens.spacing.sm }}>
                  <label className={styles.label} style={{ marginBottom: 0 }}>
                    {t('donation.paymentMethod', 'Payment Method')} <span className={styles.required}>*</span>
                  </label>
                  {selectedPayment && (
                    <div className={styles.speedBadge}>
                      {getSpeedBadge(selectedPayment)}
                    </div>
                  )}
                </div>
                <div className={styles.paymentMethods}>
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`${styles.paymentOption} ${
                        selectedPayment === method.id ? styles.paymentOptionSelected : ''
                      }`}
                      onClick={() => !loading && setSelectedPayment(method.id)}
                      style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', display: 'inline-flex' }}
                    >
                      <div className={`${styles.paymentMethodCard} ${
                        selectedPayment === method.id ? styles.paymentMethodCardSelected : ''
                      }`}>
                        <div className={styles.paymentMethodIconLabel}>
                          {method.iconPath || method.icon ? (
                            <img 
                              src={method.iconPath || method.icon} 
                              alt={method.label}
                              className={styles.paymentMethodIcon}
                            />
                          ) : (
                            <div className={styles.paymentMethodIcon}>💳</div>
                          )}
                          <span className={styles.paymentMethodLabel}>{method.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method Form - Outside payment methods container */}
                {selectedPayment && renderPaymentMethodForm(selectedPayment)}
                {selectedPayment && getMethodFeeInfo(selectedPayment) && (
                  <div className={styles.infoMessage} style={{ marginTop: themeTokens.spacing.sm, backgroundColor: 'rgba(255, 193, 7, 0.1)', borderLeft: `3px solid ${themeTokens.colors.status.warning || '#ffc107'}`, fontSize: themeTokens.typography.fontSize.sm }}>
                    ⚠️ {getPaymentLabel(selectedPayment)} {t('donation.feeWarning', 'may apply a fee')} - {getMethodFeeInfo(selectedPayment)}
                  </div>
                )}
                {selectedPayment && requiresAuthentication(selectedPayment) && (
                  <div className={styles.infoMessage} style={{ marginTop: themeTokens.spacing.sm }}>
                    🔐 {t('donation.authenticationRequired', 'You will be redirected to authenticate your payment securely')}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.dialogActions}>
                <Button
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  appearance="secondary"
                  disabled={loading}
                >
                  {t('donation.cancel', 'Cancel')}
                </Button>
                <Button
                  onClick={handleDonate}
                  appearance="primary"
                  style={{
                    backgroundColor: '#2d5a7b',
                    opacity: loading ? 0.7 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.loadingSpinner}>
                      <Spinner size="tiny" />
                      {t('donation.processing', 'Processing')}
                    </span>
                  ) : (
                    t('donation.donate', 'Donate Now')
                  )}
                </Button>
              </div>
        </DialogSurface>
      </Dialog>
    </>
  );
}

export default DonationDialog;