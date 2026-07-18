import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import DonationPage from '../pages/DonationPage';
import '../i18nForTests';

describe('Donation page accessibility', () => {
  test('donation page has no critical axe violations', async () => {
    const { container } = render(
      <FluentProvider theme={webLightTheme}>
        <MemoryRouter>
          <DonationPage />
        </MemoryRouter>
      </FluentProvider>,
    );

    const heading = await screen.findByRole('heading', { name: /donation\.initiativesPage\.title|donate to naacus/i });
    expect(heading).toBeInTheDocument();

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  }, 30000);
});
