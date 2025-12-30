/**
 * FAQ Page
 * Displays frequently asked questions organized by category
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';
import { Search24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import PageWrapper from '../components/PageWrapper';
import { faqData, faqCategories } from '../data/faqData';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding('30px', '20px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px', '16px'),
    },
  },
  header: {
    textAlign: 'center',
    ...shorthands.margin('0', '0', '20px', '0'),
    background: 'linear-gradient(135deg, #0067b8 0%, #004578 100%)',
    ...shorthands.padding('30px', '30px'),
    ...shorthands.borderRadius('12px'),
    color: '#ffffff',
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px', '16px'),
      ...shorthands.margin('0', '0', '16px', '0'),
    },
  },
  title: {
    fontSize: '38px',
    fontWeight: '700',
    ...shorthands.margin('0', '0', '8px', '0'),
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: '400',
    ...shorthands.margin('0'),
    opacity: '0.95',
    maxWidth: '600px',
    ...shorthands.margin('0', 'auto'),
    lineHeight: '1.6',
  },
  searchContainer: {
    maxWidth: '700px',
    ...shorthands.margin('0', 'auto', '20px', 'auto'),
    position: 'relative',
  },
  searchInputWrapper: {
    position: 'relative',
    ...shorthands.borderRadius('10px'),
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 103, 184, 0.15)',
    backgroundColor: '#ffffff',
  },
  searchInput: {
    width: '100%',
    ...shorthands.padding('16px', '20px'),
    fontSize: '16px',
    ...shorthands.border('2px', 'solid', '#e5e5e5'),
    ...shorthands.borderRadius('10px'),
    backgroundColor: '#ffffff',
    color: '#262626',
    transition: 'all 0.3s ease',

    '&:focus': {
      outline: 'none',
      borderColor: '#0067b8',
      boxShadow: '0 0 0 3px rgba(0, 103, 184, 0.1), 0 4px 20px rgba(0, 103, 184, 0.15)',
    },

    '&::placeholder': {
      color: '#999999',
    },
  },
  categoryContainer: {
    ...shorthands.margin('0', '0', '24px', '0'),
  },
  categoryLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0067b8',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    ...shorthands.margin('0', '0', '10px', '0'),
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    ...shorthands.gap('8px'),
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    color: '#262626',
    border: '2px solid transparent',
    ...shorthands.padding('11px', '14px'),
    ...shorthands.borderRadius('8px'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textAlign: 'center',

    '&:hover': {
      backgroundColor: '#0067b8',
      color: '#ffffff',
      borderColor: '#0067b8',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 103, 184, 0.2)',
    },

    '&:active': {
      backgroundColor: '#0067b8',
      color: '#ffffff',
      borderColor: '#0067b8',
      transform: 'translateY(0)',
    },
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    ...shorthands.gap('16px'),
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  categorySection: {
    '@media (max-width: 768px)': {
      gridColumn: '1 / -1',
    },
  },
  categoryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0067b8',
    textTransform: 'capitalize',
    ...shorthands.margin('0', '0', '10px', '0'),
    paddingBottom: '8px',
    borderBottom: '3px solid #0067b8',
    position: 'relative',
  },
  accordion: {
    width: '100%',
  },
  accordionItem: {
    ...shorthands.margin('0', '0', '6px', '0'),
    backgroundColor: '#ffffff',
    ...shorthands.border('1px', 'solid', '#e5e5e5'),
    ...shorthands.borderRadius('8px'),
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    scrollMarginTop: '54px',

    '&:hover': {
      borderColor: '#0067b8',
      boxShadow: '0 4px 12px rgba(0, 103, 184, 0.1)',
    },
  },
  accordionHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#262626',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    '&:hover': {
      backgroundColor: '#f0f7ff',
      color: '#0067b8',
    },
  },
  accordionPanel: {
    ...shorthands.padding('12px', '14px'),
    backgroundColor: '#ffffff',
    color: '#555555',
    lineHeight: '1.6',
    fontSize: '14px',
    borderTop: '1px solid #f0f0f0',
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('60px', '40px'),
    color: '#999999',
    backgroundColor: '#f9f9f9',
    ...shorthands.borderRadius('12px'),
  },
  emptyStateIcon: {
    fontSize: '72px',
    ...shorthands.margin('0', '0', '16px', '0'),
  },
  noResultsMessage: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#262626',
    ...shorthands.margin('0', '0', '8px', '0'),
  },
  clearButton: {
    backgroundColor: '#0067b8',
    color: '#ffffff',
    border: 'none',
    ...shorthands.padding('10px', '24px'),
    ...shorthands.borderRadius('6px'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    marginTop: '12px',

    '&:hover': {
      backgroundColor: '#004578',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 103, 184, 0.2)',
    },
  },
});

function FAQPage() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackCTA } = useAnalytics();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openItems, setOpenItems] = useState([]);

  // Get FAQ ID from URL params and auto-expand it
  useEffect(() => {
    const faqId = searchParams.get('id');
    if (faqId) {
      setOpenItems([faqId]);
      // Scroll to the FAQ item after a short delay to allow render
      setTimeout(() => {
        const element = document.getElementById(`faq-${faqId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams]);

  // Filter FAQs based on search term and selected category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category
  const groupedFAQs = Object.values(faqCategories).reduce((acc, category) => {
    const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
    if (categoryFAQs.length > 0) {
      acc[category] = categoryFAQs;
    }
    return acc;
  }, {});

  const handleCategoryFilter = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    trackCTA('faq', 'category_filter', category);
  };

  const handleFAQClick = (faqId, question) => {
    setOpenItems(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
    trackCTA('faq', 'faq_opened', question);
  };

  const handleOpenChange = (item) => {
    setOpenItems(item);
  };

  return (
    <PageWrapper>
      <div className={styles.container}>
        {/* Hero Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t('faq.title', 'Frequently Asked Questions')}</h1>
          <p className={styles.subtitle}>
            {t(
              'faq.subtitle',
              'Find answers to common questions about NAACUS, membership, events, and more'
            )}
          </p>
        </div>

        {/* Search Box */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search24Regular
                style={{
                  position: 'absolute',
                  left: '16px',
                  color: '#0067b8',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder={t('faq.searchPlaceholder', 'Search FAQs...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                style={{
                  paddingLeft: '48px',
                  width: '100%',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#999999',
                  }}
                >
                  <Dismiss24Regular style={{ fontSize: '18px' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {filteredFAQs.length > 0 && (
          <div className={styles.categoryContainer}>
            <div className={styles.categoryLabel}>Filter by Category</div>
            <div className={styles.categoryGrid}>
              {Object.entries(faqCategories).map(([key, category]) => {
                const count = faqData.filter(faq => faq.category === category).length;
                return (
                  <button
                    key={category}
                    className={styles.categoryButton}
                    onClick={() => handleCategoryFilter(category)}
                    style={{
                      backgroundColor: selectedCategory === category ? '#0067b8' : '#f5f5f5',
                      color: selectedCategory === category ? '#ffffff' : '#262626',
                      borderColor: selectedCategory === category ? '#0067b8' : '#e5e5e5',
                    }}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQs Grid */}
        {Object.keys(groupedFAQs).length > 0 ? (
          <div className={styles.faqGrid}>
            {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
              <div key={category} className={styles.categorySection}>
                <h2 className={styles.categoryTitle}>{category}</h2>
                <Accordion 
                  className={styles.accordion} 
                  collapsible
                  openItems={openItems}
                  onOpenChange={(_, data) => handleOpenChange(data.openItems)}
                >
                  {categoryFAQs.map(faq => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id} 
                      className={styles.accordionItem}
                      id={`faq-${faq.id}`}
                    >
                      <AccordionHeader
                        onClick={() => handleFAQClick(faq.id, faq.question)}
                        className={styles.accordionHeader}
                      >
                        <span style={{ flex: 1, textAlign: 'left' }}>{faq.question}</span>
                        <span style={{ marginLeft: '16px', fontSize: '18px' }}>▾</span>
                      </AccordionHeader>
                      <AccordionPanel className={styles.accordionPanel}>
                        {faq.answer}
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <p className={styles.noResultsMessage}>
              {t('faq.noResults', 'No FAQs found matching your search')}
            </p>
            <p style={{ fontSize: '14px', color: '#999999', margin: '8px 0 0 0' }}>
              Try different keywords or clear the filters below
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className={styles.clearButton}
            >
              {t('faq.clearFilters', 'Clear Filters')}
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default FAQPage;
