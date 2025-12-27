import React from 'react';
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
import { handleNavigation } from '../services/navigationService';
import { dataService } from '../services/dataService';
import { useAnalytics } from '../hooks/useAnalytics';
import { siteLinks } from '../config/siteLinks';
import { resourcesQuickLinks } from '../data/resourcesQuickLinks';
import {
  People24Regular,
  Calendar24Regular,
  BookOpen24Regular,
  Heart24Regular,
  Globe24Regular,
  Star24Regular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  benefits: {
    backgroundColor: '#ffffff',
    ...shorthands.padding('60px', '20px'),
  },
  benefitsTitle: {
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
  benefitsSubtitle: {
    fontSize: '1.25rem',
    textAlign: 'center',
    marginBottom: '48px',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    maxWidth: '700px',
    margin: '0 auto 48px',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      marginBottom: '32px',
      padding: '0 10px',
    },
  },
  benefitsContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('32px'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('24px'),
    },
  },
  benefitCard: {
    ...shorthands.padding('32px', '28px'),
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    ...shorthands.borderRadius('12px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    ...shorthands.border('2px', 'solid', 'transparent'),
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px rgba(0, 120, 212, 0.15)',
      ...shorthands.border('2px', 'solid', tokens.colorBrandBackground),
    },
  },
  benefitIcon: {
    fontSize: '3rem',
    color: tokens.colorBrandBackground,
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: '1.375rem',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: '1.125rem',
    },
  },
  benefitDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },
  cardActions: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  linkList: {
    marginTop: '16px',
    textAlign: 'left'
  },
  linkItem: {
    display: 'block',
    marginTop: '6px',
    color: '#0067b8',
    textDecoration: 'none'
  },
  ctaSection: {
    textAlign: 'center',
    backgroundColor: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4f8 100%)',
    ...shorthands.padding('28px', '24px'),
    ...shorthands.borderRadius('12px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px', '16px'),
      gap: '12px',
    },
  },
  ctaButtonsContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      gap: '12px',
    },
  },
  ctaText: {
    fontSize: '1.2rem',
    marginBottom: '0',
    color: tokens.colorBrandBackground,
    fontWeight: '700',
    display: 'block',
    letterSpacing: '-0.01em',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
    },
  },
  ctaButton: {
    fontSize: '0.95rem',
    padding: '10px 40px',
    height: 'auto',
    fontWeight: '600',
    minWidth: '160px',
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    ...shorthands.gap('32px'),
    marginBottom: '40px',
    ...shorthands.padding('32px', '20px'),
    backgroundColor: '#f8f9fa',
    ...shorthands.borderRadius('12px'),
    '@media (max-width: 768px)': {
      ...shorthands.gap('24px'),
      ...shorthands.padding('24px', '16px'),
    },
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    display: 'block',
    lineHeight: '1',
    '@media (max-width: 768px)': {
      fontSize: '2.25rem',
    },
  },
  statLabel: {
    fontSize: '1rem',
    color: tokens.colorNeutralForeground2,
    marginTop: '8px',
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: '0.875rem',
    },
  },
});

function MemberBenefits() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();
  const { trackMembershipCTA, trackVolunteerCTA } = useAnalytics();

  // Get benefits data from service
  const benefitsData = dataService.getMemberBenefits();

  // Map icons to benefits
  const iconMap = {
    'community': <People24Regular />,
    'events': <Calendar24Regular />,
    'resources': <BookOpen24Regular />,
    'spiritual': <Heart24Regular />,
    'network': <Globe24Regular />,
    'leadership': <Star24Regular />
  };

  // Combine benefits data with icons and translations
  const benefits = benefitsData.map(key => ({
    key,
    icon: iconMap[key],
    title: t(`memberBenefits.${key}.title`),
    description: t(`memberBenefits.${key}.description`)
  }));

  const handleBecomeMember = () => {
    trackMembershipCTA('Become a Member', 'member_benefits_cta');
    handleNavigation({ path: '/membership', sectionId: null, currentPathname: '/', navigate });
  };

  const handleBecomeVolunteer = () => {
    trackVolunteerCTA('Become a Volunteer', 'member_benefits_cta');
    handleNavigation({ path: '/volunteer', sectionId: null, currentPathname: '/', navigate });
  };

  const handleViewCalendar = () => {
    if (siteLinks.calendarUrl) {
      window.open(siteLinks.calendarUrl, '_blank', 'noopener,noreferrer');
    } else {
      handleNavigation({ path: '/events', sectionId: null, currentPathname: '/', navigate });
    }
  };

  const handleGoToLeadership = () => {
    handleNavigation({ path: '/', sectionId: 'leadership', currentPathname: '/', navigate });
  };

  return (
    <section id="member-benefits" className={styles.benefits}>
      <div className={styles.benefitsContent}>
        <Text as="h2" className={styles.benefitsTitle}>
          {t('memberBenefits.title')}
        </Text>
        <Text as="p" className={styles.benefitsSubtitle}>
          {t('memberBenefits.subtitle')}
        </Text>

        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <Text className={styles.statNumber}>10,000+</Text>
            <Text className={styles.statLabel}>{t('memberBenefits.stats.members')}</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statNumber}>50+</Text>
            <Text className={styles.statLabel}>{t('memberBenefits.stats.communities')}</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statNumber}>100+</Text>
            <Text className={styles.statLabel}>{t('memberBenefits.stats.events')}</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statNumber}>25+</Text>
            <Text className={styles.statLabel}>{t('memberBenefits.stats.states')}</Text>
          </div>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <Card key={index} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{benefit.icon}</div>
              <Text className={styles.benefitTitle}>{benefit.title}</Text>
              <Text className={styles.benefitDescription}>{benefit.description}</Text>

              {benefit.key === 'events' && (
                <div className={styles.cardActions}>
                  <Button appearance="primary" onClick={handleViewCalendar}>
                    {t('memberBenefits.events.cta', 'View Calendar')}
                  </Button>
                </div>
              )}

              {benefit.key === 'resources' && (
                <div className={styles.linkList}>
                  <Text weight="semibold">{t('memberBenefits.resources.linksTitle', 'Quick Links and Contacts')}</Text>
                  {/* Contacts */}
                  {resourcesQuickLinks.contacts.map((item, i) => {
                    if (item.type === 'internal') {
                      return (
                        <a 
                          key={`contact-${i}`} 
                          className={styles.linkItem} 
                          href={`${item.value.path}#${item.value.sectionId}`}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            handleNavigation({ 
                              path: item.value.path, 
                              sectionId: item.value.sectionId, 
                              currentPathname: '/', 
                              navigate 
                            }); 
                          }}
                        >
                          {item.label}
                        </a>
                      );
                    }
                    if (item.type === 'email') {
                      return (
                        <a key={`contact-${i}`} className={styles.linkItem} href={`mailto:${item.value}`}>{item.label}</a>
                      );
                    }
                    return null;
                  })}
                  {/* Support */}
                  {resourcesQuickLinks.support.map((item, i) => (
                    item.type === 'tel' ? (
                      <a key={`support-${i}`} className={styles.linkItem} href={`tel:${item.value}`}>{item.label}</a>
                    ) : (
                      <a key={`support-${i}`} className={styles.linkItem} href={item.value} target="_blank" rel="noopener noreferrer">{item.label}</a>
                    )
                  ))}
                  {/* Prayer */}
                  {resourcesQuickLinks.prayer.map((item, i) => (
                    <a key={`prayer-${i}`} className={styles.linkItem} href={item.value} target="_blank" rel="noopener noreferrer">{item.label}</a>
                  ))}
                </div>
              )}

              {benefit.key === 'community' && (
                <div className={styles.cardActions}>
                  <Button appearance="secondary" onClick={() => window.open(siteLinks.youtubeChannel, '_blank', 'noopener,noreferrer')}>
                    {t('memberBenefits.community.youtubeCta', 'Visit YouTube Channel')}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <Text as="p" className={styles.ctaText}>
            {t('memberBenefits.cta')}
          </Text>
          <div className={styles.ctaButtonsContainer}>
            <Button 
              appearance="primary"
              className={styles.ctaButton}
              onClick={handleBecomeMember}
            >
              {t('memberBenefits.becomeMemberButton')}
            </Button>
            <Button 
              appearance="secondary"
              className={styles.ctaButton}
              onClick={handleBecomeVolunteer}
            >
              {t('memberBenefits.becomeVolunteerButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemberBenefits;