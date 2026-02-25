/**
 * African Catholic Prayer Library Data
 * 
 * NAACUS African Catholic Prayer Project
 * Supporting Section C of the NAACUS Constitution:
 * "Encourage the celebration of the Catholic Liturgy in the ethnic languages and cultures"
 * 
 * Each prayer entry represents a video submission of a traditional Catholic prayer
 * recited in an African language. Community members are encouraged to submit videos
 * wearing African attire, speaking in their native languages, and featuring youth.
 */

// Canonical list of prayers in the project
export const prayerTypes = [
  { id: 'sign-of-the-cross', nameKey: 'prayerLibrary.prayers.signOfCross', latinName: 'Signum Crucis' },
  { id: 'our-father', nameKey: 'prayerLibrary.prayers.ourFather', latinName: 'Pater Noster' },
  { id: 'hail-mary', nameKey: 'prayerLibrary.prayers.hailMary', latinName: 'Ave Maria' },
  { id: 'glory-be', nameKey: 'prayerLibrary.prayers.gloryBe', latinName: 'Gloria Patri' },
  { id: 'apostles-creed', nameKey: 'prayerLibrary.prayers.apostlesCreed', latinName: 'Symbolum Apostolorum' },
  { id: 'hail-holy-queen', nameKey: 'prayerLibrary.prayers.hailHolyQueen', latinName: 'Salve Regina' },
  { id: 'memorare', nameKey: 'prayerLibrary.prayers.memorare', latinName: 'Memorare' },
];

// African countries / language communities represented
export const africanCountries = [
  { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', languages: ['French', 'English', 'Ewondo', 'Duala', 'Bamileke', 'Fulfulde'] },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', languages: ['Igbo', 'Yoruba', 'Hausa', 'English'] },
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭', languages: ['Twi', 'Akan', 'Ga', 'Ewe', 'English'] },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', languages: ['Swahili', 'Kikuyu', 'Luo', 'English'] },
  { id: 'dr-congo', name: 'DR Congo', flag: '🇨🇩', languages: ['French', 'Lingala', 'Swahili', 'Tshiluba', 'Kikongo'] },
  { id: 'congo', name: 'Republic of Congo', flag: '🇨🇬', languages: ['French', 'Lingala', 'Kikongo'] },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', languages: ['Amharic', 'Oromo', 'Tigrinya'] },
  { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', languages: ['Swahili', 'English'] },
  { id: 'uganda', name: 'Uganda', flag: '🇺🇬', languages: ['Luganda', 'Swahili', 'English'] },
  { id: 'south-africa', name: 'South Africa', flag: '🇿🇦', languages: ['Zulu', 'Xhosa', 'Sotho', 'English', 'Afrikaans'] },
  { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', languages: ['Kinyarwanda', 'French', 'English'] },
  { id: 'burundi', name: 'Burundi', flag: '🇧🇮', languages: ['Kirundi', 'French'] },
  { id: 'ivory-coast', name: "Côte d'Ivoire", flag: '🇨🇮', languages: ['French', 'Baoulé', 'Dioula'] },
  { id: 'senegal', name: 'Senegal', flag: '🇸🇳', languages: ['French', 'Wolof'] },
  { id: 'togo', name: 'Togo', flag: '🇹🇬', languages: ['French', 'Ewe', 'Kabye'] },
  { id: 'benin', name: 'Benin', flag: '🇧🇯', languages: ['French', 'Fon', 'Yoruba'] },
  { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', languages: ['Portuguese', 'Makhuwa', 'Tsonga'] },
  { id: 'angola', name: 'Angola', flag: '🇦🇴', languages: ['Portuguese', 'Kimbundu', 'Umbundu'] },
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', languages: ['Malagasy', 'French'] },
  { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', languages: ['Tigrinya', 'Arabic'] },
];

// Sample prayer video entries (will be replaced with real submissions)
export const prayerVideos = [
  {
    id: 1,
    prayerTypeId: 'our-father',
    country: 'cameroon',
    language: 'Ewondo',
    title: 'Our Father in Ewondo',
    contributor: 'Marie-Claire N.',
    parish: 'St. Joseph Cameroon Catholic Community, MD',
    description: 'The Our Father prayer recited in Ewondo, a Bantu language spoken in central Cameroon.',
    videoUrl: 'https://www.youtube.com/watch?v=vyK9QKLBpOA',
    thumbnailUrl: 'https://img.youtube.com/vi/vyK9QKLBpOA/hqdefault.jpg',
    featuresYouth: false,
    dateSubmitted: '2026-02-25',
    status: 'approved',
  },
  {
    id: 2,
    prayerTypeId: 'hail-mary',
    country: 'nigeria',
    language: 'Igbo',
    title: 'Hail Mary in Igbo',
    contributor: 'Chukwuma O.',
    parish: 'Nigerian Catholic Community of Greater Washington, DC',
    description: 'The Hail Mary recited in Igbo, a major language of southeastern Nigeria.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: true,
    dateSubmitted: '2026-03-05',
    status: 'pending',
  },
  {
    id: 3,
    prayerTypeId: 'sign-of-the-cross',
    country: 'ghana',
    language: 'Twi',
    title: 'Sign of the Cross in Twi',
    contributor: 'Kwame F.',
    parish: 'Ghanaian Catholic Community, VA',
    description: 'The Sign of the Cross in Twi (Akan), the most widely spoken language in Ghana.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: true,
    dateSubmitted: '2026-03-10',
    status: 'pending',
  },
  {
    id: 4,
    prayerTypeId: 'glory-be',
    country: 'dr-congo',
    language: 'Lingala',
    title: 'Glory Be in Lingala',
    contributor: 'Célestin M.',
    parish: 'Congolese Catholic Community, MD',
    description: 'The Glory Be prayer in Lingala, a major language spoken in the Democratic Republic of Congo and Republic of Congo.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-12',
    status: 'pending',
  },
  {
    id: 5,
    prayerTypeId: 'apostles-creed',
    country: 'kenya',
    language: 'Swahili',
    title: "Apostles' Creed in Swahili",
    contributor: 'Grace W.',
    parish: 'East African Catholic Community, MD',
    description: "The Apostles' Creed in Swahili (Kiswahili), a lingua franca of East Africa.",
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-15',
    status: 'pending',
  },
  {
    id: 6,
    prayerTypeId: 'hail-holy-queen',
    country: 'rwanda',
    language: 'Kinyarwanda',
    title: 'Hail Holy Queen in Kinyarwanda',
    contributor: 'Jean-Paul H.',
    parish: 'Rwandan Catholic Community, VA',
    description: 'The Hail Holy Queen (Salve Regina) in Kinyarwanda, the national language of Rwanda.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: true,
    dateSubmitted: '2026-03-18',
    status: 'pending',
  },
  {
    id: 7,
    prayerTypeId: 'memorare',
    country: 'senegal',
    language: 'Wolof',
    title: 'Memorare in Wolof',
    contributor: 'Fatou D.',
    parish: 'Senegalese Catholic Community, NY',
    description: 'The Memorare prayer in Wolof, the most widely spoken language in Senegal.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-20',
    status: 'pending',
  },
];

// Helper functions
export const getPrayerVideos = () => prayerVideos;

export const getPrayerVideosByPrayer = (prayerTypeId) =>
  prayerVideos.filter((v) => v.prayerTypeId === prayerTypeId);

export const getPrayerVideosByCountry = (countryId) =>
  prayerVideos.filter((v) => v.country === countryId);

export const getPrayerVideosByLanguage = (language) =>
  prayerVideos.filter((v) => v.language.toLowerCase() === language.toLowerCase());

export const getCountriesWithPrayers = () => {
  const countryIds = [...new Set(prayerVideos.map((v) => v.country))];
  return africanCountries.filter((c) => countryIds.includes(c.id));
};

export const getLanguagesWithPrayers = () => {
  return [...new Set(prayerVideos.map((v) => v.language))].sort();
};

export const getPrayerTypes = () => prayerTypes;
export const getAfricanCountries = () => africanCountries;
