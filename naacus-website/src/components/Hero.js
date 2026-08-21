import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { handleNavigation } from '../services/navigationService';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  hero: {
    position: 'relative',
    background: `linear-gradient(135deg, #0f4c81 0%, #1a6fb8 50%, #2a8fd8 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('20px', '20px', '20px'),
    minHeight: '700px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: '0',
    '@media (max-width: 768px)': {
      padding: '54px 24px 80px',
      minHeight: '600px',
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 76, 129, 0.55)',
      pointerEvents: 'none',
      zIndex: 1,
    },
  },
  backgroundSlideshow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
  },
  backgroundImageActive: {
    opacity: 0.7,
  },
  emojiDecorator: {
    fontSize: '1.8rem',
    filter: 'grayscale(100%) contrast(1.1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
  },
  benefitCheckmark: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    filter: 'grayscale(100%) contrast(1.1)',
  },
  buttonEmoji: {
    filter: 'grayscale(100%) contrast(1.1)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
    marginTop: '-40px',
    '@media (max-width: 768px)': {
      padding: '0 8px',
      marginTop: '-10px',
    },
  },
  heroTitle: {
    fontSize: '5rem',
    fontWeight: '700',
    // marginBottom: '32px',
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    textShadow: '0 6px 24px rgba(0, 0, 0, 0.6), 0 3px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Georgia, "Times New Roman", serif',
    '@media (max-width: 768px)': {
      fontSize: '2.25rem',
      marginBottom: '20px',
      lineHeight: '1.2',
      textShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
    },
  },
  heroSubtitle: {
    fontSize: '1.75rem',
    marginBottom: '24px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.98)',
    display: 'block',
    textAlign: 'center',
    lineHeight: '1.6',
    textShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
    letterSpacing: '0.5px',
    '@media (max-width: 768px)': {
      fontSize: '1.125rem',
      marginBottom: '16px',
      lineHeight: '1.5',
      textShadow: '0 3px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
    },
  },
  heroDescription: {
    fontSize: '1.25rem',
    marginBottom: '48px',
    lineHeight: '1.9',
    color: 'rgba(255, 255, 255, 0.98)',
    opacity: 1,
    display: 'block',
    textAlign: 'center',
    maxWidth: '920px',
    margin: '0 auto 48px',
    fontWeight: '400',
    textShadow: '0 3px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '32px',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)',
    },
  },
  heroButtons: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    alignItems: 'center',
    marginTop: '40px',
    maxWidth: '800px',
    margin: '40px auto 0',
  },
  primaryCTA: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
    color: '#0f4c81',
    border: '2px solid rgba(255, 255, 255, 0.9)',
    fontSize: '0.95rem',
    padding: '12px 32px',
    fontWeight: '700',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    minWidth: '200px',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 12px 40px rgba(255, 255, 255, 0.4), 0 6px 20px rgba(0, 0, 0, 0.25)',
      background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
    },
    '&:active': {
      transform: 'translateY(-2px)',
    },
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      padding: '10px 24px',
      minWidth: '160px',
      letterSpacing: '0.4px',
    },
  },
  secondaryActions: {
    display: 'flex',
    ...shorthands.gap('20px'),
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  secondaryButton: {
    border: '2px solid rgba(255, 255, 255, 0.75)',
    color: 'rgba(255, 255, 255, 0.98)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    fontSize: '0.95rem',
    padding: '12px 28px',
    fontWeight: '600',
    borderRadius: '12px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    flex: '1',
    minWidth: '160px',
    maxWidth: '220px',
    cursor: 'pointer',
    letterSpacing: '0.2px',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
    },
  },
  secondaryLinks: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    justifyContent: 'center',
    marginTop: '4px',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      flexDirection: 'column',
      ...shorthands.gap('8px'),
    },
  },
  ghostLink: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    transition: 'color 0.2s ease',
    padding: '0',
    letterSpacing: '0.3px',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.98)',
    },
  },
  linkDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.85rem',
    userSelect: 'none',
  },
  benefitsList: {
    display: 'flex',
    ...shorthands.gap('40px'),
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      ...shorthands.gap('16px'),
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    fontSize: '1.05rem',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
    '@media (max-width: 768px)': {
      fontSize: '0.9rem',
      ...shorthands.gap('6px'),
    },
  },
});

function Hero() {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const { trackMembershipCTA, trackEventCTA, trackMinistryCTA } = useAnalytics();
  const heroRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultHeroImages = [
    '/images/hero/0cddcc4.webp',
    '/images/hero/1ece201.webp',
    '/images/hero/2074c6e.webp',
  ];

  const [heroImages, setHeroImages] = useState(defaultHeroImages);

  useEffect(() => {
    let isMounted = true;

    const loadHeroImages = async () => {
      try {
        const response = await fetch('/content/hero-images.json', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!isMounted) {
          return;
        }

        if (Array.isArray(payload?.images) && payload.images.length > 0) {
          const sanitized = payload.images
            .map((item) => {
              if (typeof item === 'string') {
                return item.trim();
              }

              if (item && typeof item === 'object' && typeof item.image === 'string') {
                return item.image.trim();
              }

              return '';
            })
            .filter((item) => item.length > 0);

          if (sanitized.length > 0) {
            setHeroImages(sanitized);
            setCurrentImageIndex(0);
          }
        }
      } catch (error) {
        // Keep defaults when content config cannot be loaded.
      }
    };

    loadHeroImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleJoinClick = () => {
    trackMembershipCTA('Join Community', 'hero_primary_cta');
    handleNavigation({ path: '/membership', sectionId: null, currentPathname: '/', navigate });
  };

  const handleMinistriesClick = () => {
    trackMinistryCTA('Explore Our Ministries', 'hero_secondary_cta');
    handleNavigation({ path: '/fellowship-ministries', sectionId: null, currentPathname: '/', navigate });
  };

  const handleConventionClick = () => {
    trackEventCTA('Convention 2027', 'hero_secondary_cta');
    document.getElementById('convention-2027')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={styles.hero} ref={heroRef}>
      <div className={styles.backgroundSlideshow}>
        <img
          src={heroImages[currentImageIndex]}
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className={`${styles.backgroundImage} ${styles.backgroundImageActive}`}
        />
      </div>
      <div className={styles.heroContent}>
        <Text as="h1" className={styles.heroTitle}>{t('hero.title')}</Text>
        <Text as="p" className={styles.heroSubtitle}>
          {t('hero.subtitle')}
        </Text>
        <Text as="p" className={styles.heroDescription}>{t('hero.description')}</Text>

        <div className={styles.heroButtons}>
          <div className={styles.primaryCTA}>
            <button
              onClick={handleJoinClick}
              className={styles.primaryButton}
            >
              {t('heroButtons.becomeMember')}
            </button>
          </div>
          <div className={styles.secondaryActions}>
            <button onClick={handleMinistriesClick} className={styles.secondaryButton}>
              {t('heroButtons.exploreMinistries')}
            </button>
            <button onClick={handleConventionClick} className={styles.secondaryButton}>
              {t('heroButtons.convention2027')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
