export const getValidRegistrationUrl = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch (error) {
    return null;
  }
};

export const getUpdatesMailto = (event) => {
  if (!event?.contactEmail) return null;

  const subject = encodeURIComponent(`${event.title} updates`);
  return `mailto:${event.contactEmail}?subject=${subject}`;
};