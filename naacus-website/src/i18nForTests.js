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
        subtitle: "National Association of African Catholics in the United States",
        description: "The National Association of African Catholics in the United States (NAACUS) brings together individuals, families, clergy, religious, and communities to grow in faith, celebrate our rich cultural heritage, develop leaders, and serve the Church and society."
      },
      heroButtons: {
        becomeMember: "Become a Member",
        exploreMinistries: "Explore Our Ministries",
        convention2027: "Convention 2027"
      },
      conference2027: {
        ctaButton: "Email for Convention Updates"
      },
      mission: {
        title: "Our Mission",
        description: "NAACUS exists to unite African Catholics across the United States through faith formation, leadership development, cultural celebration, evangelization, and service to the Church and society.",
        cta: "Learn More About NAACUS"
      },
      whyJoin: {
        title: "Why Join NAACUS",
        description: "Become part of a vibrant national community of African Catholics dedicated to growing in faith, supporting one another, and serving the Church.",
        outcomes: {
          faith: "Grow in faith",
          connection: "Build connections",
          heritage: "Celebrate heritage",
          leadership: "Develop leadership",
          service: "Serve the Church"
        },
        cta: "Become a Member"
      },
      memberBenefits: {
        title: "Membership Benefits"
      },
      homeMinistries: {
        title: "Ministries",
        subtitle: "Find a community where you can grow in faith, build relationships, and serve.",
        viewDetails: "View Ministry",
        viewAll: "Explore All Ministries"
      },
      testimonials: {
        title: "What Our Members Say",
        subtitle: "Hear from members who have found community, faith, and purpose through NAACUS."
      },
      contact: {
        title: "Get In Touch",
        description: "Have questions about NAACUS or our programs?",
        emailLabel: "Email",
        emailValue: "info@naacus.org",
        joinUsLabel: "Join Us",
        joinUsValue: "Become a member or volunteer",
        communityLabel: "Community",
        communityValue: "Connect with African Catholics nationwide",
        spiritualDirectorLabel: "Spiritual Advisers",
        sendButton: "Send Message"
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
