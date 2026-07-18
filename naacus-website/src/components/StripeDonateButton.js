import React, { useEffect, useState } from 'react';
import { makeStyles, Button } from '@fluentui/react-components';
import { Heart24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { startSpan } from '../services/telemetryService';
import { colors, themeTokens } from '../config/theme';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  containerCompact: {
    justifyContent: 'flex-end',
  },
  donateButton: {
    marginTop: '8px',
    alignSelf: 'flex-start',
  },
  donateButtonCompact: {
    marginTop: 0,
    minHeight: '44px',
    paddingLeft: '22px',
    paddingRight: '22px',
    borderRadius: '50px',
    fontSize: themeTokens.typography.fontSize.base,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    backgroundColor: colors.button.primary,
    color: colors.button.text,
    border: 'none',
    boxShadow: themeTokens.shadows.md,
    transitionProperty: 'transform, box-shadow, background-color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-in-out',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: themeTokens.shadows.hover,
      backgroundColor: colors.button.primaryHover,
    },
  },
});

const StripeDonateButton = ({ compact = false }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleViewportChange = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const compactPillStyle = compact
    ? {
        marginTop: '0',
        minHeight: isMobile ? '52px' : '44px',
        minWidth: isMobile ? '52px' : 'auto',
        width: isMobile ? '52px' : 'auto',
        padding: isMobile ? '12px' : '12px 24px',
        borderRadius: isMobile ? '26px' : '50px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: '#0067b8',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 6px 16px rgba(0, 103, 184, 0.35)',
        transition: 'all 0.3s ease',
      }
    : undefined;

  const handleDonateClick = () => {
    const span = startSpan('donation.fallback_open', {
      'donation.provider': 'initiative_selector',
      'donation.compact': compact,
    });
    span.end({ code: 1 });
    navigate('/donation');
  };

  return (
    <div className={`${styles.container} ${compact ? styles.containerCompact : ''}`}>
      <Button
        appearance="primary"
        className={`${styles.donateButton} ${compact ? styles.donateButtonCompact : ''}`}
        icon={<Heart24Regular />}
        onClick={handleDonateClick}
        style={compactPillStyle}
        aria-label="Donate"
        onMouseEnter={(e) => {
          if (!compact) {
            return;
          }
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 103, 184, 0.45)';
          e.currentTarget.style.backgroundColor = '#005a9e';
        }}
        onMouseLeave={(e) => {
          if (!compact) {
            return;
          }
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 103, 184, 0.35)';
          e.currentTarget.style.backgroundColor = '#0067b8';
        }}
      >
        {compact && isMobile ? '' : 'Donate'}
      </Button>
    </div>
  );
};

export default StripeDonateButton;
