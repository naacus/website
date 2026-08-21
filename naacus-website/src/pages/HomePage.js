import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Conference2027Teaser from '../components/Conference2027Teaser';
import HomeMission from '../components/HomeMission';
import WhyJoin from '../components/WhyJoin';
import MemberBenefits from '../components/MemberBenefits';
import HomeMinistries from '../components/HomeMinistries';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Newsletter from '../components/Newsletter';
import Contact from '../components/Contact';
import { featureFlags } from '../config/featureFlags';
import { useAnalytics } from '../hooks/useAnalytics';

function HomePage() {
  const { trackPageViewEvent } = useAnalytics();
  useEffect(() => {
    trackPageViewEvent('HomePage');
  }, [trackPageViewEvent]);

  return (
    <>
      <Hero />
      <Conference2027Teaser />
      <HomeMission />
      <WhyJoin />
      <MemberBenefits />
      <HomeMinistries />
      <Testimonials />
      {featureFlags.showHomeGallery && <Gallery />}
      {featureFlags.showHomeNewsletter && <Newsletter />}
      <Contact showForm={featureFlags.showHomeContactForm} />
    </>
  );
}

export default HomePage;
