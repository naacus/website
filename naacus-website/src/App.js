import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import './App.css';
import { initializeGoogleAnalytics } from './services/googleAnalyticsService';
import { trackPageRefresh, trackScrollDepth, resetScrollDepthTracking, trackPageView } from './services/analyticsService';
import { initializeTelemetry, setTelemetryAttributes, trackRouteTelemetry, startSpan } from './services/telemetryService';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Event2025Page from './pages/Event2025Page';
import EventsPage from './pages/EventsPage';
import MembershipPage from './pages/MembershipPage';
import VolunteerPage from './pages/VolunteerPage';
import AboutPage from './pages/AboutPage';
import LeadershipPage from './pages/LeadershipPage';
import FellowshipMinistriesPage from './pages/FellowshipMinistriesPage';
import MinistryDetail from './components/MinistryDetail';
import ProgramsActivitiesPage from './pages/ProgramsActivitiesPage';
import ResourcesPage from './pages/ResourcesPage';
import NewslettersPage from './pages/NewslettersPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import DonationPage from './pages/DonationPage';
import DuesRegistrationPage from './pages/DuesRegistrationPage';
import FAQPage from './pages/FAQPage';
import FeedbackPage from './pages/FeedbackPage';
import PrayerLibraryPage from './pages/PrayerLibraryPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ChatWidget from './components/ChatWidget';
import CookieConsent from './components/CookieConsent';

const routeMetaKeys = {
  '/': 'meta.routes.home',
  '/about': 'meta.routes.about',
  '/events': 'meta.routes.events',
  '/resources': 'meta.routes.resources',
  '/membership': 'meta.routes.membership',
  '/contact': 'meta.routes.contact',
  '/privacy': 'meta.routes.privacy',
  '/volunteer': 'meta.routes.volunteer',
  '/donation': 'meta.routes.donation',
  '/prayer-library': 'meta.routes.prayerLibrary',
  '/newsletters': 'meta.routes.newsletters',
  '/faq': 'meta.routes.faq',
  '/feedback': 'meta.routes.feedback',
  '/leadership': 'meta.routes.leadership',
  '/fellowship-ministries': 'meta.routes.fellowshipMinistries',
  '/programs-activities': 'meta.routes.programsActivities',
  '/dues-registration': 'meta.routes.duesRegistration',
  '/2025': 'meta.routes.naacus2025',
};

// Component to handle scroll tracking and page changes
function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const isKnownRoute = Boolean(routeMetaKeys[location.pathname]) || /^\/ministries\//.test(location.pathname);
    const isNotFoundRoute = location.pathname === '/404.html' || !isKnownRoute;
    const isMinistryDetail = /^\/ministries\//.test(location.pathname);
    const keyBase = isMinistryDetail
      ? 'meta.routes.ministryDetail'
      : (isNotFoundRoute ? 'meta.routes.notFound' : (routeMetaKeys[location.pathname] || 'meta.default'));
    const currentMeta = {
      title: isNotFoundRoute
        ? t('meta.routes.notFound.title', { defaultValue: '404 - Page Not Found | NAACUS' })
        : t(`${keyBase}.title`, { defaultValue: 'NAACUS | National Association of African Catholics in the United States' }),
      description: t(`${keyBase}.description`, { defaultValue: 'NAACUS serves African Catholic communities in the United States through faith, fellowship, and service.' }),
    };

    document.title = currentMeta.title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', currentMeta.description);

    trackRouteTelemetry(location.pathname, document.title || location.pathname);

    // Reset scroll depth tracking when route changes
    resetScrollDepthTracking();
    // Send a page_view for route changes
    trackPageView(document.title || location.pathname);
  }, [location.pathname, t, i18n.language]);

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      trackScrollDepth();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/dues-registration" element={<DuesRegistrationPage />} />
          <Route path="/2025" element={<Event2025Page />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/fellowship-ministries" element={<FellowshipMinistriesPage />} />
          <Route path="/ministries/:id" element={<MinistryDetail />} />
          <Route path="/programs-activities" element={<ProgramsActivitiesPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/prayer-library" element={<PrayerLibraryPage />} />
          <Route path="/newsletters" element={<NewslettersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeTelemetry();
    setTelemetryAttributes({
      'app.name': 'naacus-website',
      'app.runtime': 'browser',
    });

    // Only initialize Google Analytics if user has accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted') {
      initializeGoogleAnalytics();
      // Ensure we send an initial page_view on first load
      trackPageView(document.title || window.location.pathname);
    }

    // Track page refresh/reload
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      trackPageRefresh();

      const refreshSpan = startSpan('ui.page_refresh', {
        'app.route': window.location.pathname,
      });
      refreshSpan.end({ code: 1 });
    }
  }, []);

  return (
    <FluentProvider theme={webLightTheme}>
      <ErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </FluentProvider>
  );
}

export default App;
