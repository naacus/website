import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselViewport,
  CarouselSlider,
  makeStyles,
} from '@fluentui/react-components';
import Hero from '../components/Hero';
import Conference2027Teaser from '../components/Conference2027Teaser';
import MemberBenefits from '../components/MemberBenefits';
import Testimonials from '../components/Testimonials';
// import Conference from '../components/Conference';
import Gallery from '../components/Gallery';
import Newsletter from '../components/Newsletter';
import Contact from '../components/Contact';
import { useAnalytics } from '../hooks/useAnalytics';

const useStyles = makeStyles({
  carouselCard: {
    width: '100%',
  },
  carouselContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const getAnnouncement = (index, totalSlides) => {
  return `Carousel slide ${index + 1} of ${totalSlides}`;
};

function HomePage() {
  const styles = useStyles();
  const { trackPageViewEvent } = useAnalytics();
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  useEffect(() => {
    trackPageViewEvent('HomePage');
  }, [trackPageViewEvent]);

  const slides = [
    { id: 'hero', label: 'Hero', component: Hero },
    { id: 'conference', label: 'Conference 2027', component: Conference2027Teaser },
  ];

  const autoplayProps = {
    'aria-label': 'Enable autoplay',
    checked: autoplayEnabled,
    onCheckedChange: (e, data) => {
      setAutoplayEnabled(data.checked);
    },
  };

  return (
    <>
      <Carousel groupSize={1} circular announcement={getAnnouncement} className={styles.carouselContainer} autoplayInterval={30000}>
        <CarouselViewport>
          <CarouselSlider>
            {slides.map((slide, index) => {
              const SlideComponent = slide.component;
              return (
                <CarouselCard
                  key={slide.id}
                  className={styles.carouselCard}
                  aria-label={`${index + 1} of ${slides.length}`}
                  id={`carousel-${slide.id}`}
                >
                  <SlideComponent />
                </CarouselCard>
              );
            })}
          </CarouselSlider>
        </CarouselViewport>
        <CarouselNavContainer
          layout="inline"
          autoplay={autoplayProps}
          next={{ 'aria-label': 'Go to next' }}
          prev={{ 'aria-label': 'Go to prev' }}
        >
          <CarouselNav>
            {(index) => (
              <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />
            )}
          </CarouselNav>
        </CarouselNavContainer>
      </Carousel>
      <MemberBenefits />
      <Testimonials />
      {/*<Conference />*/}
      <Gallery />
      <Newsletter />
      <Contact />
    </>
  );
}

export default HomePage;
