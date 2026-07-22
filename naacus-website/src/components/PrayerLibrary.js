import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Card,
  Button,
  Badge,
  Dropdown,
  Option,
  TabList,
  Tab,
  Divider,
  Textarea,
  Input,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Field,
} from '@fluentui/react-components';
import {
  Video24Regular,
  Globe24Regular,
  Play24Filled,
  Filter24Regular,
  Book24Regular,
  Dismiss24Regular,
  Send24Regular,
} from '@fluentui/react-icons';
import {
  getPrayerVideos,
  getPrayerTypes,
  getAfricanCountries,
  getLanguagesWithPrayers,
} from '../data/prayerLibraryData';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  prayerLibrary: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('50px', '20px'),
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '600',
    display: 'block',
    letterSpacing: '-0.02em',
    '@media (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  constitutionBadge: {
    display: 'block',
    textAlign: 'center',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    textAlign: 'center',
    marginBottom: '16px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '800px',
    margin: '0 auto 16px',
    lineHeight: '1.6',
    display: 'block',
    '@media (max-width: 768px)': {
      fontSize: '1rem',
      ...shorthands.padding('0', '10px'),
    },
  },
  coordinatorNote: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    display: 'block',
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },

  // Stats bar
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('40px'),
    marginBottom: '40px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      ...shorthands.gap('20px'),
    },
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  statIcon: {
    color: tokens.colorBrandBackground,
    fontSize: '1.5rem',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: tokens.colorBrandBackground,
    display: 'block',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },

  // Tabs
  tabSection: {
    marginBottom: '32px',
  },
  tabList: {
    justifyContent: 'center',
    marginBottom: '24px',
  },

  // Filters
  filterBar: {
    display: 'flex',
    ...shorthands.gap('16px'),
    marginBottom: '32px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  filterDropdown: {
    minWidth: '200px',
    '@media (max-width: 768px)': {
      minWidth: 'unset',
      width: '100%',
    },
  },
  clearFiltersButton: {
    fontSize: '0.85rem',
  },

  // Prayer grid
  prayerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  prayerCard: {
    ...shorthands.padding('0'),
    ...shorthands.overflow('hidden'),
    ...shorthands.transition('all', '0.3s', 'ease'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.borderRadius('12px'),
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: tokens.shadow16,
    },
  },
  videoThumbnail: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f0f7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    ...shorthands.overflow('hidden'),
    border: 'none',
    ...shorthands.padding('0'),
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: '0',
    left: '0',
  },
  videoEmbed: {
    width: '100%',
    height: '360px',
    ...shorthands.border('0'),
    display: 'block',
    marginBottom: '12px',
  },
  playOverlay: {
    position: 'absolute',
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(0, 103, 184, 0.9)',
    ...shorthands.borderRadius('50%'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '2rem',
    ...shorthands.transition('all', '0.2s', 'ease'),
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: 'rgba(0, 69, 120, 0.95)',
    },
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '600',
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius('12px'),
  },
  cardContent: {
    ...shorthands.padding('20px'),
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '4px',
  },
  countryFlag: {
    fontSize: '1.5rem',
  },
  cardMeta: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  cardDescription: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    display: 'block',
    marginBottom: '12px',
  },
  prayerText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-line',
    display: 'block',
    marginBottom: '0',
  },
  prayerTextScroll: {
    maxHeight: '320px',
    overflowY: 'auto',
    ...shorthands.padding('0', '4px', '0', '0'),
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('16px'),
  },
  dialogCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    ...shorthands.padding('0'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    '&:hover': {
      color: tokens.colorNeutralForeground1,
    },
    flexShrink: 0,
  },
  youthBadge: {
    marginTop: '8px',
  },

  // Prayer list (tab view for browsing by prayer)
  prayerListSection: {
    marginBottom: '40px',
  },
  prayerTypeCard: {
    ...shorthands.padding('24px'),
    marginBottom: '16px',
    ...shorthands.borderRadius('12px'),
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
    ...shorthands.transition('all', '0.2s', 'ease'),
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  prayerTypeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  prayerTypeName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: tokens.colorBrandBackground,
    display: 'block',
  },
  prayerTypeLatinName: {
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    display: 'block',
    marginBottom: '8px',
  },
  prayerTypeCount: {
    fontSize: '0.85rem',
    color: tokens.colorNeutralForeground2,
    display: 'block',
  },

  // Countries map section
  countriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap('16px'),
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  countryCard: {
    ...shorthands.padding('16px'),
    textAlign: 'center',
    ...shorthands.borderRadius('8px'),
    ...shorthands.transition('all', '0.2s', 'ease'),
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: tokens.shadow8,
    },
  },
  countryFlag2: {
    fontSize: '2rem',
    marginBottom: '8px',
    display: 'block',
  },
  countryName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '4px',
  },
  countryLanguages: {
    fontSize: '0.8rem',
    color: tokens.colorNeutralForeground3,
    display: 'block',
    lineHeight: '1.4',
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('60px', '20px'),
  },
  emptyStateText: {
    fontSize: '1.1rem',
    color: tokens.colorNeutralForeground3,
    display: 'block',
    marginBottom: '16px',
  },

  // Submit section (admin only)
  submitSection: {
    textAlign: 'center',
    ...shorthands.padding('40px', '20px'),
    backgroundColor: '#f0f7ff',
    ...shorthands.borderRadius('16px'),
    marginBottom: '40px',
  },
  submitTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    display: 'block',
    marginBottom: '12px',
  },
  submitText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
    maxWidth: '700px',
    ...shorthands.margin('0', 'auto', '20px'),
    display: 'block',
  },
  submitGuidelines: {
    textAlign: 'left',
    maxWidth: '600px',
    ...shorthands.margin('0', 'auto', '24px'),
    listStyleType: 'none',
    ...shorthands.padding('0'),
  },
  guidelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
    marginBottom: '8px',
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
  },
  guidelineBullet: {
    color: tokens.colorBrandBackground,
    fontWeight: '700',
    minWidth: '20px',
  },
  dialogForm: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  adminBadge: {
    display: 'inline-flex',
    marginBottom: '12px',
  },
});

function PrayerLibrary() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackCTA } = useAnalytics();
  const location = useLocation();

  // Admin gate: only show submit dialog when ?admin=true is in URL
  const isAdmin = new URLSearchParams(location.search).get('admin') === 'true';

  const [selectedTab, setSelectedTab] = useState('videos');
  const [filterPrayer, setFilterPrayer] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [prayerTextDialogOpen, setPrayerTextDialogOpen] = useState(false);
  const [selectedPrayerVideo, setSelectedPrayerVideo] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    parish: '',
    country: '',
    language: '',
    prayerType: '',
    description: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const allVideos = getPrayerVideos();
  const allPrayerTypes = getPrayerTypes();
  const allCountries = getAfricanCountries();
  const allLanguages = getLanguagesWithPrayers();
  const publishedVideos = useMemo(() => allVideos.filter((video) => Boolean(video.videoUrl)), [allVideos]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return publishedVideos.filter((video) => {
      if (filterPrayer !== 'all' && video.prayerTypeId !== filterPrayer) return false;
      if (filterLanguage !== 'all' && video.language !== filterLanguage) return false;
      return true;
    });
  }, [publishedVideos, filterPrayer, filterLanguage]);

  const clearFilters = () => {
    setFilterPrayer('all');
    setFilterLanguage('all');
    trackCTA('prayer_library', 'clear_filters', 'prayer_library');
  };

  // Extract YouTube video ID and build embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
  };

  const getCountryInfo = (countryId) => {
    return allCountries.find((c) => c.id === countryId);
  };

  const getPrayerName = (prayerTypeId) => {
    const prayer = allPrayerTypes.find((p) => p.id === prayerTypeId);
    return prayer ? t(prayer.nameKey, { defaultValue: prayer.latinName || prayerTypeId }) : prayerTypeId;
  };

  // Count videos per prayer type
  const videosPerPrayer = (prayerTypeId) => publishedVideos.filter((v) => v.prayerTypeId === prayerTypeId).length;
  const videosPerLanguage = (language) => publishedVideos.filter((v) => v.language === language).length;

  const handleSubmitOpen = () => {
    setSubmitDialogOpen(true);
    setFormSubmitted(false);
    setFormData({ parish: '', country: '', language: '', prayerType: '', description: '' });
    trackCTA('prayer_library', 'submit_open', 'prayer_submit_dialog');
  };

  const openPrayerTextDialog = (video) => {
    setSelectedPrayerVideo(video);
    setPrayerTextDialogOpen(true);
    trackCTA('prayer_library', 'play_video', video.title);
  };

  const handleFormChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    trackCTA('prayer_library', 'submit_prayer', JSON.stringify(formData));
  };

  return (
    <section id="prayer-library" className={styles.prayerLibrary}>
      <Text as="h2" className={styles.sectionTitle}>
        {t('prayerLibrary.title')}
      </Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('prayerLibrary.subtitle')}
      </Text>

      <div className={styles.content}>
        {/* Tab Navigation */}
        <div className={styles.tabSection}>
          <TabList
            className={styles.tabList}
            selectedValue={selectedTab}
            onTabSelect={(_, data) => {
              setSelectedTab(data.value);
              trackCTA('prayer_library', 'tab_switch', data.value);
            }}
          >
            <Tab value="videos" icon={<Video24Regular />}>
              {t('prayerLibrary.tabs.videos')}
            </Tab>
            <Tab value="prayers" icon={<Book24Regular />}>
              {t('prayerLibrary.tabs.byPrayer')}
            </Tab>
            <Tab value="languages" icon={<Globe24Regular />}>
              {t('prayerLibrary.tabs.byLanguage')}
            </Tab>
          </TabList>
        </div>

        {/* -------- VIDEOS TAB -------- */}
        {selectedTab === 'videos' && (
          <>
            {/* Filters */}
            <div className={styles.filterBar}>
              <Filter24Regular />
              <Dropdown
                className={styles.filterDropdown}
                placeholder={t('prayerLibrary.filters.prayer')}
                value={filterPrayer === 'all' ? t('prayerLibrary.filters.allPrayers') : getPrayerName(filterPrayer)}
                onOptionSelect={(_, data) => {
                  setFilterPrayer(data.optionValue);
                  trackCTA('prayer_library', 'filter_prayer', data.optionValue);
                }}
              >
                <Option value="all">{t('prayerLibrary.filters.allPrayers')}</Option>
                {allPrayerTypes.map((pt) => (
                  <Option key={pt.id} value={pt.id}>
                    {t(pt.nameKey, { defaultValue: pt.latinName || pt.id })}
                  </Option>
                ))}
              </Dropdown>

              <Dropdown
                className={styles.filterDropdown}
                placeholder={t('prayerLibrary.filters.language')}
                value={filterLanguage === 'all' ? t('prayerLibrary.filters.allLanguages') : filterLanguage}
                onOptionSelect={(_, data) => {
                  setFilterLanguage(data.optionValue);
                  trackCTA('prayer_library', 'filter_language', data.optionValue);
                }}
              >
                <Option value="all">{t('prayerLibrary.filters.allLanguages')}</Option>
                {allLanguages.map((lang) => (
                  <Option key={lang} value={lang}>
                    {lang}
                  </Option>
                ))}
              </Dropdown>

              {(filterPrayer !== 'all' || filterLanguage !== 'all') && (
                <Button
                  appearance="subtle"
                  className={styles.clearFiltersButton}
                  icon={<Dismiss24Regular />}
                  onClick={clearFilters}
                >
                  {t('prayerLibrary.filters.clear')}
                </Button>
              )}
            </div>

            {/* Video Grid */}
            {filteredVideos.length > 0 ? (
              <div className={styles.prayerGrid}>
                {filteredVideos.map((video) => {
                  const country = getCountryInfo(video.country);
                  return (
                    <Card key={video.id} className={styles.prayerCard}>
                      <button
                        type="button"
                        className={styles.videoThumbnail}
                        disabled={!video.videoUrl}
                        onClick={() => {
                          if (video.videoUrl) {
                            openPrayerTextDialog(video);
                          }
                        }}
                        aria-label={video.videoUrl ? t('prayerLibrary.openPrayer', { title: video.title }) : t('prayerLibrary.comingSoon')}
                      >
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className={styles.thumbnailImg}
                          />
                        )}
                        <div className={styles.playOverlay}>
                          <Play24Filled />
                        </div>
                        {!video.videoUrl && (
                          <div className={styles.comingSoonOverlay}>
                            {t('prayerLibrary.comingSoon')}
                          </div>
                        )}
                      </button>
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <Text className={styles.cardTitle}>{video.title}</Text>
                          <span className={styles.countryFlag}>{country?.flag}</span>
                        </div>
                        <div className={styles.cardMeta}>
                          <span className={styles.metaItem}>
                            <Globe24Regular style={{ fontSize: '14px' }} />
                            {video.language}
                          </span>
                          <span className={styles.metaItem}>
                            <Book24Regular style={{ fontSize: '14px' }} />
                            {getPrayerName(video.prayerTypeId)}
                          </span>
                        </div>
                        <Text className={styles.cardDescription}>
                          {video.description}
                        </Text>
                        {video.featuresYouth && (
                          <div className={styles.youthBadge}>
                            <Badge color="success" appearance="filled">
                              {t('prayerLibrary.youthFeatured')}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Text className={styles.emptyStateText}>
                  {t('prayerLibrary.noResults')}
                </Text>
                <Button appearance="primary" onClick={clearFilters}>
                  {t('prayerLibrary.filters.clear')}
                </Button>
              </div>
            )}
          </>
        )}

        {/* -------- BY PRAYER TAB -------- */}
        {selectedTab === 'prayers' && (
          <div className={styles.prayerListSection}>
            {allPrayerTypes.map((pt) => (
              <Card key={pt.id} className={styles.prayerTypeCard}>
                <div className={styles.prayerTypeHeader}>
                  <div>
                    <Text className={styles.prayerTypeName}>{t(pt.nameKey, { defaultValue: pt.latinName || pt.id })}</Text>
                    <Text className={styles.prayerTypeLatinName}>{pt.latinName}</Text>
                  </div>
                  <Badge appearance="tint" color="brand" size="large">
                    {videosPerPrayer(pt.id)} {t('prayerLibrary.stats.videos')}
                  </Badge>
                </div>
                <Text className={styles.prayerTypeCount}>
                  {videosPerPrayer(pt.id) > 0
                    ? t('prayerLibrary.availableIn', { count: videosPerPrayer(pt.id) })
                    : t('prayerLibrary.noSubmissionsYet')}
                </Text>
                {videosPerPrayer(pt.id) > 0 && (
                  <Button
                    appearance="subtle"
                    style={{ marginTop: '8px', alignSelf: 'flex-start' }}
                    onClick={() => {
                      setFilterPrayer(pt.id);
                      setSelectedTab('videos');
                    }}
                  >
                    {t('prayerLibrary.viewVideos')}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* -------- BY LANGUAGE TAB -------- */}
        {selectedTab === 'languages' && (
          <div className={styles.countriesGrid}>
            {allLanguages.map((language) => (
              <Card
                key={language}
                className={styles.countryCard}
                onClick={() => {
                  setFilterLanguage(language);
                  setSelectedTab('videos');
                  trackCTA('prayer_library', 'language_filter_tab', language);
                }}
              >
                <Text className={styles.countryName}>{language}</Text>
                <Badge appearance="tint" color="brand" size="small" style={{ marginTop: '8px' }}>
                  {videosPerLanguage(language)} {videosPerLanguage(language) === 1 ? 'video' : 'videos'}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={prayerTextDialogOpen}
          onOpenChange={(_, data) => {
            setPrayerTextDialogOpen(data.open);
            if (!data.open) {
              setSelectedPrayerVideo(null);
            }
          }}
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                <div className={styles.dialogHeader}>
                  <span>{selectedPrayerVideo?.title}</span>
                  <Button
                    icon={<Dismiss24Regular />}
                    appearance="subtle"
                    className={styles.dialogCloseButton}
                    onClick={() => {
                      setPrayerTextDialogOpen(false);
                      setSelectedPrayerVideo(null);
                    }}
                    aria-label="Close dialog"
                  />
                </div>
              </DialogTitle>
              <DialogContent>
                {selectedPrayerVideo?.videoUrl && (
                  <iframe
                    className={styles.videoEmbed}
                    src={getYouTubeEmbedUrl(selectedPrayerVideo.videoUrl)}
                    title={selectedPrayerVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {selectedPrayerVideo?.prayerText && (
                  <div className={styles.prayerTextScroll}>
                    <Text className={styles.prayerText}>
                      {selectedPrayerVideo.prayerText}
                    </Text>
                  </div>
                )}
              </DialogContent>
            </DialogBody>
          </DialogSurface>
        </Dialog>

        {/* -------- SUBMIT SECTION (Admin Only) -------- */}
        {isAdmin && (
          <div className={styles.submitSection}>
            <Badge className={styles.adminBadge} color="danger" appearance="filled" size="small">
              Admin
            </Badge>
            <Text as="h3" className={styles.submitTitle}>
              {t('prayerLibrary.submit.title')}
            </Text>
            <Text className={styles.submitText}>
              {t('prayerLibrary.submit.description')}
            </Text>
            <ul className={styles.submitGuidelines}>
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n} className={styles.guidelineItem}>
                  <span className={styles.guidelineBullet}>✦</span>
                  {t(`prayerLibrary.submit.guideline${n}`)}
                </li>
              ))}
            </ul>

            <Dialog open={submitDialogOpen} onOpenChange={(_, data) => setSubmitDialogOpen(data.open)}>
              <DialogTrigger>
                <Button
                  appearance="primary"
                  size="large"
                  icon={<Send24Regular />}
                  onClick={handleSubmitOpen}
                >
                  {t('prayerLibrary.submit.button')}
                </Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>
                    {formSubmitted ? t('prayerLibrary.submit.thankYou') : t('prayerLibrary.submit.dialogTitle')}
                  </DialogTitle>
                  <DialogContent>
                    {formSubmitted ? (
                      <Text style={{ lineHeight: '1.6' }}>
                        {t('prayerLibrary.submit.thankYouMessage')}
                      </Text>
                    ) : (
                      <div className={styles.dialogForm}>
                        <div className={styles.formRow}>
                          <Field label={t('prayerLibrary.submit.form.parish')}>
                            <Input value={formData.parish} onChange={handleFormChange('parish')} />
                          </Field>
                          <Field label={t('prayerLibrary.submit.form.country')}>
                            <Input value={formData.country} onChange={handleFormChange('country')} />
                          </Field>
                        </div>
                        <div className={styles.formRow}>
                          <Field label={t('prayerLibrary.submit.form.language')}>
                            <Input
                              value={formData.language}
                              onChange={handleFormChange('language')}
                              placeholder={t('prayerLibrary.submit.form.languagePlaceholder')}
                            />
                          </Field>
                          <Field label={t('prayerLibrary.submit.form.prayerType')}>
                            <Input value={formData.prayerType} onChange={handleFormChange('prayerType')} />
                          </Field>
                        </div>
                        <Field label={t('prayerLibrary.submit.form.description')}>
                          <Textarea
                            value={formData.description}
                            onChange={handleFormChange('description')}
                            placeholder={t('prayerLibrary.submit.form.descriptionPlaceholder')}
                            rows={3}
                          />
                        </Field>
                      </div>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger>
                      <Button appearance="secondary">
                        {formSubmitted ? t('prayerLibrary.filters.clear') : t('prayerLibrary.submit.form.cancel')}
                      </Button>
                    </DialogTrigger>
                    {!formSubmitted && (
                      <Button appearance="primary" icon={<Send24Regular />} onClick={handleFormSubmit}>
                        {t('prayerLibrary.submit.form.submit')}
                      </Button>
                    )}
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
          </div>
        )}

        <Divider style={{ margin: '20px 0' }} />
      </div>
    </section>
  );
}

export default PrayerLibrary;
