import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  makeStyles,
  shorthands,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import paymentService from '../services/paymentService';
import { trackCTAEvent } from '../services/analyticsService';

const useStyles = makeStyles({
  donateButtonContainer: {
    position: 'fixed',
    top: '70px',
    right: '16px',
    zIndex: 999,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  donateButtonMobileHeader: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  dialogBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  dialogWrapper: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('20px'),
    '@media (max-width: 768px)': {
      maxHeight: '80vh',
      width: '95%',
      maxWidth: 'none',
    },
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    marginBottom: '6px',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  required: {
    color: '#d13438',
  },
  paymentMethods: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('12px'),
    marginBottom: '16px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  paymentOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('16px'),
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.borderRadius('12px'),
    cursor: 'pointer',
    backgroundColor: tokens.colorNeutralBackground1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    minHeight: '160px',
    '&:hover': {
      borderColor: tokens.colorBrandBackground,
      backgroundColor: 'rgba(45, 90, 123, 0.04)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
    },
  },
  paymentOptionSelected: {
    borderColor: tokens.colorBrandBackground,
    backgroundColor: 'rgba(45, 90, 123, 0.1)',
    boxShadow: '0 4px 12px rgba(45, 90, 123, 0.15)',
  },
  radioButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  radioButtonSelected: {
    borderColor: tokens.colorBrandBackground,
    backgroundColor: tokens.colorBrandBackground,
    boxShadow: '0 0 0 2px rgba(45, 90, 123, 0.2)',
  },
  radioButtonInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  amountPresets: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    ...shorthands.gap('4px'),
    marginBottom: '8px',
  },
  amountButton: {
    padding: '4px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius('6px'),
    cursor: 'pointer',
    backgroundColor: tokens.colorNeutralBackground1,
    fontSize: '0.8rem',
    fontWeight: '500',
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
  dialogContent: {
    padding: '16px',
    overflowY: 'auto',
    flex: 1,
  },
  dialogTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    padding: '4px',
  },
  dialogActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  errorMessage: {
    color: '#d13438',
    fontSize: '0.85rem',
    marginTop: '4px',
    padding: '8px 12px',
    backgroundColor: 'rgba(209, 52, 56, 0.1)',
    borderRadius: '6px',
  },
  successMessage: {
    color: '#107c10',
    fontSize: '0.85rem',
    marginTop: '4px',
    padding: '8px 12px',
    backgroundColor: 'rgba(16, 124, 16, 0.1)',
    borderRadius: '6px',
  },
  warningMessage: {
    color: '#ff8c00',
    fontSize: '0.85rem',
    marginTop: '4px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
    borderRadius: '6px',
  },
  processingTime: {
    fontSize: '0.8rem',
    color: tokens.colorNeutralForeground3,
    marginTop: '6px',
    fontWeight: '500',
  },
  paymentMethodCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  paymentMethodIcon: {
    width: '48px',
    height: '48px',
    marginBottom: '12px',
    color: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px',
  },
});

export function DonationDialog() {
  const styles = useStyles();
  const { t } = useTranslation();
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
  });
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedAmount, setSelectedAmount] = useState('');

  const amountPresets = [25, 50, 100, 250];

  // Payment method configurations with icons
  const paymentMethodsConfig = {
    card: {
      id: 'card',
      label: t('donation.creditDebit', 'Credit/Debit Card'),
      iconPath: '/icons/credit-card.svg',
      processingTime: t('donation.instant', 'Instant'),
    },
    applePay: {
      id: 'applePay',
      label: t('donation.applePay', 'Apple Pay'),
      iconPath: '/icons/apple-pay.svg',
      processingTime: t('donation.instant', 'Instant'),
    },
    googlePay: {
      id: 'googlePay',
      label: t('donation.googlePay', 'Google Pay'),
      iconPath: '/icons/google-pay.svg',
      processingTime: t('donation.instant', 'Instant'),
    },
    paypal: {
      id: 'paypal',
      label: t('donation.paypal', 'PayPal'),
      iconPath: '/icons/paypal.svg',
      processingTime: t('donation.instant', 'Instant'),
    },
    bank: {
      id: 'bank',
      label: t('donation.bankTransfer', 'Bank Transfer'),
      iconPath: '/icons/bank-transfer.svg',
      processingTime: t('donation.processingTime', '1-5 business days'),
    },
    crypto: {
      id: 'crypto',
      label: t('donation.bitcoin', 'Bitcoin/Crypto'),
      iconPath: '/icons/bitcoin.svg',
      processingTime: t('donation.blockchainConfirm', 'Blockchain confirmed'),
    },
    cashapp: {
      id: 'cashapp',
      label: t('donation.cashapp', 'Cash App'),
      iconPath: '/icons/cash-app.svg',
      processingTime: t('donation.instant', 'Instant'),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

      // Process payment based on selected method
      try {
        await paymentService.processPayment(formData, selectedPayment);
      } catch (paymentErr) {
        console.error('Payment processing error:', paymentErr);
        throw new Error(
          paymentErr.message || `${selectedPayment} payment processing failed. Please check your information and try again.`
        );
      }

      // Track donation event
      try {
        await trackCTAEvent({
          category: 'donation',
          action: 'donation_initiated',
          label: selectedPayment,
          value: formData.amount,
        });
      } catch (analyticsErr) {
        console.warn('Analytics tracking warning:', analyticsErr);
      }

      // Track donation
      try {
        await paymentService.trackDonation(formData, selectedPayment, 'success');
      } catch (trackErr) {
        console.warn('Donation tracking warning:', trackErr);
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

      // Send confirmation email
      try {
        await paymentService.sendConfirmationEmail(formData, selectedPayment, 'processing');
      } catch (emailErr) {
        console.warn('Email sending warning:', emailErr);
      }

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);
    } catch (err) {
      const errorMsg = err.message || t('donation.paymentFailed', 'Payment processing failed. Please try again.');
      setError(errorMsg);
      console.error('Donation error:', err);

      // Track failed donation
      try {
        await paymentService.trackDonation(formData, selectedPayment, 'failed');
      } catch (trackErr) {
        console.warn('Failed donation tracking warning:', trackErr);
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
    });
    setSelectedAmount('');
    setSelectedPayment('card');
    setError('');
    setSuccess('');
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

  return (
    <>
      <div className={styles.donateButtonContainer}>
        <Button
          appearance="primary"
          style={{
            backgroundColor: '#2d5a7b',
            color: 'white',
            minWidth: '100px',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: '600',
          }}
          onClick={() => setOpen(true)}
        >
          💝 {t('header.donate', 'Donate')}
        </Button>
      </div>

      <Button
        appearance="primary"
        className={styles.donateButtonMobileHeader}
        style={{
          backgroundColor: '#2d5a7b',
          color: 'white',
          padding: '6px 8px',
          fontSize: '11px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
        }}
        onClick={() => setOpen(true)}
      >
        💝 {t('header.donate', 'Donate')}
      </Button>

      {open && (
        <div className={styles.dialogBackdrop} onClick={() => { setOpen(false); resetForm(); }}>
          <div className={styles.dialogWrapper} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogContent}>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <h2 className={styles.dialogTitle}>{t('donation.title', 'Make a Donation')}</h2>
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

              {/* Payment Method */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  {t('donation.paymentMethod', 'Payment Method')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.paymentMethods}>
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`${styles.paymentOption} ${
                        selectedPayment === method.id ? styles.paymentOptionSelected : ''
                      }`}
                      onClick={() => !loading && setSelectedPayment(method.id)}
                      style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      <div className={`${styles.radioButton} ${
                        selectedPayment === method.id ? styles.radioButtonSelected : ''
                      }`}>
                        {selectedPayment === method.id && <div className={styles.radioButtonInner}></div>}
                      </div>
                      <div className={styles.paymentMethodCard}>
                        {method.iconPath || method.icon ? (
                          <img 
                            src={method.iconPath || method.icon} 
                            alt={method.label}
                            className={styles.paymentMethodIcon}
                          />
                        ) : (
                          <div className={styles.paymentMethodIcon}>💳</div>
                        )}
                        <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{method.label}</span>
                        <div className={styles.processingTime}>{method.processingTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Processing Info */}
              {selectedPayment === 'bank' && (
                <div className={styles.warningMessage}>
                  ℹ️ {t('donation.bankInfo', 'You will receive payment instructions via email')}
                </div>
              )}

              {selectedPayment === 'crypto' && (
                <div className={styles.warningMessage}>
                  ℹ️ {t('donation.cryptoInfo', 'Cryptocurrency charges are processed securely on blockchain')}
                </div>
              )}

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DonationDialog;
