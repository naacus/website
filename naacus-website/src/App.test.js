import { render, screen } from '@testing-library/react';
import App from './App';
import './i18nForTests'; // Import mock i18n configuration for tests

test('renders NAACUS website', async () => {
  render(<App />);
  const headingElement = await screen.findByText(/Uniting African Catholic Communities Across the United States/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders website title', async () => {
  render(<App />);
  const titleElements = await screen.findAllByText('NAACUS');
  expect(titleElements.length).toBeGreaterThan(0);
});
