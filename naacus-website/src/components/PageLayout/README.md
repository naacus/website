# PageLayout Components - Standardized Page Structure

This directory contains reusable layout components that enforce consistent styling, spacing, and structure across all pages.

## Components

### PageHeader
Top-level page title, subtitle, and description section.

```jsx
import { PageHeader } from '../components/PageLayout';

<PageHeader
  title="Page Title"
  subtitle="Page subtitle / intro text"
  description="Optional longer description"
/>
```

**Props:**
- `title` (string): Page title
- `subtitle` (string): Brief subtitle/intro
- `description` (string, optional): Longer descriptive text

---

### Section
Container for page sections with consistent padding, background, and max-width.

```jsx
import { Section } from '../components/PageLayout';

<Section alternate={false}>
  {/* Content here */}
</Section>
```

**Props:**
- `alternate` (boolean): Use alternate background color (default: false)
- `children` (node): Section content
- `className` (string, optional): Additional CSS classes

---

### SectionHeader
Centered header for sections (h2 title + description).

```jsx
import { SectionHeader } from '../components/PageLayout';

<SectionHeader
  title="Section Title"
  subtitle="Section description or intro"
/>
```

**Props:**
- `title` (string): Section title (h2)
- `subtitle` (string): Section description
- `centered` (boolean): Center alignment (default: true)

---

### StandardCard
Reusable card component with consistent hover effects and spacing.

```jsx
import { StandardCard } from '../components/PageLayout';

<StandardCard
  title="Card Title"
  description="Card description"
  compact={false}
  onClick={() => {}}
>
  {/* Optional children */}
</StandardCard>
```

**Props:**
- `title` (string): Card title
- `description` (string): Card description
- `children` (node, optional): Custom content
- `footer` (node, optional): Footer content (CTA buttons, etc.)
- `compact` (boolean): Use compact padding (default: false)
- `onClick` (function, optional): Click handler

---

### CardGrid
Responsive grid layout for cards (responsive columns: 4 → 2 → 1).

```jsx
import { CardGrid, StandardCard } from '../components/PageLayout';

<CardGrid columns={3}>
  <StandardCard title="Card 1" description="..." />
  <StandardCard title="Card 2" description="..." />
  <StandardCard title="Card 3" description="..." />
</CardGrid>
```

**Props:**
- `columns` (number): Number of columns (2, 3, or 4; default: 3)
- `children` (node): Card elements
- `className` (string, optional): Additional CSS classes

---

### Article
Standardized text-based content section with title, body, and optional byline.

```jsx
import { Article } from '../components/PageLayout';

<Article
  title="Article Title"
  byline="By Author Name"
>
  <p>Article content with paragraphs, lists, and formatted text.</p>
</Article>
```

**Props:**
- `title` (string): Article title (h2)
- `children` (node): Article body (supports p, ul, ol, strong, em)
- `byline` (string, optional): Author/source byline

---

## Usage Example: Refactored ResourcesPage

### Before (Inconsistent Styling)
```jsx
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  pageIntro: { /* ... */ },
  title: { /* ... */ },
  // 50+ lines of custom styles...
});

export default function ResourcesPage() {
  const styles = useStyles();
  return (
    <PageWrapper>
      <section className={styles.pageIntro}>
        {/* Page title/intro */}
      </section>
      {/* More custom styled sections */}
    </PageWrapper>
  );
}
```

### After (Standardized)
```jsx
import { 
  PageHeader, 
  Section, 
  SectionHeader, 
  CardGrid, 
  StandardCard 
} from '../components/PageLayout';
import PageWrapper from '../components/PageWrapper';

export default function ResourcesPage() {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <PageHeader
        title={t('resourcesPage.title')}
        subtitle={t('resourcesPage.subtitle')}
      />

      <Section>
        <SectionHeader
          title={t('resourcesPage.outcomes.title')}
          subtitle={t('resourcesPage.outcomes.subtitle')}
        />
        <CardGrid columns={3}>
          <StandardCard
            title={t('resourcesPage.outcomes.formation.title')}
            description={t('resourcesPage.outcomes.formation.body')}
          />
          {/* More cards */}
        </CardGrid>
      </Section>
    </PageWrapper>
  );
}
```

**Benefits:**
- ✅ Consistent styling across all pages
- ✅ Significantly less code (no custom makeStyles)
- ✅ Easy maintenance: update component once, all pages benefit
- ✅ Built-in responsive behavior
- ✅ Accessible HTML structure

---

## Spacing Standards

All components use these standard spacing values:

| Level | Value |
|-------|-------|
| Page section margin bottom | 32px (24px mobile) |
| Section header margin bottom | 32px (24px mobile) |
| Card padding | 24px (18px mobile) |
| Card gap (grid) | 24px (18px mobile) |
| Title margin bottom | 12px |
| Text margin bottom | 8-16px |

---

## Color Standards

- **Titles (h1, h2)**: `tokens.colorBrandBackground`
- **Subtitles**: `tokens.colorNeutralForeground2`
- **Body text**: `tokens.colorNeutralForeground1`
- **Section background (default)**: `tokens.colorNeutralBackground1`
- **Section background (alternate)**: `tokens.colorNeutralBackground2`

---

## Migration Checklist

To refactor a page:

1. Replace inline `makeStyles` with PageLayout components
2. Extract page title → use `PageHeader`
3. Extract section titles → use `SectionHeader`
4. Replace `Card` components → use `StandardCard`
5. Replace custom grid → use `CardGrid`
6. Test responsive behavior on mobile (768px breakpoint)
7. Verify all colors and fonts match design

---

## Future Enhancements

- [ ] Add `Hero` component for gradient hero sections
- [ ] Add `TestimonialCard` for specialized testimonial styling
- [ ] Add `Tabs` component for tabbed content
- [ ] Add `Timeline` component for chronological content
- [ ] Create Storybook stories for each component
