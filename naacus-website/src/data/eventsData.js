/**
 * Events Data for NAACUS
 * Automatically categorizes events into past or upcoming based on start/end dates.
 */

import { convention2027 } from './convention2027';

const allEventsSource = [
  {
    id: 'past-2023-summit',
    title: 'National Summit of African Catholics',
    startDate: '2023-07-15',
    endDate: '2023-07-17',
    location: 'Chicago, Illinois',
    format: 'in-person',
    description:
      'The inaugural gathering that brought together African Catholics from across the nation to celebrate faith, heritage, and community.',
    highlights: [
      'Opening Mass with Bishop',
      'Cultural performances and celebrations',
      'Leadership workshops',
      'Networking breakfasts',
    ],
    attendees: '2,500+',
    status: 'completed',
  },
  {
    id: 'past-2024-regional',
    title: 'Regional Chapters Conference 2024',
    startDate: '2024-09-21',
    endDate: '2024-09-23',
    location: 'Microsoft Teams (Virtual)',
    format: 'teams',
    description:
      'A gathering of regional chapter leaders and volunteers to strengthen organizational efforts and community engagement.',
    highlights: [
      'Chapter leadership training',
      'Strategic planning sessions',
      'Spiritual formation retreat',
      'Community service projects',
    ],
    attendees: '1,200+',
    status: 'completed',
  },
  {
    id: 'past-2024-spiritual-retreat',
    title: 'Spiritual Retreat: "Deeper in Faith"',
    startDate: '2024-04-12',
    endDate: '2024-04-14',
    location: 'St. Louis, Missouri',
    format: 'in-person',
    description:
      'A transformative retreat focused on deepening spiritual connection and Catholic identity among African Catholics.',
    highlights: [
      'Daily Mass and prayer services',
      'Eucharistic adoration',
      'Spiritual direction sessions',
      'Fellowship and dining',
    ],
    attendees: '800+',
    status: 'completed',
  },
  {
    id: 'past-2025-conference',
    title: 'NAACUS National Conference 2025',
    startDate: '2025-07-18',
    endDate: '2025-07-20',
    location: 'Houston, Texas',
    format: 'in-person',
    description:
      'Our most comprehensive annual gathering celebrating African Catholic faith, culture, and service across America. Join us for inspiring presentations, spiritual renewal, and community fellowship.',
    highlights: [
      'Keynote addresses from Church leaders',
      'Concurrent workshops and seminars',
      'Cultural exhibitions and performances',
      'Youth leadership programs',
      'Ministerial networking sessions',
      'Closing Gala dinner',
    ],
    attendees: '3,500+',
    status: 'completed',
  },
  {
    id: 'past-2025-youth-summit',
    title: 'Youth Leadership Summit',
    startDate: '2025-08-08',
    endDate: '2025-08-10',
    location: 'Washington, D.C.',
    format: 'in-person',
    description:
      'A dynamic summit designed for young African Catholics aged 18-35 to develop leadership skills, deepen faith, and build lasting networks.',
    highlights: [
      'Leadership development workshops',
      'Career networking sessions',
      'Spiritual mentorship programs',
      'Social justice initiatives',
      'Cultural celebrations',
      'Team building activities',
    ],
    attendees: '500+',
    status: 'completed',
  },
  {
    id: 'past-2025-women-retreat',
    title: 'Women\'s Ministry Retreat: "Rise and Shine"',
    startDate: '2025-10-03',
    endDate: '2025-10-05',
    location: 'Nashville, Tennessee',
    format: 'in-person',
    description:
      'A special retreat for women to celebrate strength, faith, and community while exploring ministry opportunities.',
    highlights: [
      'Inspirational speakers',
      'Small group discussions',
      'Prayer and reflection circles',
      'Ministry training sessions',
      'Cultural performances',
      'Networking dinners',
    ],
    attendees: '400+',
    status: 'completed',
  },
  {
    id: 'past-2025-youth-ministry-st-carlo-acutis',
    title: 'Youth Ministry Zoom Event: Millennial Saint - St. Carlo Acutis',
    startDate: '2025-12-05T12:00:00',
    endDate: '2025-12-05T12:00:00',
    location: 'Zoom (Virtual)',
    format: 'zoom',
    description:
      'A special Youth Ministry event exploring "The Life & Examples of St. Carlo Acutis for Our Youths in This Year of Hope." Youth presenters Branden Tamwo (Cameroonian) and Chris Nnawuihe (Nigerian), both from the African and Igbo Catholic community New Jersey, delivered inspiring presentations about the Millennial Saint.',
    highlights: [
      'The way St. Carlo spread the Gospel was unique',
      'Whatever you are good at, use it to spread the Gospel',
      'He was an influencer before being an influencer became a thing',
      'Healing miracles through his intercession',
      'He used simple authenticity online',
      'He showed that you don\'t need to be a monk to be a Saint',
      'He showed that Faith & science are not enemies',
      'He practiced radical kindness',
      'He had joy to the end despite his illness',
      'He is a Patron of the internet',
      'He demonstrated deep purpose & daily prayer',
      'Smart phones are not a barrier to prayer',
      'The Eucharist is "my highway to heaven"',
    ],
    attendees: '24',
    status: 'completed',
  },
  {
    id: 'upcoming-2026-leadership-summit',
    title: 'National Leadership Summit 2026',
    startDate: '2026-03-13',
    endDate: '2026-03-15',
    location: 'Microsoft Teams (Virtual)',
    format: 'teams',
    description:
      'A focused gathering for chapter leaders to collaborate on strategy, evangelization, and community outreach for the year ahead.',
    highlights: [
      'Strategic planning labs',
      'Parish collaboration clinics',
      'Mentorship roundtables',
      'Leadership commissioning Mass',
    ],
    attendees: '900+',
    status: 'upcoming',
  },
  {
    id: 'upcoming-2026-youth-encounter',
    title: 'Youth & Young Adult Encounter 2026',
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    location: 'Phoenix, Arizona',
    format: 'in-person',
    description:
      'A vibrant weekend for youth and young adults to deepen faith, build community, and discern leadership roles within NAACUS.',
    highlights: [
      'Praise and worship nights',
      'Vocational discernment sessions',
      'Service immersion projects',
      'Cultural talent showcase',
    ],
    attendees: '1,100+',
    status: 'upcoming',
  },
  {
    id: 'upcoming-2026-family-retreat',
    title: 'Family Faith Retreat 2026',
    startDate: '2026-09-18',
    endDate: '2026-09-20',
    location: 'Charlotte, North Carolina',
    format: 'in-person',
    description:
      'A family-centered retreat to strengthen domestic church life through prayer, formation, and joyful community.',
    highlights: [
      'Family catechesis workshops',
      'Children and teen tracks',
      'Parent coaching sessions',
      'Outdoor rosary walk',
    ],
    attendees: '1,300+',
    status: 'upcoming',
  },
  {
    ...convention2027,
    description: 'Gather with NAACUS and ACCCRUS in Baltimore for prayer, fellowship, and the national convention.',
    highlights: convention2027.schedule.map((item) => item.translationKey),
    status: 'upcoming',
  },
];

const now = new Date();

const sortByStartAsc = (a, b) => new Date(a.startDate) - new Date(b.startDate);
const sortByStartDesc = (a, b) => new Date(b.startDate) - new Date(a.startDate);

const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameDay = startDate.getDate() === endDate.getDate();

  const formatMonthDay = (date) =>
    new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
  const formatMonthDayYear = (date) =>
    new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);

  // Same day - show single date
  if (sameYear && sameMonth && sameDay) {
    return formatMonthDayYear(startDate);
  }

  if (sameYear && sameMonth) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(startDate);
    return `${month} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
  }

  if (sameYear) {
    return `${formatMonthDay(startDate)} - ${formatMonthDay(endDate)}, ${startDate.getFullYear()}`;
  }

  return `${formatMonthDayYear(startDate)} - ${formatMonthDayYear(endDate)}`;
};

const allEvents = allEventsSource.map((event) => ({
  ...event,
  year: new Date(event.startDate).getFullYear(),
  date: formatDateRange(event.startDate, event.endDate),
}));

export const eventsData = (() => {
  const pastEvents = allEvents
    .filter((event) => new Date(event.endDate) < now)
    .sort(sortByStartDesc);

  const upcomingEvents = allEvents
    .filter((event) => new Date(event.endDate) >= now)
    .sort(sortByStartAsc);

  return { pastEvents, upcomingEvents };
})();

export const getEventsByYear = (year) => {
  const past = eventsData.pastEvents.filter((event) => event.year === year);
  const upcoming = eventsData.upcomingEvents.filter((event) => event.year === year);
  return { past, upcoming };
};

export const getAllYears = () => {
  const years = Array.from(new Set(allEvents.map((event) => event.year))).sort((a, b) => a - b);
  return years;
};
