# PageLayout Component Library - Complete Reference

Standardized layout components (20 total) for consistent page structure, spacing, typography, and interactivity across NAACUS website.

## Component Inventory

### 🎯 Core Layout (6 components)
Essential building blocks for every page

- **PageHeader** - Page title, subtitle, description banner
- **Section** - Content container with consistent padding
- **SectionHeader** - Section title (h2) + optional subtitle
- **StandardCard** - Reusable card with title, description, footer
- **CardGrid** - Responsive card grid (4→2→1 columns)
- **Article** - Text-based content container

### 🦸 Hero & Large Sections (3 components)
Full-width emphasis areas

- **HeroSection** - Large banner intro with background image/gradient + CTA
- **TwoColumnLayout** - Text + image side-by-side (alternating)
- **CTASection** - Prominent call-to-action area with buttons

### 📊 Data Visualization (2 components)
Display metrics and timelines

- **StatsGrid** - Key metrics/statistics display
- **Timeline** - Chronological events with alternating layout

### 🎨 Cards & Media (2 components)
Specialized card variations

- **TestimonialCard** - Quote + author attribution + star rating
- **MediaCard** - Image card with title, description, tags, metadata

### 📝 Forms (1 component)
Form wrapper

- **FormContainer** - Standardized form with title/description header

### 🗂️ Lists & Navigation (3 components)
Navigation and content listings

- **FeatureList** - Numbered/bulleted list with icons
- **Breadcrumb** - Navigation trail
- **ImageGallery** - Image grid with lightbox

### ⚠️ Alerts & Feedback (1 component)
User messaging

- **Alert** - Info/success/warning/error messages with icons

### 🛠️ Utilities (2 components)
Helper components

- **CTAButtonGroup** - Multiple action buttons
- **IconWithText** - Icon + label + description

---

## Usage Examples by Component

### PageHeader
Page title, subtitle, and description
```jsx
<PageHeader 
  title="Membership"
  subtitle="Join Our Community"
  description="Become part of a vibrant community of faith and service"
/>
```

### Section
Content container with consistent padding
```jsx
<Section>
  {/* content here */}
</Section>

<Section alternate>
  {/* content with background color */}
</Section>
```

### SectionHeader
Section title with optional subtitle
```jsx
<SectionHeader 
  title="Our Programs"
  subtitle="Making a difference"
/>
```

### StandardCard
Card with title, description, optional footer, click handler
```jsx
<StandardCard
  title="Card Title"
  description="Card description"
  footer="Footer text"
  compact={false}
  onClick={() => console.log('Clicked')}
>
  {/* Optional children content */}
</StandardCard>
```

### CardGrid
Responsive grid layout for cards
```jsx
<CardGrid columns={3}>
  <StandardCard title="Card 1" description="..." />
  <StandardCard title="Card 2" description="..." />
  <StandardCard title="Card 3" description="..." />
</CardGrid>
```

### Article
Text-based content container
```jsx
<Article title="About NAACUS" byline="By Leadership Team">
  <p>Paragraph text...</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
  <p><strong>Bold text</strong> and <em>italic text</em></p>
</Article>
```

### HeroSection
Large banner with background image/gradient + CTA
```jsx
<HeroSection
  title="Welcome to NAACUS"
  subtitle="Serving African Catholics Worldwide"
  backgroundImage="url(./hero-bg.jpg)"
  backgroundGradient="linear-gradient(135deg, #0067b8 0%, #004578 100%)"
  cta={{ label: 'Join Today', href: '/membership' }}
/>
```

### TwoColumnLayout
Text + image side-by-side
```jsx
<TwoColumnLayout
  image={{ src: './leadership.jpg', alt: 'Leadership Team' }}
  align="left"  // or "right"
>
  <h2>Our Leadership</h2>
  <p>Description of leadership...</p>
</TwoColumnLayout>
```

### CTASection
Call-to-action area with buttons
```jsx
<CTASection
  title="Ready to Join?"
  description="Become part of our thriving community"
  primaryCta={{ label: 'Membership', href: '/membership' }}
  secondaryCta={{ label: 'Learn More', href: '/about' }}
/>
```

### StatsGrid
Display key metrics
```jsx
import { StatsGrid } from './components/PageLayout';

<div>
  <h2>Our Impact</h2>
  <StatsGrid>
    <StatCard number="5000+" label="Members" />
    <StatCard number="12" label="Programs" />
    <StatCard number="50+" label="Events" description="Annually" />
    <StatCard number="40" label="Years" description="Of Service" />
  </StatsGrid>
</div>
```

### Timeline
Chronological events display
```jsx
<Timeline
  events={[
    {
      date: 'March 2025',
      title: 'Annual Convention',
      description: 'Three days of spiritual growth and networking'
    },
    {
      date: 'April 2025',
      title: 'Youth Summit',
      description: 'Empowering young Catholics for leadership'
    },
    {
      date: 'June 2025',
      title: 'Summer Retreat',
      description: 'Peaceful time of reflection and prayer'
    },
  ]}
/>
```

### TestimonialCard
Quote with author and rating
```jsx
<CardGrid columns={3}>
  <TestimonialCard
    quote="NAACUS has transformed my faith journey and connected me with amazing people."
    author="John Smith"
    title="Parish Member"
    rating={5}
  />
  <TestimonialCard
    quote="A wonderful community dedicated to service and spiritual growth."
    author="Mary Johnson"
    title="Program Volunteer"
    rating={5}
  />
</CardGrid>
```

### MediaCard
Image card with metadata
```jsx
<CardGrid columns={3}>
  <MediaCard
    image="./convention-photo.jpg"
    title="Annual Convention"
    description="Join us for three days of spiritual growth..."
    tags={['Annual', '2025', 'Convention']}
    meta="March 15-17, 2025 | New Orleans"
  />
  <MediaCard
    image="./youth-program.jpg"
    title="Youth Empowerment"
    description="Developing tomorrow's leaders..."
    tags={['Youth', 'Leadership']}
    meta="Ongoing Program"
  />
</CardGrid>
```

### FormContainer
Standardized form wrapper
```jsx
<FormContainer 
  title="Membership Application"
  description="Join our community of faith and service"
>
  <input type="text" placeholder="First Name" required />
  <input type="email" placeholder="Email Address" required />
  <textarea placeholder="Why do you want to join?" />
  <button type="submit">Apply Now</button>
</FormContainer>
```

### FeatureList
Numbered/bulleted list with icons
```jsx
import { Check20Filled, People20Filled, Heart20Filled } from '@fluentui/react-icons';

<FeatureList
  features={[
    { 
      title: 'Community Connection', 
      description: 'Connect with like-minded Catholics worldwide',
      icon: <People20Filled />
    },
    { 
      title: 'Spiritual Growth', 
      description: 'Deepen your faith through programs and prayer',
      icon: <Heart20Filled />
    },
    { 
      title: 'Service Opportunities', 
      description: 'Make a positive impact in your community',
      icon: <Check20Filled />
    },
  ]}
/>
```

### Breadcrumb
Navigation trail
```jsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Programs', href: '/programs' },
    { label: 'Youth', href: '/programs/youth' },
    { label: 'College Fellowship' },
  ]}
/>
```

### ImageGallery
Image grid with lightbox
```jsx
<ImageGallery
  images={[
    { src: './gallery-1.jpg', alt: 'Convention 2024' },
    { src: './gallery-2.jpg', alt: 'Youth Event' },
    { src: './gallery-3.jpg', alt: 'Community Service' },
    { src: './gallery-4.jpg', alt: 'Prayer Gathering' },
  ]}
/>
```

### Alert
Info/success/warning/error messages
```jsx
<Alert 
  type="info" 
  title="New Feature" 
  message="Check out our new membership benefits"
/>

<Alert 
  type="success" 
  title="Success!" 
  message="Your membership application has been approved"
/>

<Alert 
  type="warning" 
  title="Update Required" 
  message="Please review and update your profile information"
/>

<Alert 
  type="error" 
  title="Error" 
  message="Something went wrong. Please try again."
  onClose={() => setShowError(false)}
/>
```

### CTAButtonGroup
Multiple action buttons
```jsx
<CTAButtonGroup
  buttons={[
    { label: 'Join Now', href: '/membership', appearance: 'primary' },
    { label: 'Learn More', href: '/about', appearance: 'secondary' },
    { label: 'Contact Us', href: '/contact', appearance: 'secondary' },
  ]}
/>
```

### IconWithText
Icon with label and description
```jsx
import { People20Filled } from '@fluentui/react-icons';

<IconWithText
  icon={<People20Filled />}
  label="Global Community"
  description="Connect with Catholics in 50+ countries"
  layout="vertical"
/>
```

---

## Complete Page Example

```jsx
import React from 'react';
import {
  PageHeader,
  Section,
  SectionHeader,
  HeroSection,
  TwoColumnLayout,
  CardGrid,
  StandardCard,
  CTASection,
  StatsGrid,
  Timeline,
  Breadcrumb,
  Article
} from './components/PageLayout';

export default function MembershipPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Membership' }
        ]}
      />

      <HeroSection
        title="Join Our Community"
        subtitle="Become part of a global faith community"
        backgroundGradient="linear-gradient(135deg, #0067b8 0%, #004578 100%)"
        cta={{ label: 'Apply Now', href: '#form' }}
      />

      <Section>
        <SectionHeader title="Why Join NAACUS?" />
        <CardGrid columns={3}>
          <StandardCard 
            title="Spiritual Growth"
            description="Deepen your faith through programs, retreats, and community"
          />
          <StandardCard 
            title="Community Service"
            description="Make a difference through organized volunteer opportunities"
          />
          <StandardCard 
            title="Global Network"
            description="Connect with Catholics in 50+ countries"
          />
        </CardGrid>
      </Section>

      <TwoColumnLayout
        image={{ src: './members.jpg', alt: 'NAACUS Members' }}
        align="left"
      >
        <h2>Our Members</h2>
        <p>NAACUS has served African Catholics for 40 years...</p>
      </TwoColumnLayout>

      <Section alternate>
        <SectionHeader title="By The Numbers" centered />
        <StatsGrid>
          <StatCard number="5000+" label="Members" />
          <StatCard number="40" label="Years" />
          <StatCard number="12" label="Programs" />
          <StatCard number="50+" label="Events" />
        </StatsGrid>
      </Section>

      <CTASection
        title="Ready to Join?"
        description="Apply for membership today and start your journey"
        primaryCta={{ label: 'Apply Now', href: '#form' }}
        secondaryCta={{ label: 'Learn More', href: '/about' }}
      />
    </>
  );
}
```

---

## Spacing & Responsive Breakpoints

All components use consistent spacing and respond to breakpoints:

| Property | Desktop | Tablet (900px) | Mobile (768px) |
|----------|---------|----------------|----------------|
| Section padding | 40px | 32px | 28px |
| CardGrid gap | 24px | 18px | 16px |
| Card padding | 24px | 20px | 18px |
| Title font | 2rem | 1.6rem | 1.4rem |
| Subtitle font | 1.1rem | 1rem | 0.95rem |

---

## Color System

All components use Fluent UI tokens:

- **Brand**: `tokens.colorBrandBackground` (#0067b8)
- **Primary text**: `tokens.colorNeutralForeground1`
- **Secondary text**: `tokens.colorNeutralForeground2`
- **Borders**: `tokens.colorNeutralStroke1`
- **Background**: `tokens.colorNeutralBackground2`
- **Shadows**: `tokens.shadow8`, `tokens.shadow16`

---

## Component Organization

```
naacus-website/src/components/PageLayout/
├── index.js                 (barrel export - 20 exports)
├── PageHeader.js
├── Section.js
├── SectionHeader.js
├── StandardCard.js
├── CardGrid.js
├── Article.js
├── HeroSection.js
├── TwoColumnLayout.js
├── CTASection.js
├── StatsGrid.js
├── Timeline.js
├── TestimonialCard.js
├── MediaCard.js
├── FormContainer.js
├── FeatureList.js
├── Breadcrumb.js
├── ImageGallery.js
├── Alert.js
├── CTAButtonGroup.js
├── IconWithText.js
├── README.md
└── COMPONENTS.md (this file)
```

---

## Best Practices

1. **Always use PageHeader** at top of every page
2. **Nest logically**: PageHeader → Section → SectionHeader → CardGrid
3. **Alternate sections** for visual break: `<Section alternate>`
4. **Mobile-first**: Test at 375px, 768px, 1024px, 1440px
5. **Accessibility**: All components include semantic HTML & ARIA labels
6. **Reuse components**: Prefer composition over custom styling
7. **Use appropriate card types**: StandardCard vs MediaCard vs TestimonialCard
8. **Responsive images**: Always set max-width 100% for TwoColumnLayout
9. **Form validation**: Use Alert component for error messages
10. **Icon selection**: Import icons from `@fluentui/react-icons`

---

## Migration Guide

When refactoring existing pages:

1. Replace `makeStyles` with PageLayout components
2. Remove custom padding/spacing CSS
3. Update titles to use `PageHeader`, `SectionHeader`
4. Replace card components with `StandardCard`, `MediaCard`, `TestimonialCard`
5. Use `CardGrid` instead of custom grid layouts
6. Replace `<Section>` custom containers
7. Test responsive behavior at all breakpoints
8. Verify hover states on desktop
9. Test on mobile and tablet devices
10. Remove unused CSS files

**Expected result**: 70-80% reduction in component CSS code, consistent design system, improved maintainability.
