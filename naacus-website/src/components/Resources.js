import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button
} from '@fluentui/react-components';
import { 
  DocumentBulletList24Regular,
  News24Regular,
  FormNew24Regular
} from '@fluentui/react-icons';
import { getPartners } from '../data/resourcesData';
import { featureFlags } from '../config/featureFlags';
import { useAnalytics } from '../hooks/useAnalytics';
import { handleNavigation } from '../services/navigationService';
import { dataService } from '../services/dataService';

const useStyles = makeStyles({
  resources: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('50px', '20px'),
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    textAlign: 'center',
    marginBottom: '40px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '800px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
    display: 'block',
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '32px',
  },
  resourceCard: {
    ...shorthands.padding('30px', '20px'),
    textAlign: 'center',
    ...shorthands.transition('all', '0.3s', 'ease'),
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: tokens.shadow16,
    },
  },
  iconWrapper: {
    fontSize: '3rem',
    marginBottom: '20px',
    color: tokens.colorBrandBackground,
  },
  cardTitle: {
    fontSize: '1.3rem',
    marginBottom: '15px',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    display: 'block',
  },
  cardDescription: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    marginBottom: '20px',
    display: 'block',
  },
  partnerSection: {
    ...shorthands.padding('40px', '20px'),
    backgroundColor: '#f8f9fa',
    ...shorthands.borderRadius('12px'),
    marginTop: '40px',
    overflow: 'hidden',
  },
  partnerTitle: {
    fontSize: '2rem',
    marginBottom: '12px',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    textAlign: 'center',
    display: 'block',
  },
  partnerText: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '40px',
    textAlign: 'center',
    display: 'block',
  },
  carouselContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    ...shorthands.padding('20px', '0'),
  },
  carouselTrack: {
    display: 'flex',
    ...shorthands.gap('60px'),
    animationName: {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
    animationDuration: '30s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    '&:hover': {
      animationPlayState: 'paused',
    },
  },
  logoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '200px',
    height: '100px',
    ...shorthands.padding('20px'),
    backgroundColor: '#ffffff',
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    ...shorthands.transition('all', '0.3s', 'ease'),
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    },
  },
  logoText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    textAlign: 'center',
    lineHeight: '1.3',
  },
  ctaSection: {
    marginTop: '28px',
    ...shorthands.padding('28px', '20px'),
    backgroundColor: '#f7f9fc',
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '10px',
    display: 'block',
  },
  ctaText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    marginBottom: '18px',
    display: 'block',
  },
  ctaActions: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
  },
});

function Resources() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();
  const { trackResourceCTA, trackResourceDownload } = useAnalytics();

  // State for resource data
  const [resources, setResources] = useState([]);

  // Load resources from dataService
  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await dataService.getResources();
        const filtered = data.filter((resource) => {
          if (!resource.featureFlag) {
            return true;
          }
          return Boolean(featureFlags[resource.featureFlag]);
        });
        setResources(filtered);
      } catch (error) {
        console.error('Error loading resources:', error);
        setResources([]);
      }
    };

    loadResources();
  }, []);

  const partners = getPartners();

  const handleCtaNavigate = (path) => {
    handleNavigation({ path, sectionId: null, currentPathname: window.location.pathname, navigate });
  };

  const handleResourceClick = (resource) => {
    trackResourceCTA(`View ${resource.title}`, 'resource_click');
    trackResourceDownload(resource.title, 'resource');

    if (resource.actionType === 'route' && resource.actionTarget) {
      navigate(resource.actionTarget);
      return;
    }

    if (resource.actionType === 'external' && resource.actionTarget) {
      window.open(resource.actionTarget, '_blank', 'noopener,noreferrer');
      return;
    }

    if (resource.actionType === 'section' && resource.actionTarget) {
      const element = document.getElementById(resource.actionTarget);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Render icon based on iconType
  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'news':
        return <News24Regular />;
      case 'form':
        return <FormNew24Regular />;
      case 'document':
      default:
        return <DocumentBulletList24Regular />;
    }
  };

  return (
    <section id="resources" className={styles.resources}>
      <Text as="h2" className={styles.sectionTitle}>{t('resourcesPage.title')}</Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('resourcesPage.subtitle')}
      </Text>
      <div className={styles.content}>
        <div className={styles.resourcesGrid}>
          {resources.map((resource) => (
            <Card key={resource.id} className={styles.resourceCard}>
              <div className={styles.iconWrapper}>
                {renderIcon(resource.iconType)}
              </div>
              <Text className={styles.cardTitle}>{resource.title}</Text>
              <Text className={styles.cardDescription}>{resource.description}</Text>
              <Button 
                appearance="primary"
                onClick={() => handleResourceClick(resource)}
              >
                {resource.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className={styles.partnerSection}>
          <Text as="h3" className={styles.partnerTitle}>{t('resourcesPage.partners.title')}</Text>
          <Text as="p" className={styles.partnerText}>
            {t('resourcesPage.partners.description')}
          </Text>
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
              {/* First set of logos */}
              {partners.map((partner, index) => (
                <div key={`logo-1-${partner.id}`} className={styles.logoItem} title={partner.fullName}>
                  <Text className={styles.logoText}>{partner.name}</Text>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div key={`logo-2-${partner.id}`} className={styles.logoItem} title={partner.fullName}>
                  <Text className={styles.logoText}>{partner.name}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <Text as="h3" className={styles.ctaTitle}>{t('resourcesPage.ctaTitle')}</Text>
          <Text as="p" className={styles.ctaText}>{t('resourcesPage.ctaText')}</Text>
          <div className={styles.ctaActions}>
            <Button appearance="primary" onClick={() => handleCtaNavigate('/membership')}>
              {t('resourcesPage.ctaPrimary')}
            </Button>
            <Button appearance="secondary" onClick={() => handleCtaNavigate('/volunteer')}>
              {t('resourcesPage.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Resources;
