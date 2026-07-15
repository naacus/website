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

// Shared language catalog to avoid duplication across countries and prayer entries.
export const languageCatalog = [
  { id: 'afrikaans', name: 'Afrikaans' },
  { id: 'akan', name: 'Akan' },
  { id: 'amharic', name: 'Amharic' },
  { id: 'arabic', name: 'Arabic' },
  { id: 'bamileke', name: 'Bamileke' },
  { id: 'baoule', name: 'Baoulé' },
  { id: 'dioula', name: 'Dioula' },
  { id: 'duala', name: 'Duala' },
  { id: 'english', name: 'English' },
  { id: 'ewe', name: 'Ewe' },
  { id: 'ewondo', name: 'Ewondo' },
  { id: 'fon', name: 'Fon' },
  { id: 'french', name: 'French' },
  { id: 'fulfulde', name: 'Fulfulde' },
  { id: 'ga', name: 'Ga' },
  { id: 'hausa', name: 'Hausa' },
  { id: 'igbo', name: 'Igbo' },
  { id: 'kabye', name: 'Kabye' },
  { id: 'kikongo', name: 'Kikongo' },
  { id: 'kikuyu', name: 'Kikuyu' },
  { id: 'kimbundu', name: 'Kimbundu' },
  { id: 'kinyarwanda', name: 'Kinyarwanda' },
  { id: 'kirundi', name: 'Kirundi' },
  { id: 'lingala', name: 'Lingala' },
  { id: 'luganda', name: 'Luganda' },
  { id: 'luo', name: 'Luo' },
  { id: 'makhuwa', name: 'Makhuwa' },
  { id: 'malagasy', name: 'Malagasy' },
  { id: 'oromo', name: 'Oromo' },
  { id: 'portuguese', name: 'Portuguese' },
  { id: 'sotho', name: 'Sotho' },
  { id: 'swahili', name: 'Swahili' },
  { id: 'tigrinya', name: 'Tigrinya' },
  { id: 'tshiluba', name: 'Tshiluba' },
  { id: 'tsonga', name: 'Tsonga' },
  { id: 'twi', name: 'Twi' },
  { id: 'umbundu', name: 'Umbundu' },
  { id: 'wolof', name: 'Wolof' },
  { id: 'xhosa', name: 'Xhosa' },
  { id: 'yoruba', name: 'Yoruba' },
  { id: 'zulu', name: 'Zulu' },
];

const languageById = Object.fromEntries(languageCatalog.map((language) => [language.id, language.name]));

const resolveLanguageName = (languageId) => languageById[languageId] || languageId;

const getCountryIdsForLanguage = (languageId) =>
  africanCountriesBase
    .filter((country) => country.languageIds.includes(languageId))
    .map((country) => country.id);

// African countries / language communities represented (normalized with languageIds)
const africanCountriesBase = [
  { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', languageIds: ['french', 'english', 'ewondo', 'duala', 'bamileke', 'fulfulde'] },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', languageIds: ['igbo', 'yoruba', 'hausa', 'english'] },
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭', languageIds: ['twi', 'akan', 'ga', 'ewe', 'english'] },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', languageIds: ['swahili', 'kikuyu', 'luo', 'english'] },
  { id: 'dr-congo', name: 'DR Congo', flag: '🇨🇩', languageIds: ['french', 'lingala', 'swahili', 'tshiluba', 'kikongo'] },
  { id: 'congo', name: 'Republic of Congo', flag: '🇨🇬', languageIds: ['french', 'lingala', 'kikongo'] },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', languageIds: ['amharic', 'oromo', 'tigrinya'] },
  { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', languageIds: ['swahili', 'english'] },
  { id: 'uganda', name: 'Uganda', flag: '🇺🇬', languageIds: ['luganda', 'swahili', 'english'] },
  { id: 'south-africa', name: 'South Africa', flag: '🇿🇦', languageIds: ['zulu', 'xhosa', 'sotho', 'english', 'afrikaans'] },
  { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', languageIds: ['kinyarwanda', 'french', 'english'] },
  { id: 'burundi', name: 'Burundi', flag: '🇧🇮', languageIds: ['kirundi', 'french'] },
  { id: 'ivory-coast', name: "Côte d'Ivoire", flag: '🇨🇮', languageIds: ['french', 'baoule', 'dioula'] },
  { id: 'senegal', name: 'Senegal', flag: '🇸🇳', languageIds: ['french', 'wolof'] },
  { id: 'togo', name: 'Togo', flag: '🇹🇬', languageIds: ['french', 'ewe', 'kabye'] },
  { id: 'benin', name: 'Benin', flag: '🇧🇯', languageIds: ['french', 'fon', 'yoruba'] },
  { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', languageIds: ['portuguese', 'makhuwa', 'tsonga'] },
  { id: 'angola', name: 'Angola', flag: '🇦🇴', languageIds: ['portuguese', 'kimbundu', 'umbundu'] },
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', languageIds: ['malagasy', 'french'] },
  { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', languageIds: ['tigrinya', 'arabic'] },
];

export const africanCountries = africanCountriesBase.map((country) => ({
  ...country,
  languages: country.languageIds.map(resolveLanguageName),
}));

// Normalized prayer entries. Prayers are language-based; countries are derived from language usage.
const prayerVideoEntries = [
  {
    id: 1,
    prayerTypeId: 'our-father',
    languageId: 'ewondo',
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
    languageId: 'igbo',
    title: 'Hail Mary in Igbo',
    contributor: 'Chukwuma O.',
    parish: 'Nigerian Catholic Community of Greater Washington, DC',
    description: 'The Hail Mary recited in Igbo, a major language of southeastern Nigeria.',
    prayerText: `Ekele Maria, jupụtara na amara,
  Onyenweanyị nọnyere gị;
  a gọziri gị n’etiti ụmụanyị,
  a gọzikwaara mkpụrụ nke afọ gị, Jisọs.

  Maria dị nsọ, Nne nke Chineke,
  rịaọrịọ anyị bụ ndị mmehie arịrịọ,
  ugbu a na mgbe anyị na-anwụ anwụ. Amen.`,
    videoUrl: 'https://www.youtube.com/watch?v=hZMhqO7t1lg',
    thumbnailUrl: 'https://img.youtube.com/vi/hZMhqO7t1lg/hqdefault.jpg',
    featuresYouth: true,
    dateSubmitted: '2026-03-05',
    status: 'approved',
  },
  {
    id: 3,
    prayerTypeId: 'sign-of-the-cross',
    languageId: 'twi',
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
    languageId: 'lingala',
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
    languageId: 'swahili',
    title: "Apostles' Creed in Swahili",
    contributor: 'NAACUS Community Submission',
    parish: 'East African Catholic Community, MD',
    description: "The Apostles' Creed in Swahili (Kiswahili), a lingua franca of East Africa.",
    prayerText: `Naamini kwa Mungu, Baba Mwenyezi,
Muumba mbingu na nchi.

Na kwa Yesu Kristo, Mwana wake wa pekee, Bwana wetu;
aliyechukuliwa mimba kwa uwezo wa Roho Mtakatifu,
akazaliwa na Bikira Maria;
akateswa chini ya Pontio Pilato;
akasulubiwa, akafa, akazikwa;
akashuka kuzimu;
siku ya tatu akafufuka katika wafu;
akapaa mbinguni;
ameketi mkono wa kuume wa Mungu Baba Mwenyezi;
atakuja tena kuwahukumu walio hai na waliokufa.

Naamini kwa Roho Mtakatifu;
Kanisa Takatifu Katoliki;
Ushirika wa Watakatifu;
Maondoleo ya dhambi;
Ufufuo wa mwili;
na uzima wa milele. Amina.`,
    videoUrl: 'https://www.youtube.com/watch?v=SLgbG-LyHP4',
    thumbnailUrl: 'https://img.youtube.com/vi/SLgbG-LyHP4/hqdefault.jpg',
    featuresYouth: false,
    dateSubmitted: '2026-03-15',
    status: 'approved',
  },
  {
    id: 6,
    prayerTypeId: 'hail-holy-queen',
    languageId: 'kinyarwanda',
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
    languageId: 'wolof',
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
  {
    id: 8,
    prayerTypeId: 'glory-be',
    languageId: 'tshiluba',
    title: 'Glory Be in Tshiluba',
    contributor: 'DR Congo Catholic Community',
    parish: 'Congolese Catholic Community, MD',
    description: 'The Glory Be prayer in Tshiluba, one of the national languages of the Democratic Republic of Congo.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-22',
    status: 'pending',
  },
  {
    id: 9,
    prayerTypeId: 'glory-be',
    languageId: 'swahili',
    title: 'Glory Be in Swahili (DR Congo)',
    contributor: 'DR Congo Catholic Community',
    parish: 'Congolese Catholic Community, MD',
    description: 'The Glory Be prayer in Swahili as spoken in the Democratic Republic of Congo.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-23',
    status: 'pending',
  },
  {
    id: 10,
    prayerTypeId: 'glory-be',
    languageId: 'kikongo',
    title: 'Glory Be in Kikongo',
    contributor: 'DR Congo Catholic Community',
    parish: 'Congolese Catholic Community, MD',
    description: 'The Glory Be prayer in Kikongo, one of the national languages of the Democratic Republic of Congo.',
    videoUrl: null,
    thumbnailUrl: null,
    featuresYouth: false,
    dateSubmitted: '2026-03-24',
    status: 'pending',
  },
];

const expandPrayerVideoEntries = (entries) => {
  return entries.map((entry) => {
    const computedCountryIds = getCountryIdsForLanguage(entry.languageId);
    const countryIds = computedCountryIds;
    const displayCountry = countryIds[0] || null;

    return {
      ...entry,
      baseId: entry.id,
      country: displayCountry,
      countryIds,
      language: resolveLanguageName(entry.languageId),
    };
  }).map(({ languageId, ...video }) => video);
};

export const prayerVideos = expandPrayerVideoEntries(prayerVideoEntries);

// Helper functions
export const getPrayerVideos = () => prayerVideos;

export const getPrayerVideosByPrayer = (prayerTypeId) =>
  getPrayerVideos().filter((v) => v.prayerTypeId === prayerTypeId);

export const getPrayerVideosByCountry = (countryId) =>
  getPrayerVideos().filter((v) => v.countryIds?.includes(countryId));

export const getPrayerVideosByLanguage = (language) =>
  getPrayerVideos().filter((v) => v.language.toLowerCase() === language.toLowerCase());

export const getCountriesWithPrayers = () => {
  const countryIds = [...new Set(getPrayerVideos().flatMap((v) => v.countryIds || []))];
  return getAfricanCountries().filter((country) => countryIds.includes(country.id));
};

export const getLanguagesWithPrayers = () => {
  return [...new Set(getPrayerVideos().map((v) => v.language))].sort();
};

export const getPrayerTypes = () => prayerTypes;
export const getAfricanCountries = () => africanCountries;
