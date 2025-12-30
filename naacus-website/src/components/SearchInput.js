/**
 * Search Input Component for Header
 * Provides a button that opens the search modal on click or keyboard shortcut
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import SearchModal from './SearchModal';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  searchButton: {
    minWidth: 'auto',
    ...shorthands.padding('8px'),
    height: '32px',
    color: '#262626',
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
    '@media (max-width: 768px)': {
      padding: '4px',
      height: '28px',
    },
  },
  searchButtonText: {
    marginLeft: '8px',
    fontSize: '13px',
    '@media (max-width: 960px)': {
      display: 'none',
    },
  },
  keyboardShortcut: {
    fontSize: '11px',
    color: '#999999',
    marginLeft: '12px',
  },
});

function SearchInput() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackCTA } = useAnalytics();
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        trackCTA('search', 'keyboard_shortcut', 'cmd_k');
      }
      // Also handle forward slash for quick search
      if (e.key === '/' && !searchOpen && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
        trackCTA('search', 'keyboard_shortcut', 'forward_slash');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, trackCTA]);

  const handleSearchOpen = () => {
    setSearchOpen(true);
    trackCTA('search', 'search_button_click', 'header_search');
  };

  return (
    <>
      <Button
        appearance="subtle"
        icon={<Search24Regular />}
        onClick={handleSearchOpen}
        className={styles.searchButton}
        title={t('search.tooltip', 'Search (Cmd+K)')}
      >
        <span className={styles.searchButtonText}>
          {t('search.search', 'Search')}
        </span>
        <span className={styles.keyboardShortcut}>⌘K</span>
      </Button>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default SearchInput;
