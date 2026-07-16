import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import App from '../App';
import '../i18nForTests';

describe('App accessibility baseline', () => {
  test('home page has no critical axe violations', async () => {
    const { container } = render(<App />);

    const heroTexts = await screen.findAllByText(/Uniting African Catholic Communities Across the United States/i);
    expect(heroTexts.length).toBeGreaterThan(0);

    const results = await axe(container, {
      rules: {
        // JSDOM does not compute color contrast reliably.
        'color-contrast': { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });

  test('skip link is present and points to main content', async () => {
    render(<App />);

    const skipLink = await screen.findByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
