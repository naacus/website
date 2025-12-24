/**
 * Analytics Dashboard - Monitor CTA clicks and user behavior
 * Displays analytics summary data collected by analyticsService
 * 
 * Data displayed:
 * - Total events tracked
 * - Events by category (membership, volunteer, event, etc.)
 * - Events by action (Join, Learn, etc.)
 * - Top CTAs and pages
 * - CSV export capability
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Card,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogBody,
  DialogTitle,
  DialogActions,
} from '@fluentui/react-components';
import { Download24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import {
  getAnalyticsSummary,
  downloadAnalyticsData,
  exportAnalyticsCSV,
  getAnalyticsEvents,
} from '../services/analyticsService';
import { colors } from '../config/theme';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('40px', '20px'),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    marginTop: '60px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: tokens.colorNeutralForeground2,
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
  },
  statCard: {
    ...shorthands.padding('24px'),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  statLabel: {
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: colors.ui.analyticsDark,
    display: 'block',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
  },
  chartCard: {
    ...shorthands.padding('24px'),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  chartTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
    display: 'block',
  },
  chartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('12px', '0'),
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  chartLabel: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    flex: 1,
  },
  chartValue: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: colors.ui.analyticsDark,
    minWidth: '40px',
    textAlign: 'right',
  },
  bar: {
    height: '6px',
    backgroundColor: colors.ui.analyticsDark,
    borderRadius: '3px',
    marginTop: '4px',
  },
  actionsBar: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  refreshButton: {
    backgroundColor: colors.ui.analyticsDark,
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#0a3558',
      boxShadow: '0 4px 12px rgba(15, 76, 129, 0.3)',
    },
  },
  exportButton: {
    backgroundColor: '#107c41',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#0c5a2a',
      boxShadow: '0 4px 12px rgba(16, 124, 65, 0.3)',
    },
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('60px', '20px'),
    color: tokens.colorNeutralForeground2,
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
  },
  eventsList: {
    ...shorthands.padding('24px'),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  eventsTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
    display: 'block',
  },
  eventItem: {
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: '#f9f9f9',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    justifyContent: 'space-between',
  },
  eventType: {
    fontWeight: '600',
    color: colors.ui.analyticsDark,
    marginRight: '12px',
  },
  lastUpdated: {
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground3,
    marginTop: '12px',
  },
});

function AnalyticsDashboard() {
  const { t } = useTranslation();
  const styles = useStyles();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load analytics data on mount and set up auto-refresh
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    const data = getAnalyticsSummary();
    setSummary(data);
    const allEvents = getAnalyticsEvents();
    setEvents(allEvents.slice(0, 10)); // Show last 10 events
    setLastUpdated(new Date());
  };

  const handleExport = () => {
    exportAnalyticsCSV();
    downloadAnalyticsData();
  };

  if (!summary) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <Text className={styles.emptyStateTitle}>
              No Analytics Data Yet
            </Text>
            <Text>
              Start navigating the website to collect analytics data. This dashboard will update automatically.
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Get top categories, actions, and pages
  const topCategories = Object.entries(summary.eventsByCategory || {})
    .map(([key, value]) => ({ category: key, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topActions = Object.entries(summary.eventsByAction || {})
    .map(([key, value]) => ({ action: key, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topPages = Object.entries(summary.eventsByPage || {})
    .map(([key, value]) => ({ page: key, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxValue = Math.max(
    ...topCategories.map(c => c.count),
    ...topActions.map(a => a.count),
    ...topPages.map(p => p.count),
    1
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <Text as="h1" className={styles.title}>
            Analytics Dashboard
          </Text>
          <Text className={styles.subtitle}>
            Track and monitor CTA clicks and user behavior across the website
          </Text>
        </div>

        {/* Actions Bar */}
        <div className={styles.actionsBar}>
          <button className={styles.refreshButton} onClick={refreshData}>
            ↻ Refresh Data
          </button>
          <button className={styles.exportButton} onClick={handleExport}>
            <Download24Regular /> Export to CSV
          </button>
        </div>

        {/* Key Metrics */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Events</span>
            <span className={styles.statValue}>{summary.totalEvents || 0}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total CTAs Tracked</span>
            <span className={styles.statValue}>
              {(summary.eventsByCategory?.cta_click || 0) + (summary.eventsByCategory?.form_start || 0)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pages Visited</span>
            <span className={styles.statValue}>{Object.keys(summary.eventsByPage || {}).length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Conversion Rate</span>
            <span className={styles.statValue}>
              {summary.totalEvents > 0
                ? ((((summary.eventsByCategory?.form_submit || 0) / summary.totalEvents) * 100).toFixed(1)) + '%'
                : '0%'}
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          {/* Top Categories */}
          <div className={styles.chartCard}>
            <span className={styles.chartTitle}>Top CTA Categories</span>
            {topCategories.length === 0 ? (
              <Text style={{ color: tokens.colorNeutralForeground2 }}>No data yet</Text>
            ) : (
              topCategories.map((item) => (
                <div key={item.category}>
                  <div className={styles.chartItem}>
                    <span className={styles.chartLabel}>{item.category}</span>
                    <span className={styles.chartValue}>{item.count}</span>
                  </div>
                  <div
                    className={styles.bar}
                    style={{ width: `${(item.count / maxValue) * 100}%` }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Top Actions */}
          <div className={styles.chartCard}>
            <span className={styles.chartTitle}>Top Actions</span>
            {topActions.length === 0 ? (
              <Text style={{ color: tokens.colorNeutralForeground2 }}>No data yet</Text>
            ) : (
              topActions.map((item) => (
                <div key={item.action}>
                  <div className={styles.chartItem}>
                    <span className={styles.chartLabel}>{item.action}</span>
                    <span className={styles.chartValue}>{item.count}</span>
                  </div>
                  <div
                    className={styles.bar}
                    style={{ width: `${(item.count / maxValue) * 100}%` }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Top Pages */}
          <div className={styles.chartCard}>
            <span className={styles.chartTitle}>Top Pages</span>
            {topPages.length === 0 ? (
              <Text style={{ color: tokens.colorNeutralForeground2 }}>No data yet</Text>
            ) : (
              topPages.map((item) => (
                <div key={item.page}>
                  <div className={styles.chartItem}>
                    <span className={styles.chartLabel}>{item.page}</span>
                    <span className={styles.chartValue}>{item.count}</span>
                  </div>
                  <div
                    className={styles.bar}
                    style={{ width: `${(item.count / maxValue) * 100}%` }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        {events.length > 0 && (
          <div className={styles.eventsList}>
            <span className={styles.eventsTitle}>Recent Events (Last 10)</span>
            {events.map((event, index) => (
              <div key={index} className={styles.eventItem}>
                <span>
                  <span className={styles.eventType}>[{event.type}]</span>
                  {event.action} - {event.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: tokens.colorNeutralForeground3 }}>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div className={styles.lastUpdated}>
              Last updated: {lastUpdated?.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
