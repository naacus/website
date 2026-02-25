import React, { useState, useMemo } from 'react';
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
  TabList,
  Tab,
  Divider,
} from '@fluentui/react-components';
import {
  Video24Regular,
  Globe24Regular,
  People24Regular,
  Heart24Regular,
  Play24Filled,
  Send24Regular,
  Filter24Regular,
  Book24Regular,
  Dismiss24Regular,
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
  },
  playOverlay: {
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

  // Submit section
  submitSection: {
    backgroundColor: '#f8f9fa',
    ...shorthands.padding('40px', '24px'),
    ...shorthands.borderRadius('12px'),
    textAlign: 'center',
    marginTop: '20px',
  },
  submitTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: tokens.colorBrandBackground,
    display: 'block',
    marginBottom: '12px',
  },
  submitText: {
    fontSize: '1rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.7',
    marginBottom: '8px',
    display: 'block',
    maxWidth: '700px',
    margin: '0 auto 8px',
  },
  submitGuidelines: {
    textAlign: 'left',
    maxWidth: '600px',
    margin: '16px auto 24px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  guidelineItem: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.6',
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
  },
  guidelineBullet: {
    color: tokens.colorBrandBackground,
    fontWeight: '600',
    minWidth: '20px',
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

  // Dialog
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
});

function PrayerLibrary() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { trackCTA } = useAnalytics();

  const [selectedTab, setSelectedTab] = useState('videos');
  const [filterPrayer, setFilterPrayer] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    parish: '',
    country: '',
    language: '',
    prayerType: '',
    description: '',
    featuresYouth: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const allVideos = getPrayerVideos();
  const allPrayerTypes = getPrayerTypes();
  const allCountries = getAfricanCountries();
  const allLanguages = getLanguagesWithPrayers();

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return allVideos.filter((video) => {
      if (filterPrayer !== 'all' && video.prayerTypeId !== filterPrayer) return false;
      if (filterCountry !== 'all' && video.country !== filterCountry) return false;
      if (filterLanguage !== 'all' && video.language !== filterLanguage) return false;
      return true;
    });
  }, [allVideos, filterPrayer, filterCountry, filterLanguage]);

  // Stats
  const uniqueLanguages = [...new Set(allVideos.map((v) => v.language))].length;
  const uniqueCountries = [...new Set(allVideos.map((v) => v.country))].length;
  const youthCount = allVideos.filter((v) => v.featuresYouth).length;

  const clearFilters = () => {
    setFilterPrayer('all');
    setFilterCountry('all');
    setFilterLanguage('all');
    trackCTA('prayer_library', 'clear_filters', 'prayer_library');
  };

  const getCountryInfo = (countryId) => {
    return allCountries.find((c) => c.id === countryId);
  };

  const getPrayerName = (prayerTypeId) => {
    const prayer = allPrayerTypes.find((p) => p.id === prayerTypeId);
    return prayer ? t(prayer.nameKey) : prayerTypeId;
  };

  const handleSubmitOpen = () => {
    setSubmitDialogOpen(true);
    trackCTA('prayer_library', 'submit_prayer_open', 'prayer_library');
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    // In a real implementation, this would POST to the backend API
    trackCTA('prayer_library', 'submit_prayer_form', 'prayer_library');
    setFormSubmitted(true);
    setTimeout(() => {
      setSubmitDialogOpen(false);
      setFormSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        parish: '',
        country: '',
        language: '',
        prayerType: '',
        description: '',
        featuresYouth: false,
      });
    }, 3000);
  };

  const handleCountryFilter = (countryId) => {
    setFilterCountry(countryId);
    setSelectedTab('videos');
    trackCTA('prayer_library', 'country_filter', countryId);
  };

  // Count videos per prayer type
  const videosPerPrayer = (prayerTypeId) => allVideos.filter((v) => v.prayerTypeId === prayerTypeId).length;

  return (
    <section id="prayer-library" className={styles.prayerLibrary}>
      <Text as="h2" className={styles.sectionTitle}>
        {t('prayerLibrary.title')}
      </Text>
      <Text as="p" className={styles.sectionSubtitle}>
        {t('prayerLibrary.subtitle')}
      </Text>

      <div className={styles.content}>
        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <Video24Regular className={styles.statIcon} />
            <Text className={styles.statNumber}>{allVideos.length}</Text>
            <Text className={styles.statLabel}>{t('prayerLibrary.stats.prayers')}</Text>
          </div>
          <div className={styles.statItem}>
            <Globe24Regular className={styles.statIcon} />
            <Text className={styles.statNumber}>{uniqueLanguages}</Text>
            <Text className={styles.statLabel}>{t('prayerLibrary.stats.languages')}</Text>
          </div>
          <div className={styles.statItem}>
            <People24Regular className={styles.statIcon} />
            <Text className={styles.statNumber}>{uniqueCountries}</Text>
            <Text className={styles.statLabel}>{t('prayerLibrary.stats.countries')}</Text>
          </div>
          <div className={styles.statItem}>
            <Heart24Regular className={styles.statIcon} />
            <Text className={styles.statNumber}>{youthCount}</Text>
            <Text className={styles.statLabel}>{t('prayerLibrary.stats.youthFeatured')}</Text>
          </div>
        </div>

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
            <Tab value="countries" icon={<Globe24Regular />}>
              {t('prayerLibrary.tabs.byCountry')}
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
                    {t(pt.nameKey)}
                  </Option>
                ))}
              </Dropdown>

              <Dropdown
                className={styles.filterDropdown}
                placeholder={t('prayerLibrary.filters.country')}
                value={filterCountry === 'all' ? t('prayerLibrary.filters.allCountries') : (getCountryInfo(filterCountry)?.name || filterCountry)}
                onOptionSelect={(_, data) => {
                  setFilterCountry(data.optionValue);
                  trackCTA('prayer_library', 'filter_country', data.optionValue);
                }}
              >
                <Option value="all">{t('prayerLibrary.filters.allCountries')}</Option>
                {allCountries.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.flag} {c.name}
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

              {(filterPrayer !== 'all' || filterCountry !== 'all' || filterLanguage !== 'all') && (
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
                      <div className={styles.videoThumbnail}>
                        <div className={styles.playOverlay}>
                          <Play24Filled />
                        </div>
                        <div className={styles.comingSoonOverlay}>
                          {t('prayerLibrary.comingSoon')}
                        </div>
                      </div>
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
                          <span className={styles.metaItem}>
                            <People24Regular style={{ fontSize: '14px' }} />
                            {video.contributor}
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
                    <Text className={styles.prayerTypeName}>{t(pt.nameKey)}</Text>
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

        {/* -------- BY COUNTRY TAB -------- */}
        {selectedTab === 'countries' && (
          <div className={styles.countriesGrid}>
            {allCountries.map((country) => {
              const count = allVideos.filter((v) => v.country === country.id).length;
              return (
                <Card
                  key={country.id}
                  className={styles.countryCard}
                  onClick={() => handleCountryFilter(country.id)}
                >
                  <Text className={styles.countryFlag2}>{country.flag}</Text>
                  <Text className={styles.countryName}>{country.name}</Text>
                  <Text className={styles.countryLanguages}>
                    {country.languages.slice(0, 3).join(', ')}
                    {country.languages.length > 3 && ` +${country.languages.length - 3}`}
                  </Text>
                  {count > 0 && (
                    <Badge appearance="tint" color="brand" size="small" style={{ marginTop: '8px' }}>
                      {count} {count === 1 ? 'video' : 'videos'}
                    </Badge>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <Divider style={{ margin: '20px 0' }} />

        {/* Submit Your Prayer Section */}
        <div className={styles.submitSection}>
          <Text className={styles.submitTitle}>
            {t('prayerLibrary.submit.title')}
          </Text>
          <Text className={styles.submitText}>
            {t('prayerLibrary.submit.description')}
          </Text>
          <div className={styles.submitGuidelines}>
            <div className={styles.guidelineItem}>
              <span className={styles.guidelineBullet}>✝</span>
              <span>{t('prayerLibrary.submit.guideline1')}</span>
            </div>
            <div className={styles.guidelineItem}>
              <span className={styles.guidelineBullet}>👗</span>
              <span>{t('prayerLibrary.submit.guideline2')}</span>
            </div>
            <div className={styles.guidelineItem}>
              <span className={styles.guidelineBullet}>🗣️</span>
              <span>{t('prayerLibrary.submit.guideline3')}</span>
            </div>
            <div className={styles.guidelineItem}>
              <span className={styles.guidelineBullet}>👦</span>
              <span>{t('prayerLibrary.submit.guideline4')}</span>
            </div>
            <div className={styles.guidelineItem}>
              <span className={styles.guidelineBullet}>⛪</span>
              <span>{t('prayerLibrary.submit.guideline5')}</span>
            </div>
          </div>

          <Dialog open={submitDialogOpen} onOpenChange={(_, data) => setSubmitDialogOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
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
                <DialogTitle>{t('prayerLibrary.submit.dialogTitle')}</DialogTitle>
                <DialogContent>
                  {formSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <Text style={{ fontSize: '1.2rem', color: tokens.colorBrandBackground, display: 'block', marginBottom: '8px' }}>
                        🙏 {t('prayerLibrary.submit.thankYou')}
                      </Text>
                      <Text style={{ color: tokens.colorNeutralForeground2, display: 'block' }}>
                        {t('prayerLibrary.submit.thankYouMessage')}
                      </Text>
                    </div>
                  ) : (
                    <div className={styles.dialogForm}>
                      <div className={styles.formRow}>
                        <Field label={t('prayerLibrary.submit.form.fullName')} required>
                          <Input
                            value={formData.fullName}
                            onChange={(_, data) => handleFormChange('fullName', data.value)}
                          />
                        </Field>
                        <Field label={t('prayerLibrary.submit.form.email')} required>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(_, data) => handleFormChange('email', data.value)}
                          />
                        </Field>
                      </div>
                      <Field label={t('prayerLibrary.submit.form.parish')}>
                        <Input
                          value={formData.parish}
                          onChange={(_, data) => handleFormChange('parish', data.value)}
                        />
                      </Field>
                      <div className={styles.formRow}>
                        <Field label={t('prayerLibrary.submit.form.country')} required>
                          <Dropdown
                            value={formData.country}
                            onOptionSelect={(_, data) => handleFormChange('country', data.optionValue)}
                          >
                            {allCountries.map((c) => (
                              <Option key={c.id} value={c.id}>
                                {c.flag} {c.name}
                              </Option>
                            ))}
                          </Dropdown>
                        </Field>
                        <Field label={t('prayerLibrary.submit.form.language')} required>
                          <Input
                            value={formData.language}
                            onChange={(_, data) => handleFormChange('language', data.value)}
                            placeholder={t('prayerLibrary.submit.form.languagePlaceholder')}
                          />
                        </Field>
                      </div>
                      <Field label={t('prayerLibrary.submit.form.prayerType')} required>
                        <Dropdown
                          value={formData.prayerType}
                          onOptionSelect={(_, data) => handleFormChange('prayerType', data.optionValue)}
                        >
                          {allPrayerTypes.map((pt) => (
                            <Option key={pt.id} value={pt.id}>
                              {t(pt.nameKey)}
                            </Option>
                          ))}
                        </Dropdown>
                      </Field>
                      <Field label={t('prayerLibrary.submit.form.description')}>
                        <Textarea
                          value={formData.description}
                          onChange={(_, data) => handleFormChange('description', data.value)}
                          placeholder={t('prayerLibrary.submit.form.descriptionPlaceholder')}
                          rows={3}
                        />
                      </Field>
                    </div>
                  )}
                </DialogContent>
                {!formSubmitted && (
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">{t('prayerLibrary.submit.form.cancel')}</Button>
                    </DialogTrigger>
                    <Button
                      appearance="primary"
                      onClick={handleFormSubmit}
                      disabled={!formData.fullName || !formData.email || !formData.country || !formData.language || !formData.prayerType}
                    >
                      {t('prayerLibrary.submit.form.submit')}
                    </Button>
                  </DialogActions>
                )}
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

export default PrayerLibrary;
