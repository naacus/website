import React from 'react';
import { 
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button
} from '@fluentui/react-components';
import { CheckmarkCircle24Regular } from '@fluentui/react-icons';
import { useAnalytics } from '../hooks/useAnalytics';
import { themeTokens } from '../config/theme';

const useStyles = makeStyles({
  conference: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding(themeTokens.componentSpacing.section.paddingDesktop.split(' ')[0], themeTokens.componentSpacing.section.paddingDesktop.split(' ')[1]),
    '@media (max-width: 768px)': {
      ...shorthands.padding('40px', '0'),
    },
  },
  conferenceTitle: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    textAlign: 'center',
    marginBottom: themeTokens.spacing['3xl'],
    color: tokens.colorNeutralForeground1,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
    },
  },
  conferenceBanner: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, #005a9e 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding(themeTokens.spacing['3xl'], themeTokens.spacing['lg']),
    ...shorthands.borderRadius('8px'),
    textAlign: 'center',
    marginBottom: themeTokens.spacing['4xl'],
  },
  bannerTitle: {
    fontSize: themeTokens.typography.fontSize['1.875rem'],
    marginBottom: themeTokens.spacing.md,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
    },
  },
  conferenceDate: {
    fontSize: themeTokens.typography.fontSize['1.25rem'],
    fontWeight: themeTokens.typography.fontWeight.normal,
    color: tokens.colorNeutralForegroundInverted,
    display: 'block',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1rem'],
    },
  },
  conferenceContent: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  conferenceDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap(themeTokens.spacing['2xl']),
    marginBottom: themeTokens.spacing['4xl'],
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  detailCard: {
    textAlign: 'center',
    ...shorthands.padding(themeTokens.spacing.xl, themeTokens.spacing.lg),
    ...shorthands.transition('transform', '0.3s', 'ease'),
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  cardIcon: {
    fontSize: themeTokens.typography.fontSize['3rem'],
    marginBottom: themeTokens.spacing.xl,
  },
  cardTitle: {
    fontSize: themeTokens.typography.fontSize['1.3rem'],
    marginBottom: themeTokens.spacing.md,
    color: tokens.colorBrandBackground,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.125rem'],
    },
  },
  cardText: {
    fontSize: themeTokens.typography.fontSize['1.1rem'],
    fontWeight: themeTokens.typography.fontWeight.medium,
    color: tokens.colorNeutralForeground1,
    marginBottom: themeTokens.spacing.sm,
    display: 'block',
  },
  detailSubtext: {
    fontSize: themeTokens.typography.fontSize['0.9rem'],
    color: tokens.colorNeutralForeground3,
    display: 'block',
  },
  conferenceDescription: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding(themeTokens.spacing['3xl']),
    ...shorthands.borderRadius('12px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding(themeTokens.spacing['2xl'], themeTokens.spacing.lg),
    },
  },
  descriptionTitle: {
    fontSize: themeTokens.typography.fontSize['2rem'],
    marginBottom: themeTokens.spacing.xl,
    color: tokens.colorBrandBackground,
    fontWeight: themeTokens.typography.fontWeight.semibold,
    display: 'block',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1.5rem'],
    },
  },
  descriptionText: {
    fontSize: themeTokens.typography.fontSize['1.1rem'],
    lineHeight: themeTokens.typography.lineHeight.relaxed,
    color: tokens.colorNeutralForeground2,
    marginBottom: themeTokens.spacing['4xl'],
    display: 'block',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['1rem'],
      lineHeight: themeTokens.typography.lineHeight.normal,
      textAlign: 'left',
    },
  },
  conferenceHighlights: {
    marginBottom: themeTokens.spacing['4xl'],
  },
  highlight: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(themeTokens.spacing.lg),
    marginBottom: themeTokens.spacing.lg,
    fontSize: themeTokens.typography.fontSize['1.05rem'],
    color: tokens.colorNeutralForeground1,
    '@media (max-width: 768px)': {
      fontSize: themeTokens.typography.fontSize['0.95rem'],
      ...shorthands.gap(themeTokens.spacing.md),
      alignItems: 'flex-start',
    },
  },
  ctaSection: {
    textAlign: 'center',
    ...shorthands.padding(themeTokens.spacing['4xl'], '0', '0'),
    ...shorthands.borderTop('2px', 'solid', tokens.colorNeutralStroke1),
  },
  ctaText: {
    fontSize: themeTokens.typography.fontSize['1.2rem'],
    marginBottom: themeTokens.spacing.xl,
    fontWeight: themeTokens.typography.fontWeight.medium,
    color: tokens.colorNeutralForeground1,
    display: 'block',
    textAlign: 'center',
  },
});

function Conference() {
  const styles = useStyles();
  const { trackEventCTA } = useAnalytics();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStayInformed = () => {
    trackEventCTA('Stay Informed', 'conference_cta');
    scrollToSection('contact');
  };

  return (
    <section id="conference" className={styles.conference}>
      <Text as="h2" className={styles.conferenceTitle}>National Conference</Text>
      <div className={styles.conferenceBanner}>
        <Text as="h3" className={styles.bannerTitle}>Biennial National Conference</Text>
        <Text as="p" className={styles.conferenceDate}>Unity in Christ • Evangelization • African Heritage</Text>
      </div>
      <div className={styles.conferenceContent}>
        <div className={styles.conferenceDetails}>
          <Card className={styles.detailCard}>
            <div className={styles.cardIcon}>🙏</div>
            <div>
              <Text className={styles.cardTitle}>Focus</Text>
              <Text className={styles.cardText}>Unity in Christ</Text>
              <Text className={styles.detailSubtext}>Strengthening our faith together</Text>
            </div>
          </Card>
          <Card className={styles.detailCard}>
            <div className={styles.cardIcon}>📖</div>
            <div>
              <Text className={styles.cardTitle}>Theme</Text>
              <Text className={styles.cardText}>Evangelization</Text>
              <Text className={styles.detailSubtext}>Sharing the Gospel message</Text>
            </div>
          </Card>
          <Card className={styles.detailCard}>
            <div className={styles.cardIcon}>🌍</div>
            <div>
              <Text className={styles.cardTitle}>Celebration</Text>
              <Text className={styles.cardText}>African Catholic Culture</Text>
              <Text className={styles.detailSubtext}>Heritage and traditions</Text>
            </div>
          </Card>
        </div>
        <div className={styles.conferenceDescription}>
          <Text as="h3" className={styles.descriptionTitle}>A Gathering of Faith and Heritage</Text>
          <Text as="p" className={styles.descriptionText}>
            Our biennial national conference brings together African Catholics from across the United States 
            for an inspiring experience of worship, learning, fellowship, and cultural celebration. This 
            signature event focuses on unity in Christ and evangelization while honoring the rich heritage 
            of African Catholics.
          </Text>
          <div className={styles.conferenceHighlights}>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Inspiring liturgies and worship incorporating African traditions</span>
            </div>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Workshops on faith, family life, and leadership formation</span>
            </div>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Networking with African Catholic communities nationwide</span>
            </div>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Cultural celebrations honoring African heritage</span>
            </div>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Youth and young adult programs and mentorship</span>
            </div>
            <div className={styles.highlight}>
              <CheckmarkCircle24Regular color={tokens.colorPaletteGreenForeground1} />
              <span>Strengthening connections with parishes and dioceses</span>
            </div>
          </div>
          <div className={styles.ctaSection}>
            <Text as="p" className={styles.ctaText}>
              Join us for our next conference and experience the vibrant African Catholic community!
            </Text>
            <Button 
              appearance="primary" 
              size="large"
              onClick={handleStayInformed}
            >
              Stay Informed
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Conference;
