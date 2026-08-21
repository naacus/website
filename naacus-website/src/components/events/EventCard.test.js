import { render, screen } from '@testing-library/react';
import EventCard from './EventCard';
import FeaturedEventCard from './FeaturedEventCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => ({
      'events.attendees': 'Attendees',
      'events.dates': 'Dates',
      'events.emailForUpdates': 'Email for Updates',
      'events.expectedAttendees': 'Expected Attendees',
      'events.highlights': 'Highlights',
      'events.location': 'Location',
      'events.more': 'more',
      'events.registerNow': 'Register Now',
      'events.viewDetails': 'View Details',
      'events.whatToExpect': 'What to Expect',
      'conference2027.schedule.clergyReligious': 'July 27-29, 2027 | Clergy and Religious Gathering by ACCCRUS',
    }[key] || options?.defaultValue || key),
  }),
}));

const convention = {
  id: 'convention-2027',
  year: 2027,
  title: 'NAACUS & ACCCRUS National Convention',
  description: 'Convention description',
  date: 'July 27-August 1, 2027',
  location: 'Baltimore, Maryland',
  contactEmail: 'baltimore2027@naacus.org',
  registrationUrl: null,
  highlights: ['conference2027.schedule.clergyReligious'],
};

test('featured event omits absent attendees, translates highlights, and offers email updates', () => {
  render(<FeaturedEventCard event={convention} />);

  expect(screen.queryByText('Attendees')).not.toBeInTheDocument();
  expect(screen.getByText('July 27-29, 2027 | Clergy and Religious Gathering by ACCCRUS')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /register now/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /email for updates/i })).toHaveAttribute(
    'href',
    'mailto:baltimore2027@naacus.org?subject=NAACUS%20%26%20ACCCRUS%20National%20Convention%20updates',
  );
});

test('upcoming event uses a valid registration URL when configured', () => {
  render(
    <EventCard
      event={{ ...convention, registrationUrl: 'https://example.org/register' }}
      isUpcoming
    />,
  );

  expect(screen.getByRole('link', { name: /register now/i })).toHaveAttribute(
    'href',
    'https://example.org/register',
  );
  expect(screen.queryByRole('link', { name: /email for updates/i })).not.toBeInTheDocument();
});

test('upcoming event without a valid registration URL or email renders no action', () => {
  render(
    <EventCard
      event={{ ...convention, contactEmail: null, registrationUrl: '#', highlights: [] }}
      isUpcoming
    />,
  );

  expect(screen.queryByRole('link', { name: /register now/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /email for updates/i })).not.toBeInTheDocument();
});