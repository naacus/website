export const resourcesQuickLinks = {
  contacts: [
    { label: "Women's Ministry", type: 'email', value: 'women@naacus.org' },
    { label: "Youth Ministry", type: 'email', value: 'youth@naacus.org' },
    { label: "Men's Ministry", type: 'email', value: 'men@naacus.org' },
    { label: 'Religious / Spiritual Advisers', type: 'internal', value: { path: '/', sectionId: 'leadership' } }
  ],
  support: [
    { label: '988 Suicide & Crisis Lifeline', type: 'external', value: 'https://988lifeline.org' },
    { label: 'Call 988', type: 'tel', value: '988' }
  ],
  prayer: [
    { label: 'USCCB Daily Readings', type: 'external', value: 'https://bible.usccb.org/daily-bible-reading' },
    { label: 'iBreviary', type: 'external', value: 'https://www.ibreviary.org/en/' }
  ]
};

export default resourcesQuickLinks;