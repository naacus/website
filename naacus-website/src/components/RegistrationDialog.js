import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  makeStyles,
  shorthands,
  Button,
  Input,
  Textarea,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialog: {
    maxWidth: '600px',
    minHeight: '500px',
    '@media (max-width: 768px)': {
      maxWidth: '95vw',
      minHeight: '400px',
    },
  },
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflowY: 'auto',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px'),
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('20px', '24px'),
    borderBottom: '1px solid #e5e5e5',
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
    ...shorthands.gap('12px'),
    justifyContent: 'flex-end',
    ...shorthands.padding('24px'),
    borderTop: '1px solid #e5e5e5',
    flex: 'none',
    marginTop: '0',
  },
  dialogTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#262626',
    margin: '0',
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
  const fieldIds = {
    firstName: 'registration-first-name',
    lastName: 'registration-last-name',
    email: 'registration-email',
    phone: 'registration-phone',
    message: 'registration-message',
  };

  if (!open || !selectedEvent) return null;

  const handleDialogChange = (event, data) => {
    if (!data.open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange} className={styles.dialog}>
      <DialogSurface className={styles.dialogSurface}>
        {/* Header - shown only when not in success state */}
        {!submissionSuccess && (
          <div className={styles.dialogHeader}>
            <h2 className={styles.dialogTitle}>
              {t('events.registerForEvent')}
            </h2>
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={onClose}
              aria-label={t('events.closeRegistrationDialog')}
              style={{ color: '#999999' }}
            />
          </div>
        )}

        <DialogBody className={styles.dialogBody}>
          {submissionSuccess ? (
            <div>
              <div style={{ textAlign: 'center' }}>
                <MessageBar intent="success">
                  <MessageBarBody>
                    <MessageBarTitle>{t('events.success.title')}</MessageBarTitle>
                    {t('events.success.registrationStored')}
                  </MessageBarBody>
                </MessageBar>
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
                      {formMessage.type === 'success' && t('events.success.title')}
                      {formMessage.type === 'error' && t('events.errors.title')}
                      {formMessage.type === 'warning' && t('events.warnings.title')}
                    </MessageBarTitle>
                    {formMessage.message}
                  </MessageBarBody>
                </MessageBar>
              )}

              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor={fieldIds.firstName}>{t('events.firstName')} *</label>
                <Input
                  id={fieldIds.firstName}
                  value={registrationForm.firstName}
                  onChange={(e) => onFormChange('firstName', e.target.value)}
                  placeholder="Kwame"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor={fieldIds.lastName}>{t('events.lastName')} *</label>
                <Input
                  id={fieldIds.lastName}
                  value={registrationForm.lastName}
                  onChange={(e) => onFormChange('lastName', e.target.value)}
                  placeholder="Mensah"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor={fieldIds.email}>{t('events.email')} *</label>
                <Input
                  id={fieldIds.email}
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  placeholder="kwame.mensah@example.com"
                  required
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor={fieldIds.phone}>{t('events.phone')}</label>
                <Input
                  id={fieldIds.phone}
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) => onFormChange('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor={fieldIds.message}>{t('events.message')}</label>
                <Textarea
                  id={fieldIds.message}
                  value={registrationForm.message}
                  onChange={(e) => onFormChange('message', e.target.value)}
                  placeholder="Any additional information..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </DialogBody>

        {/* Form Actions - sticky footer */}
        {!submissionSuccess && (
          <div className={styles.formActions}>
            <Button appearance="secondary" onClick={onClose}>
              {t('events.cancel')}
            </Button>
            <Button 
              appearance="primary" 
              onClick={onSubmit}
              disabled={!registrationForm.firstName || !registrationForm.lastName || !registrationForm.email || isSubmitting}
            >
              {isSubmitting ? t('events.submitting') : t('events.submitRegistration')}
            </Button>
          </div>
        )}

        {submissionSuccess && (
          <div className={styles.formActions}>
            <Button 
              appearance="primary"
              onClick={onNewRegistration}
            >
              {t('events.submitAnother')}
            </Button>
          </div>
        )}
      </DialogSurface>
    </Dialog>
  );
}
