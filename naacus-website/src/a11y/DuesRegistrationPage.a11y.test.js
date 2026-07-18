import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import DuesRegistrationPage from '../pages/DuesRegistrationPage';
import '../i18nForTests';

describe('Dues registration page accessibility', () => {
  test('dues page has no critical axe violations', async () => {
    const { container } = render(
      <FluentProvider theme={webLightTheme}>
        <MemoryRouter>
          <DuesRegistrationPage />
        </MemoryRouter>
      </FluentProvider>,
    );

    const heading = await screen.findByRole('heading', { name: /donation\.duesRegistrationPage\.title|dues and registration/i });
    expect(heading).toBeInTheDocument();

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  }, 30000);
});
