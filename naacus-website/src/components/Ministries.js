import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text
} from '@fluentui/react-components';
import { handleNavigation } from '../services/navigationService';
import { 
  Heart24Regular,
  People24Regular,
  PeopleTeam24Regular,
  Book24Regular,
  Megaphone24Regular,
  News24Regular,
  CalendarLtr24Regular,
  Money24Regular,
  Video24Regular,
  PersonAccounts24Regular,
  HandRight24Regular,
  MusicNote224Regular,
  Mail24Regular
} from '@fluentui/react-icons';
import { dataService } from '../services/dataService';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  ministries: {
    backgroundColor: '#faf9f8',
    ...shorthands.padding('50px', '20px'),
    '@media (max-width: 768px)': {
      padding: '40px 0',
    },
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
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto', '40px'),
    display: 'block',
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  ministriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '32px',
  },
  ministryCard: {
    ...shorthands.padding('32px', '24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-4px)',
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  ministryIcon: {
    color: tokens.colorBrandBackground,
    marginBottom: '16px',
    fontSize: '48px',
  },
  ministryTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  ministryDescription: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginBottom: '16px',
    textAlign: 'center',
  },
  ministryEmail: {
    fontSize: '0.85rem',
    color: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap('6px'),
    textDecoration: 'none',
    ...shorthands.transition('color', '0.2s', 'ease'),
    '&:hover': {
      color: tokens.colorBrandBackgroundHover,
    },
  },
  callToAction: {
    ...shorthands.padding('32px', '30px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('8px'),
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    marginBottom: '32px',
  },
  ctaTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  ctaText: {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },
  getInvolved: {
    ...shorthands.padding('40px', '30px'),
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius('8px'),
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  getInvolvedTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '16px',
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'block',
  },
  getInvolvedText: {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'block',
    marginBottom: '24px',
  },
  volunteerLink: {
    display: 'inline-block',
    ...shorthands.padding('12px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandBackground,
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    ...shorthands.borderRadius('4px'),
    ...shorthands.transition('all', '0.2s', 'ease'),
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      cursor: 'pointer',
    },
    '&:active': {
      transform: 'scale(0.98)',
      cursor: 'pointer',
    },
  },
});

function Ministries() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const styles = useStyles();
  const { trackMinistryCTA, trackMinistry } = useAnalytics();

  // Get ministry data from service
  const ministriesData = dataService.getMinistries();

  const handleMinistryEmail = (ministryTitle) => {
    trackMinistryCTA(`Email ${ministryTitle}`, 'ministry_email_link');
    trackMinistry(ministryTitle, 'email_click');
  };

  const handleMinistryCardClick = (ministryTitle) => {
    trackMinistry(ministryTitle, 'card_click');
  };

  const handleGetInvolvedClick = () => {
    trackMinistryCTA('Register Volunteer', 'get_involved_cta');
    handleNavigation({ path: '/volunteer', sectionId: null, currentPathname: '/fellowship-ministries', navigate });
  };

  // Track ministry view on mount
  React.useEffect(() => {
    ministriesData.forEach((ministry) => {
      trackMinistry(ministry.title, 'view');
    });
  }, [ministriesData, trackMinistry]);

  // Map icons to ministries by iconKey
  const iconMap = {
    advocacy: <Megaphone24Regular />,
    women: <PersonAccounts24Regular />,
    youth: <PeopleTeam24Regular />,
    youngAdults: <Heart24Regular />,
    men: <People24Regular />,
    disabilities: <HandRight24Regular />,
    resources: <Book24Regular />,
    finance: <Money24Regular />,
    media: <Video24Regular />,
    newsletter: <News24Regular />,
    liturgy: <CalendarLtr24Regular />,
    anec: <MusicNote224Regular />
  };

  // Combine ministry data with icons
  const ministries = ministriesData.map(ministry => ({
    ...ministry,
    icon: iconMap[ministry.iconKey]
  }));

  return (
    <section id="ministries" className={styles.ministries}>
      <div className={styles.content}>
        <Text as="h2" className={styles.sectionTitle}>{t('ministries.title')}</Text>
        <Text className={styles.sectionSubtitle}>
          {t('ministries.subtitle')}
        </Text>

        <div className={styles.ministriesGrid}>
          {ministries.map((ministry, index) => (
            <div 
              key={index} 
              id={ministry.iconKey}
              className={styles.ministryCard}
              onClick={() => handleMinistryCardClick(ministry.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMinistryCardClick(ministry.title);
                }
              }}
            >
              <div className={styles.ministryIcon}>
                {ministry.icon}
              </div>
              <Text className={styles.ministryTitle}>{ministry.title}</Text>
              <Text className={styles.ministryDescription}>{ministry.description}</Text>
              {ministry.email && (
                <a 
                  href={`mailto:${ministry.email}`} 
                  className={styles.ministryEmail}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMinistryEmail(ministry.title);
                  }}
                >
                  <Mail24Regular />
                  <span>{ministry.email}</span>
                </a>
              )}
            </div>
          ))}
        </div>

        <div className={styles.getInvolved} id="get-involved">
          <Text className={styles.getInvolvedTitle}>{t('ministries.ctaTitle')}</Text>
          <Text className={styles.getInvolvedText}>
            {t('ministries.ctaText')}
          </Text>
          <button 
            className={styles.volunteerLink} 
            onClick={handleGetInvolvedClick}
          >
            {t('memberBenefits.becomeVolunteerButton')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Ministries;
