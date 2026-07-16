import { render, screen } from '@testing-library/react';
import App from './App';
import './i18nForTests'; // Import mock i18n configuration for tests

test('renders NAACUS website', async () => {
  render(<App />);
  const headingElements = await screen.findAllByText(/Uniting African Catholic Communities Across the United States/i);
  expect(headingElements.length).toBeGreaterThan(0);
});

test('renders website title', async () => {
  render(<App />);
  const titleElements = await screen.findAllByText('NAACUS');
  expect(titleElements.length).toBeGreaterThan(0);
});
