import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { colors } from '../config/theme';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 54px - 200px)',
    ...shorthands.padding('60px', '20px'),
    backgroundColor: colors.background.light,
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    ...shorthands.padding('40px'),
    backgroundColor: colors.neutral.white,
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  errorCode: {
    fontSize: '72px',
    fontWeight: '700',
    color: colors.button.primary,
    margin: '0 0 16px 0',
    lineHeight: '1',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: colors.primary.darkest,
    margin: '0 0 16px 0',
  },
  description: {
    fontSize: '16px',
    color: colors.neutral.mediumGray,
    ...shorthands.margin('0', '0', '24px', '0'),
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    ...shorthands.gap('12px'),
    justifyContent: 'center',
    ...shorthands.margin('32px', '0', '0', '0'),
    flexWrap: 'wrap',
  },
  homeButton: {
    backgroundColor: colors.button.primary,
    color: colors.button.text,
    fontWeight: '600',
    fontSize: '14px',
    ...shorthands.padding('12px', '24px'),
    border: 'none',
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: colors.button.primaryHover,
    },
  },
  secondaryButton: {
    backgroundColor: colors.neutral.lightGray,
    color: colors.primary.darkest,
    fontWeight: '600',
    fontSize: '14px',
    ...shorthands.padding('12px', '24px'),
    border: `1px solid ${colors.neutral.border}`,
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.neutral.lightGray2,
      borderColor: colors.button.primary,
    },
  },
});

function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>
          {t('notFound.title') || 'Page Not Found'}
        </h1>
        <p className={styles.description}>
          {t('notFound.description') || 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.homeButton} onClick={handleGoHome}>
            {t('notFound.goHome') || 'Go to Home'}
          </button>
          <button className={styles.secondaryButton} onClick={handleGoBack}>
            {t('notFound.goBack') || 'Go Back'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
