export const convention2027 = {
  id: 'upcoming-2027-convention',
  title: 'NAACUS & ACCCRUS National Convention',
  startDate: '2027-07-27',
  endDate: '2027-08-01',
  location: 'Baltimore, Maryland',
  format: 'in-person',
  contactEmail: 'baltimore2027@naacus.org',
  registrationUrl: null,
  schedule: [
    {
      id: 'acccrus-gathering',
      startDate: '2027-07-27',
      endDate: '2027-07-29',
      translationKey: 'conference2027.schedule.clergyReligious',
    },
    {
      id: 'national-convention',
      startDate: '2027-07-29',
      endDate: '2027-08-01',
      translationKey: 'conference2027.schedule.nationalConvention',
    },
  ],
};

const parseCalendarDate = (value) => new Date(`${value}T00:00:00Z`);

export const formatConventionDateRange = (startDate, endDate, locale = 'en-US') => {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  const month = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
  const monthDay = new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', timeZone: 'UTC' });

  if (start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()) {
    return `${month.format(start)} ${start.getUTCDate()}-${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }

  return `${monthDay.format(start)}-${monthDay.format(end)}, ${end.getUTCFullYear()}`;
};