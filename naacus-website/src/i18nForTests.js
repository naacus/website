import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock translations for testing
const resources = {
  en: {
    translation: {
      header: {
        title: "NAACUS",
        tagline: "National Association of African Catholics in the United States",
        donate: "Donate",
        nav: {
          home: "Home",
          about: "About",
          leadership: "Leadership",
          objectives: "Objectives",
          events: "Events",
          ministries: "Ministries",
          gallery: "Gallery",
          resources: "Resources",
          contact: "Contact"
        }
      },
      hero: {
        title: "Together with Christ",
        subtitle: "Uniting African Catholic Communities Across the United States",
        description: "A vibrant community of faith, heritage, and service—where African Catholics participate fully in the life of the Church while celebrating their cultural identity.",
        discoverButton: "Discover Our Mission",
        joinButton: "Join Our Community"
      },
      about: {
        title: "About NAACUS",
        intro: "The National Association of African Catholics in the United States (NAACUS) brings together African Catholics and their families to foster faith, leadership, and service in the Church across the United States.",
        mission: {
          title: "Our Mission",
          description: "To gather African Catholic communities in the U.S., promote their faith, and ensure their full and active participation in the life of the Church."
        },
        vision: {
          title: "Our Vision",
          description: "A vibrant and visible African Catholic community that contributes its gifts to the Church and society."
        },
        motto: {
          title: "Our Motto",
          description: "\"Together with Christ\" — We build welcoming networks of fellowship, workshops, and community initiatives."
        }
      },
      footer: {
        copyright: "© {{year}} NAACUS. All rights reserved.",
        tagline: "Together with Christ - Uniting African Catholic communities across the United States."
      },
      backToTop: "Back to Top",
      donate: "donate"
    }
  },
  fr: {
    translation: {
      header: {
        title: "NAACUS",
        tagline: "Association Nationale des Catholiques Africains aux États-Unis",
        donate: "Donner"
      },
      hero: {
        title: "Ensemble avec le Christ",
        subtitle: "Unir les Communautés Catholiques Africaines à Travers les États-Unis"
      },
      donate: "donate"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
