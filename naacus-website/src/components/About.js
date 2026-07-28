import React from 'react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeader, StandardCard, CardGrid } from './PageLayout';

function About() {
  const { t } = useTranslation();

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
