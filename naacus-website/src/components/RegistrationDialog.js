import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Input,
  Textarea,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
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
    zIndex: 1000,
  },
  dialogWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('24px'),
    overflowY: 'auto',
    margin: '20px',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    ...shorthands.padding('4px'),
    color: tokens.colorNeutralForeground2,
    fontSize: '24px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  registrationForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontWeight: '600',
    fontSize: '0.875rem',
    color: '#1a3a52',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    justifyContent: 'flex-end',
  },
});

export default function RegistrationDialog({
  open,
  selectedEvent,
  submissionSuccess,
  formMessage,
  registrationForm,
  isSubmitting,
  onFormChange,
  onSubmit,
  onClose,
  onNewRegistration,
}) {
  const { t } = useTranslation();
  const styles = useStyles();

  if (!open || !selectedEvent) return null;

  return (
    <div className={styles.dialogBackdrop} onClick={onClose}>
      <div className={styles.dialogWrapper} onClick={(e) => e.stopPropagation()}>
        {submissionSuccess && (
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('events.close', 'Close')}
          >
            <Dismiss24Regular />
          </button>
        )}
        
        {!submissionSuccess && (
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', marginTop: '0' }}>
            {t('events.registerForEvent', 'Register for Event')}
          </h2>
        )}

        {submissionSuccess ? (
          <div>
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <MessageBar intent="success">
                <MessageBarBody>
                  <MessageBarTitle>{t('events.success.title', 'Success!')}</MessageBarTitle>
                  {t('events.success.registrationStored', 'Registration submitted successfully! We will follow up via email.')}
                </MessageBarBody>
              </MessageBar>
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onNewRegistration}
                style={{
                  color: '#2d5a7b',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                {t('events.submitAnother', 'Submit Another Registration')}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.registrationForm}>
            <div>
              <strong>{selectedEvent.title}</strong>
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                {selectedEvent.date} • {selectedEvent.location}
              </div>
            </div>

            {formMessage && (
              <MessageBar intent={formMessage.type}>
                <MessageBarBody>
                  <MessageBarTitle>
                    {formMessage.type === 'success' && t('events.success.title', 'Success!')}
                    {formMessage.type === 'error' && t('events.errors.title', 'Error')}
                    {formMessage.type === 'warning' && t('events.warnings.title', 'Warning')}
                  </MessageBarTitle>
                  {formMessage.message}
                </MessageBarBody>
              </MessageBar>
            )}

            <div className={styles.formField}>
              <label className={styles.formLabel}>{t('events.firstName', 'First Name')} *</label>
              <Input
                value={registrationForm.firstName}
                onChange={(e) => onFormChange('firstName', e.target.value)}
                placeholder="Kwame"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>{t('events.lastName', 'Last Name')} *</label>
              <Input
                value={registrationForm.lastName}
                onChange={(e) => onFormChange('lastName', e.target.value)}
                placeholder="Mensah"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>{t('events.email', 'Email')} *</label>
              <Input
                type="email"
                value={registrationForm.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                placeholder="kwame.mensah@example.com"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>{t('events.phone', 'Phone')}</label>
              <Input
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                placeholder="(123) 456-7890"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>{t('events.message', 'Message')}</label>
              <Textarea
                value={registrationForm.message}
                onChange={(e) => onFormChange('message', e.target.value)}
                placeholder="Any additional information..."
                rows={4}
              />
            </div>

            <div className={styles.formActions}>
              <Button appearance="secondary" onClick={onClose}>
                {t('events.cancel', 'Cancel')}
              </Button>
              <Button 
                appearance="primary" 
                onClick={onSubmit}
                disabled={!registrationForm.firstName || !registrationForm.lastName || !registrationForm.email || isSubmitting}
              >
                {isSubmitting ? t('events.submitting', 'Submitting...') : t('events.submitRegistration', 'Submit Registration')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
