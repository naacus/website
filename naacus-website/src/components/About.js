import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Text, tokens } from '@fluentui/react-components';
import { Section, SectionHeader, StandardCard, CardGrid, CTASection } from './PageLayout';
import { handleNavigation } from '../services/navigationService';

function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    handleNavigation({ path: '/membership', sectionId: null, currentPathname: '/about', navigate });
  };

  return (
    <Section id="about">
      <SectionHeader 
        title={t('about.title')}
        subtitle={t('about.intro')}
        centered
      />
      
      <CardGrid columns={3}>
        <StandardCard
          title={t('about.mission.title')}
          description={t('about.mission.description')}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
        </StandardCard>

        <StandardCard
          title={t('about.vision.title')}
          description={t('about.vision.description')}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
        </StandardCard>

        <StandardCard
          title={t('about.motto.title')}
          description={t('about.motto.description')}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🤝</div>
        </StandardCard>
      </CardGrid>
    </Section>
  );
}

export default About;
