import React, { useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import { ChevronLeft24Regular } from '@fluentui/react-icons';
import { getMinistryById } from '../data/ministriesData';
import { handleNavigation } from '../services/navigationService';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#faf9f8',
    minHeight: '100vh',
    ...shorthands.padding('40px', '20px'),
    paddingTop: '80px',
  },
  content: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto'),
    padding: '90px 0',
  },
  backButton: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: tokens.colorBrandForeground1,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
    display: 'block',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    display: 'block',
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
    display: 'block',
  },
  sectionContent: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    whiteSpace: 'pre-wrap',
  },
  programsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('16px'),
  },
  programItem: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  programTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
    display: 'block',
  },
  contactSection: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('24px'),
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    marginTop: '32px',
  },
  contactLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginBottom: '4px',
  },
  contactValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '16px',
  },
  contactLink: {
    color: '#0067b8',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '@media (max-width: 768px)': {
    '& .title': {
      fontSize: '1.75rem',
    },
    '& .sectionTitle': {
      fontSize: '1.25rem',
    },
  },
});

const BackButton = React.memo(({ styles, onNavigate }) => (
  <Button
    className={styles.backButton}
    onClick={onNavigate}
    appearance="transparent"
  >
    <ChevronLeft24Regular />
    Back to Ministries
  </Button>
));

const MissionSection = React.memo(({ mission, styles }) => {
  if (!mission) return null;
  return (
    <div className={styles.section}>
      <Text className={styles.sectionTitle}>Our Mission</Text>
      <Text className={styles.sectionContent}>{mission}</Text>
    </div>
  );
});

const AboutSection = React.memo(({ fullDescription, styles }) => {
  if (!fullDescription) return null;
  return (
    <div className={styles.section}>
      <Text className={styles.sectionTitle}>About</Text>
      <Text className={styles.sectionContent}>{fullDescription}</Text>
    </div>
  );
});

const ProgramsSection = React.memo(({ programs, styles }) => {
  if (!programs || programs.length === 0) return null;
  return (
    <div className={styles.section}>
      <Text className={styles.sectionTitle}>Programs & Activities</Text>
      <div className={styles.programsList}>
        {programs.map((program, index) => (
          <div key={index} className={styles.programItem}>
            <Text className={styles.programTitle}>{program}</Text>
          </div>
        ))}
      </div>
    </div>
  );
});

const ContactSection = React.memo(({ coordinator, email, styles }) => (
  <div className={styles.contactSection}>
    <Text className={styles.sectionTitle}>Get Involved</Text>
    
    {coordinator && (
      <>
        <Text className={styles.contactLabel}>Coordinator:</Text>
        <Text className={styles.contactValue}>{coordinator}</Text>
      </>
    )}

    <Text className={styles.contactLabel}>For More Information:</Text>
    <Text className={styles.contactValue}>
      <a href={`mailto:${email}`} className={styles.contactLink}>
        {email}
      </a>
    </Text>
  </div>
));

function MinistryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const styles = useStyles();
  const { trackCTA } = useAnalytics();

  const ministry = useMemo(() => getMinistryById(id), [id]);
  const handleNavigate = useCallback(() => {
    trackCTA('navigation', 'back_to_ministries', 'ministry_detail');
    handleNavigation({
      path: '/fellowship-ministries',
      sectionId: null,
      currentPathname: location.pathname,
      navigate,
    });
  }, [navigate, location.pathname, trackCTA]);

  // Scroll to top on mount and track page view
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (ministry) {
      trackCTA('page_view', 'ministry_detail', ministry.title);
    }
  }, [id, ministry, trackCTA]);

  if (!ministry) {
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <BackButton styles={styles} onNavigate={handleNavigate} />
          <Text className={styles.title}>Ministry Not Found</Text>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <BackButton styles={styles} onNavigate={handleNavigate} />

        <div className={styles.header}>
          <Text className={styles.title}>{ministry.title}</Text>
          <Text className={styles.subtitle}>{ministry.description}</Text>
        </div>

        <MissionSection mission={ministry.mission} styles={styles} />
        <AboutSection fullDescription={ministry.fullDescription} styles={styles} />
        <ProgramsSection programs={ministry.programs} styles={styles} />
        <ContactSection coordinator={ministry.coordinator} email={ministry.email} styles={styles} />
      </div>
    </section>
  );
}

export default MinistryDetail;
