import { render, screen, within } from '@testing-library/react';
import App from './App';
import './i18nForTests'; // Import mock i18n configuration for tests

test('renders the approved homepage introduction in order', async () => {
  render(<App />);

  const headings = await screen.findAllByRole('heading');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

  const convention = headings.find((heading) => heading.textContent.includes('conference2027.title'));
  const mission = screen.getByRole('heading', { name: 'Our Mission' });
  const whyJoin = screen.getByRole('heading', { name: 'Why Join NAACUS' });
  const benefits = screen.getByRole('heading', { name: 'Membership Benefits' });
  const ministries = screen.getByRole('heading', { name: 'Ministries' });
  const testimonials = screen.getByRole('heading', { name: 'What Our Members Say' });

  expect(convention.compareDocumentPosition(mission) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(mission.compareDocumentPosition(whyJoin) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(whyJoin.compareDocumentPosition(benefits) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(benefits.compareDocumentPosition(ministries) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(ministries.compareDocumentPosition(testimonials) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('renders the three approved hero actions without unsupported scale claims', async () => {
  const { container } = render(<App />);
  const hero = container.querySelector('#home');

  expect(await within(hero).findByRole('button', { name: 'Become a Member' })).toBeInTheDocument();
  expect(within(hero).getByRole('button', { name: 'Explore Our Ministries' })).toBeInTheDocument();
  expect(within(hero).getByRole('button', { name: 'Convention 2027' })).toBeInTheDocument();
  expect(screen.queryByText(/thousands|10,000\+|50\+|100\+|25\+/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /stay updated/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /get in touch/i })).not.toBeInTheDocument();
});

test('renders website title', async () => {
  render(<App />);
  const titleElements = await screen.findAllByText('NAACUS');
  expect(titleElements.length).toBeGreaterThan(0);
});
