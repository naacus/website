export const resourcesQuickLinks = {
  contacts: [
    { label: "Women's Ministry", type: 'internal', value: { path: '/fellowship-ministries', sectionId: 'women' } },
    { label: "Youth Ministry", type: 'internal', value: { path: '/fellowship-ministries', sectionId: 'youth' } },
    { label: "Men's Ministry", type: 'internal', value: { path: '/fellowship-ministries', sectionId: 'men' } },
    { label: 'Religious / Spiritual Advisers', type: 'internal', value: { path: '/leadership', sectionId: 'national-advisory-board' } }
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