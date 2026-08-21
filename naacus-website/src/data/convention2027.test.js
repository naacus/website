import { convention2027, formatConventionDateRange } from './convention2027';
import { eventsData } from './eventsData';

describe('Convention 2027 canonical data', () => {
  test('feeds the upcoming event without unsupported publication fields', () => {
    const event = eventsData.upcomingEvents.find(({ id }) => id === convention2027.id);

    expect(event).toMatchObject({
      startDate: convention2027.startDate,
      endDate: convention2027.endDate,
      location: convention2027.location,
    });
    expect(event).not.toHaveProperty('attendees');
    expect(event).not.toHaveProperty('registrationLink');
  });

  test('formats the flyer-supported date range for each locale', () => {
    expect(formatConventionDateRange(convention2027.startDate, convention2027.endDate, 'en-US'))
      .toBe('July 27-August 1, 2027');
    expect(formatConventionDateRange(convention2027.startDate, convention2027.endDate, 'fr-FR'))
      .toBe('27 juillet-1 août, 2027');
  });
});