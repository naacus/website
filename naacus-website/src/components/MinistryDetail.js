import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import { ChevronLeft24Regular } from '@fluentui/react-icons';
import { getMinistryById } from '../data/ministriesData';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#faf9f8',
    minHeight: '100vh',
    ...shorthands.padding('40px', '20px'),
  },
  content: {
    maxWidth: '900px',
    ...shorthands.margin('0', 'auto'),
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
    marginBottom: '32px',
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
    title: {
      fontSize: '1.75rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
    },
  },
});

function MinistryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const styles = useStyles();

  const ministry = getMinistryById(id);

  if (!ministry) {
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <Button
            className={styles.backButton}
            onClick={() => navigate('/ministries')}
          >
            <ChevronLeft24Regular />
            Back to Ministries
          </Button>
          <Text className={styles.title}>Ministry Not Found</Text>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <Button
          className={styles.backButton}
          onClick={() => navigate('/ministries')}
        >
          <ChevronLeft24Regular />
          Back to Ministries
        </Button>

        <div className={styles.header}>
          <Text className={styles.title}>{ministry.title}</Text>
          <Text className={styles.subtitle}>{ministry.description}</Text>
        </div>

        {ministry.mission && (
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Our Mission</Text>
            <Text className={styles.sectionContent}>{ministry.mission}</Text>
          </div>
        )}

        {ministry.fullDescription && (
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>About</Text>
            <Text className={styles.sectionContent}>
              {ministry.fullDescription}
            </Text>
          </div>
        )}

        {ministry.programs && ministry.programs.length > 0 && (
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>Programs & Activities</Text>
            <div className={styles.programsList}>
              {ministry.programs.map((program, index) => (
                <div key={index} className={styles.programItem}>
                  <Text className={styles.programTitle}>{program}</Text>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.contactSection}>
          <Text className={styles.sectionTitle}>Get Involved</Text>
          
          {ministry.coordinator && (
            <>
              <Text className={styles.contactLabel}>Coordinator:</Text>
              <Text className={styles.contactValue}>{ministry.coordinator}</Text>
            </>
          )}

          <Text className={styles.contactLabel}>For More Information:</Text>
          <Text className={styles.contactValue}>
            <a href={`mailto:${ministry.email}`} className={styles.contactLink}>
              {ministry.email}
            </a>
          </Text>
        </div>
      </div>
    </section>
  );
}

export default MinistryDetail;
