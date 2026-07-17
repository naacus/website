import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button,
} from '@fluentui/react-components';
import { Mail24Regular, ChevronRight24Regular, Calendar24Regular } from '@fluentui/react-icons';
import { getNewsletters, getFeaturedNewsletter } from '../data/newslettersData';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  newsletters: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('80px', '20px', '50px', '20px'),
    marginTop: '50px',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '700',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '2rem',
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
  featuredSection: {
    marginBottom: '50px',
  },
  featuredNewsletter: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, #005a9e 100%)`,
    color: tokens.colorNeutralForegroundInverted,
    ...shorthands.padding('40px'),
    ...shorthands.borderRadius('12px'),
    marginBottom: '30px',
    '@media (max-width: 768px)': {
      ...shorthands.padding('30px', '20px'),
    },
  },
  featuredTitle: {
    fontSize: '1.8rem',
    marginBottom: '12px',
    fontWeight: '600',
    display: 'block',
  },
  featuredDate: {
    fontSize: '1rem',
    marginBottom: '20px',
    opacity: 0.9,
    display: 'block',
  },
  articlesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    ...shorthands.gap('16px'),
    marginBottom: '24px',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  articleItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.borderLeft('4px', 'solid', 'rgba(255, 255, 255, 0.5)'),
  },
  articleTitle: {
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'block',
    marginBottom: '8px',
  },
  articleExcerpt: {
    fontSize: '0.95rem',
    opacity: 0.95,
    display: 'block',
    lineHeight: '1.5',
  },
  newsarchiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('24px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  newsletterCard: {
    ...shorthands.padding('20px', '16px'),
    textAlign: 'center',
    ...shorthands.transition('all', '0.3s', 'ease'),
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: tokens.shadow16,
    },
  },
  iconWrapper: {
    fontSize: '3rem',
    marginBottom: '12px',
    color: tokens.colorBrandBackground,
  },
  cardDate: {
    fontSize: '0.9rem',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    display: 'block',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    display: 'block',
    marginBottom: '10px',
  },
  articlePreview: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
    marginBottom: '12px',
    display: 'block',
    minHeight: '45px',
  },
  articleBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    ...shorthands.gap('6px'),
    marginBottom: '14px',
  },
  categoryBadge: {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    color: tokens.colorBrandBackground,
    ...shorthands.padding('4px', '12px'),
    ...shorthands.borderRadius('4px'),
    fontSize: '0.8rem',
    fontWeight: '500',
  },
});

function Newsletters() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackResourceCTA } = useAnalytics();
  const [expandedNewsletter, setExpandedNewsletter] = useState(null);

  const newsletters = getNewsletters();
  const featured = getFeaturedNewsletter();
  // Sort archive by date (newest first): mmYYYY format
  const archive = newsletters.slice(1).sort((a, b) => {
    const monthMap = {
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
      July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
    };
    const dateA = monthMap[a.month] * 10000 + a.year;
    const dateB = monthMap[b.month] * 10000 + b.year;
    return dateB - dateA; // Newest first
  });

  const handleNewsletterClick = (newsletterTitle) => {
    trackResourceCTA(`View ${newsletterTitle}`, 'newsletter_view');
    setExpandedNewsletter(expandedNewsletter === null ? 0 : null);
  };

  const handleDownload = (newsletterTitle) => {
    trackResourceCTA(`Download ${newsletterTitle}`, 'newsletter_download');
    // In a real app, this would trigger a PDF download
    alert(`Download ${newsletterTitle} - Coming soon!`);
  };

  return (
    <section className={styles.newsletters}>
      <Text as="h2" className={styles.sectionTitle}>
        {t('newsletters.title')}
      </Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('newsletters.subtitle')}
      </Text>

      <div className={styles.content}>
        {/* Featured Newsletter */}
        <div className={styles.featuredSection}>
          <div className={styles.featuredNewsletter}>
            <Text className={styles.featuredTitle}>{featured.title}</Text>
            <Text className={styles.featuredDate}>
              {featured.month} {featured.year}
            </Text>

            <div className={styles.articlesList}>
              {featured.articles.map((article) => (
                <div key={article.id} className={styles.articleItem}>
                  <Text className={styles.articleTitle}>{article.title}</Text>
                  <Text className={styles.articleExcerpt}>{article.excerpt}</Text>
                </div>
              ))}
            </div>

            <Button
              appearance="secondary"
              onClick={() => handleDownload(featured.title)}
              className={styles.viewButton}
            >
              {t('newsletters.downloadButton')}
              <ChevronRight24Regular />
            </Button>
          </div>
        </div>

        {/* Newsletter Archive */}
        <Text as="h3" className={styles.archiveTitle}>
          {t('newsletters.archive')}
        </Text>

        <div className={styles.newsarchiveGrid}>
          {archive.map((newsletter) => (
            <Card
              key={newsletter.id}
              className={styles.newsletterCard}
            >
              <div className={styles.iconWrapper}>
                <Mail24Regular />
              </div>
              
              <Text className={styles.cardDate}>
                <Calendar24Regular style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {newsletter.month} {newsletter.year}
              </Text>
              
              <Text className={styles.cardTitle}>{newsletter.title}</Text>
              
              <Text className={styles.articlePreview}>
                {newsletter.articles[0]?.title}
              </Text>

              <div className={styles.articleBadges}>
                {newsletter.articles.slice(0, 2).map((article) => (
                  <span key={article.id} className={styles.categoryBadge}>
                    {article.category}
                  </span>
                ))}
              </div>

              <Button
                appearance="primary"
                onClick={() => handleNewsletterClick(newsletter.title)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
              >
                {t('newsletters.viewButton')}
                <ChevronRight24Regular />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Newsletters;
