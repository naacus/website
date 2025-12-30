import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogSurface,
  DialogBody,
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
  dialogSurface: {
    maxWidth: '600px',
    minWidth: '300px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 768px)': {
      maxWidth: '95vw',
      width: '95vw',
      maxHeight: '95vh',
      minHeight: '400px',
    },
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flex: 1,
    ...shorthands.gap('16px'),
  },
  dialogHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#ffffff',
    zIndex: 10,
    flex: 'none',
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
  dialogTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: '0',
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

  const handleDialogChange = (event, data) => {
    if (!data.open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogSurface className={styles.dialogSurface}>
        {/* Sticky Header */}
        {!submissionSuccess && (
          <div className={styles.dialogHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.dialogTitle}>
                {t('events.registerForEvent', 'Register for Event')}
              </h2>
              <button 
                onClick={onClose}
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: tokens.colorNeutralForeground2,
                  fontSize: '24px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={t('events.close', 'Close')}
              >
                <Dismiss24Regular />
              </button>
            </div>
          </div>
        )}

        <DialogBody className={styles.dialogBody}>

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
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
