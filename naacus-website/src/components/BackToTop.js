import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  Button
} from '@fluentui/react-components';
import { ArrowUp24Regular } from '@fluentui/react-icons';
import { themeTokens, colors } from '../config/theme';

const useStyles = makeStyles({
  backToTop: {
    position: 'fixed',
    bottom: themeTokens.componentPositioning.backToTop.bottom,
    right: themeTokens.componentPositioning.backToTop.right,
    zIndex: themeTokens.componentPositioning.backToTop.zIndex,
    pointerEvents: 'none',
    opacity: 0,
    transform: 'translateY(20px)',
    visibility: 'hidden',
    transitionProperty: 'opacity, visibility, transform',
    transitionDuration: themeTokens.typography.fontSize.md,
    transitionTimingFunction: 'ease-in-out',
    '@media (max-width: 768px)': {
      bottom: themeTokens.componentPositioning.backToTop.bottomMobile,
      right: '12px',
      left: 'auto',
    },
  },
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
    transform: 'translateY(0)',
    visibility: 'visible',
  },
  button: {
    ...shorthands.padding('14px', '28px'),
    ...shorthands.borderRadius('50px'),
    backgroundColor: colors.button.primary,
    color: colors.button.text,
    boxShadow: themeTokens.shadows.md,
    fontSize: themeTokens.typography.fontSize.md,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    border: 'none',
    minWidth: 'fit-content',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: themeTokens.shadows.hover,
      backgroundColor: colors.button.primaryHover,
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('12px'),
      minWidth: '52px',
      width: '52px',
      height: '52px',
      ...shorthands.borderRadius('26px'),
      '& [class*="fui-Button__icon"]': {
        marginLeft: '0 !important',
      },
    },
  },
  textShowDesktop: {
    display: 'inline',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

function BackToTop() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}>
      <Button
        appearance="subtle"
        icon={<ArrowUp24Regular />}
        iconPosition="after"
        onClick={scrollToTop}
        className={styles.button}
        aria-label={t('backToTop')}
        style={{
          padding: '12px 24px',
          borderRadius: '50px',
          backgroundColor: '#0067b8',
          color: '#ffffff',
          boxShadow: '0 6px 16px rgba(0, 103, 184, 0.35)',
          fontSize: '14px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 103, 184, 0.45)';
          e.currentTarget.style.backgroundColor = '#005a9e';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 103, 184, 0.35)';
          e.currentTarget.style.backgroundColor = '#0067b8';
        }}
      >
        <span className={styles.textShowDesktop}>
          {t('backToTop')}
        </span>
      </Button>
    </div>
  );
}

export default BackToTop;
