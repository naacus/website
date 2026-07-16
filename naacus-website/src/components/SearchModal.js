/**
 * Global Search Modal Component
 * Displays search results in a modal with real-time filtering
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogSurface,
  Button,
  Input,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { Dismiss24Regular, Search24Regular } from '@fluentui/react-icons';
import { searchGlobal, groupResultsByCategory, highlightMatch } from '../services/searchService';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  dialog: {
    maxWidth: '900px',
    minHeight: '500px',
    '@media (max-width: 768px)': {
      maxWidth: '95vw',
      minHeight: '400px',
    },
  },
  dialogSurface: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('20px', '24px'),
    borderBottom: '1px solid #e5e5e5',
    flex: 'none',
  },
  dialogHeaderTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#262626',
    margin: '0',
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflowY: 'auto',
    ...shorthands.padding('0'),
  },
  searchInputWrapper: {
    ...shorthands.padding('24px'),
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: '0',
    zIndex: 10,
    borderBottom: '1px solid #e5e5e5',
    flex: 'none',
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    fontSize: '16px',
    ...shorthands.padding('12px', '16px'),
    backgroundColor: '#f5f5f5',
    ...shorthands.border('1px', 'solid', '#e5e5e5'),
    ...shorthands.borderRadius('6px'),

    '&:focus': {
      backgroundColor: '#ffffff',
      borderTopColor: '#0067b8',
      borderRightColor: '#0067b8',
      borderBottomColor: '#0067b8',
      borderLeftColor: '#0067b8',
      outline: 'none',
    },
  },
  resultsContainer: {
    flex: '1',
    overflowY: 'auto',
    ...shorthands.padding('24px'),
  },
  noResults: {
    textAlign: 'center',
    ...shorthands.padding('40px', '24px'),
    color: '#616161',
    fontSize: '14px',
  },
  resultContainer: {
    ...shorthands.margin('0', '0', '24px', '0'),
  },
  categoryHeader: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0067b8',
    ...shorthands.margin('20px', '0', '12px', '0'),
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resultItem: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', '#e5e5e5'),
    ...shorthands.margin('0', '0', '10px', '0'),
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
    backgroundColor: '#ffffff',
    width: '100%',
    textAlign: 'left',

    '&:hover': {
      backgroundColor: '#f0f7ff',
      borderTopColor: '#0067b8',
      borderRightColor: '#0067b8',
      borderBottomColor: '#0067b8',
      borderLeftColor: '#0067b8',
      boxShadow: '0 2px 8px rgba(0, 103, 184, 0.12)',
      transform: 'translateX(4px)',
    },
  },
  resultTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#262626',
    ...shorthands.margin('0', '0', '6px', '0'),

    '& mark': {
      backgroundColor: '#fff4ce',
      padding: '2px 4px',
      fontWeight: '700',
      ...shorthands.borderRadius('2px'),
    },
  },
  resultDescription: {
    fontSize: '13px',
    color: '#555555',
    ...shorthands.margin('0'),
    lineHeight: '1.5',

    '& mark': {
      backgroundColor: '#fff4ce',
      padding: '2px 4px',
      fontWeight: '700',
      ...shorthands.borderRadius('2px'),
    },
  },
  resultMeta: {
    fontSize: '12px',
    color: '#999999',
    ...shorthands.margin('10px', '0', '0', '0'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '1',
    textAlign: 'center',
    color: '#999999',
  },
  emptyStateIcon: {
    fontSize: '64px',
    ...shorthands.margin('0', '0', '16px', '0'),
  },
  resultCount: {
    fontSize: '13px',
    color: '#0067b8',
    fontWeight: '600',
    ...shorthands.margin('0', '0', '20px', '0'),
  },
  dialogFooter: {
    ...shorthands.padding('16px', '24px'),
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 'none',
  },
});

function SearchModal({ open, onOpenChange }) {
  const { t } = useTranslation();
  const styles = useStyles();
  const navigate = useNavigate();
  const { trackCTA } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const searchResults = searchGlobal(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, []);

  const handleResultClick = (result) => {
    trackCTA('search', 'result_click', result.title);
    onOpenChange(false);
    // Pass search query as URL parameter to highlight text on destination page
    const separator = result.path.includes('?') ? '&' : '?';
    navigate(`${result.path}${separator}search=${encodeURIComponent(searchQuery)}`);
  };

  const groupedResults = groupResultsByCategory(results);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogSurface className={styles.dialogSurface}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogHeaderTitle}>{t('search.title', 'Search')}</h2>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={() => onOpenChange(false)}
            aria-label={t('search.close', 'Close search dialog')}
            style={{ color: '#999999' }}
          />
        </div>

        <div className={styles.searchInputWrapper}>
          <div className={styles.searchInputContainer}>
            <Input
              ref={searchInputRef}
              contentBefore={<Search24Regular style={{ color: '#0067b8' }} />}
              placeholder={t('search.placeholder', 'Search pages, events, ministries...')}
              aria-label={t('search.inputLabel', 'Search pages, events, and ministries')}
              value={searchQuery}
              onChange={(_, data) => handleSearch(data.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.resultsContainer}>
          {searchQuery.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>🔍</div>
              <p style={{ fontSize: '16px', margin: '12px 0' }}>
                {t('search.startTyping', 'Start typing to search')}
              </p>
              <p style={{ fontSize: '13px', color: '#999999', margin: '8px 0 0 0' }}>
                Try searching for events, ministries, resources, or pages
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.emptyState}>
              <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
                No results found for "<strong>{searchQuery}</strong>"
              </p>
              <p style={{ fontSize: '13px', color: '#999999', margin: '8px 0 0 0' }}>
                Try different keywords or explore by category
              </p>
            </div>
          ) : (
            <>
              <div className={styles.resultCount}>
                {t('search.resultsFound', 'Found {{count}} results', {
                  count: results.length,
                })}
              </div>

              {Object.entries(groupedResults).map(([category, categoryResults]) => (
                <div key={category} className={styles.resultContainer}>
                  <div className={styles.categoryHeader}>{category}</div>

                  {categoryResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      type="button"
                      className={styles.resultItem}
                      onClick={() => handleResultClick(result)}
                      aria-label={t('search.openResult', 'Open {{title}}', { title: result.title })}
                    >
                      <div
                        className={styles.resultTitle}
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(result.title, searchQuery),
                        }}
                      />
                      {result.description && (
                        <div
                          className={styles.resultDescription}
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.description, searchQuery),
                          }}
                        />
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
                        {result.location && (
                          <div className={styles.resultMeta}>
                            <span>📍</span> {result.location}
                          </div>
                        )}
                        {result.startDate && (
                          <div className={styles.resultMeta}>
                            <span>📅</span> {new Date(result.startDate).toLocaleDateString()}
                          </div>
                        )}
                        {result.email && (
                          <div className={styles.resultMeta}>
                            <span>✉️</span> {result.email}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.dialogFooter}>
          <Button
            appearance="primary"
            onClick={() => onOpenChange(false)}
            style={{
              backgroundColor: '#0067b8',
              color: '#ffffff',
              fontWeight: '600',
            }}
          >
            {t('search.close', 'Close')}
          </Button>
        </div>
      </DialogSurface>
    </Dialog>
  );
}

export default SearchModal;
