import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import './App.css';
import { initializeGoogleAnalytics } from './services/googleAnalyticsService';
import { trackPageRefresh, trackScrollDepth, resetScrollDepthTracking, trackPageView } from './services/analyticsService';
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
import FAQPage from './pages/FAQPage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ChatWidget from './components/ChatWidget';
import CookieConsent from './components/CookieConsent';

// Component to handle scroll tracking and page changes
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll depth tracking when route changes
    resetScrollDepthTracking();
    // Send a page_view for route changes
    trackPageView(document.title || location.pathname);
  }, [location.pathname]);

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
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donation" element={<DonationPage />} />
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
        <Route path="/newsletters" element={<NewslettersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <BackToTop />
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}

function App() {
  useEffect(() => {
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
