import { getPageIntent } from './pageIntentConfig';

describe('page intent config', () => {
  it('provides EN/FR intent metadata for /dues-registration', () => {
    expect(getPageIntent('/dues-registration', 'en')).toMatchObject({
      nextStepPath: '/membership',
    });

    expect(getPageIntent('/dues-registration', 'fr')).toMatchObject({
      nextStepPath: '/membership',
    });
  });

  it('provides EN/FR intent metadata for /convention-map', () => {
    expect(getPageIntent('/convention-map', 'en')).toMatchObject({
      nextStepPath: '/2025',
    });

    expect(getPageIntent('/convention-map', 'fr')).toMatchObject({
      nextStepPath: '/2025',
    });
  });
});
