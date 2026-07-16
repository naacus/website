import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18nForTests';
import LanguageSwitcher from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset language to English before each test
    i18n.changeLanguage('en');
  });

  test('renders language switcher with current language', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🇺🇸');
  });

  test('displays language options when clicked', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    // Click on the language switcher button
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🇺🇸');
    fireEvent.click(button);

    // Check that Français option appears
    const frenchOption = await screen.findByText(/Français/);
    expect(frenchOption).toBeInTheDocument();
  });
});
