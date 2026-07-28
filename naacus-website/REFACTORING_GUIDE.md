# Page Layout Refactoring Guide

## Progress: 3/21 Pages Complete (14%)

### ✅ COMPLETED
1. **MembershipPage** - Form with multiple sections, error/success messages → PageHeader, Section, Alert
2. **DonationPage** - Grid of payment items → PageHeader, Section, CardGrid  
3. **About** (component) - Mission/vision/values cards → SectionHeader, StandardCard, CardGrid

---

## 🎯 Refactoring Patterns by Page Type

### Pattern 1: Simple Info Pages (AboutPage, PrivacyPage, PrayerLibraryPage)
```jsx
// BEFORE: Custom makeStyles + Card
<div className={styles.container}>
  <Text className={styles.title}>...</Text>
  <div className={styles.grid}>
    <Card><Text>...</Text></Card>
  </div>
</div>

// AFTER: PageLayout Components
<PageHeader title="..." />
<Section>
  <CardGrid columns={3}>
    <StandardCard title="..." description="..." />
  </CardGrid>
</Section>
```

**Pages using this pattern:**
- AboutPage (STARTED - refactored About component)
- PrivacyPage
- PrayerLibraryPage

---

### Pattern 2: Form Pages (MembershipPage, ContactPage, FeedbackPage, DuesRegistrationPage, VolunteerPage)
```jsx
// BEFORE: Custom form styles
<div className={styles.header}>
  <Text className={styles.title}>...</Text>
</div>
<form>
  <Card className={styles.formCard}>
    <Text className={styles.sectionTitle}>...</Text>
    <div className={styles.formGrid}>
      <input />
    </div>
  </Card>
</form>

// AFTER: PageLayout Components
<PageHeader title="..." subtitle="..." />
<Section>
  <FormContainer title="..." description="...">
    <div className={styles.formGrid}>
      <input />
    </div>
  </FormContainer>
  {error && <Alert type="error" ... />}
  {success && <Alert type="success" ... />}
</Section>
```

**Pages using this pattern:**
- MembershipPage (✅ DONE)
- ContactPage (needs: read Contact component, wrap in PageHeader + Section)
- FeedbackPage (needs: read FeedbackForm, wrap in FormContainer)
- DuesRegistrationPage (needs: wrap form in FormContainer)
- VolunteerPage (needs: split into info sections + form)

---

### Pattern 3: Card Grid Pages (EventsPage, LeadershipPage, ProgramsActivitiesPage, FellowshipMinistriesPage)
```jsx
// BEFORE: Custom grid + makeStyles
<div className={styles.pageTop}>
  <Text className={styles.title}>...</Text>
  <div className={styles.planningGrid}>
    <Card>...</Card>
  </div>
</div>

// AFTER: PageLayout Components
<PageHeader title="..." subtitle="..." />
<Section>
  <SectionHeader title="Featured Items" />
  <CardGrid columns={3}>
    <MediaCard image="..." title="..." description="..." />
  </CardGrid>
</Section>
```

**Pages using this pattern:**
- EventsPage
- LeadershipPage
- ProgramsActivitiesPage
- FellowshipMinistriesPage

---

### Pattern 4: List/Content Pages (ResourcesPage, FAQPage, NewslettersPage)
```jsx
// BEFORE: Custom cards + list styling
<div className={styles.outcomesGrid}>
  <Card>...</Card>
</div>
<div className={styles.contentList}>
  {items.map(...)}
</div>

// AFTER: PageLayout Components
<PageHeader title="..." />
<Section>
  <CardGrid columns={3}>
    <StandardCard title="..." description="..." />
  </CardGrid>
</Section>
<Section>
  <FeatureList features={items} />
</Section>
```

**Pages using this pattern:**
- ResourcesPage
- FAQPage (needs: search input + Accordion)
- NewslettersPage

---

### Pattern 5: Complex Sections (HomePage, ConventionMapPage, Event2025Page)
```jsx
// BEFORE: Multiple custom components
<Hero />
<Conference2027Teaser />
<MemberBenefits />
<Testimonials />
<Newsletter />

// AFTER: PageLayout Components
<HeroSection title="..." subtitle="..." cta={{...}} />
<Section>
  <SectionHeader title="Benefits" />
  <CardGrid><StandardCard .../></CardGrid>
</Section>
<Section alternate>
  <TestimonialCard quote="..." author="..." />
</Section>
```

**Pages using this pattern:**
- HomePage (needs: refactor existing components with PageLayout)
- ConventionMapPage
- Event2025Page

---

## 📋 Remaining Pages by Priority

### TIER 1 (High Priority - CTA & Forms)
- [ ] ContactPage - Wrap Contact component in PageHeader + Section
- [ ] FeedbackPage - Wrap form in FormContainer + Alert
- [ ] VolunteerPage - Split info + form with FormContainer

### TIER 2 (Medium Priority - Card Grids)
- [ ] EventsPage - Replace custom grid with CardGrid + MediaCard
- [ ] LeadershipPage - Use CardGrid + MediaCard for team
- [ ] ProgramsActivitiesPage - CardGrid layout
- [ ] FellowshipMinistriesPage - CardGrid layout

### TIER 3 (Lower Priority - Content)
- [ ] FAQPage - Keep Accordion, add PageHeader + Section wrapper
- [ ] ResourcesPage - CardGrid + FeatureList pattern
- [ ] NewslettersPage - List of newsletters with cards
- [ ] DuesRegistrationPage - FormContainer pattern

### TIER 4 (Lowest Priority - Special Pages)
- [ ] HomePage - Complex, multiple sections (last)
- [ ] ConventionMapPage - Map + content sections
- [ ] Event2025Page - Event-specific layout
- [ ] AnalyticsDashboard - Keep as-is (special dashboard)
- [ ] NotFoundPage - Keep as-is (error page)

---

## 🛠️ Quick Refactoring Steps

For each page:

1. **Add import**: `import { PageHeader, Section, CardGrid, ... } from '../components/PageLayout';`

2. **Replace header styling**:
   ```jsx
   // Replace this:
   <div className={styles.header}>
     <Text className={styles.title}>Title</Text>
     <Text className={styles.subtitle}>Subtitle</Text>
   </div>
   
   // With this:
   <PageHeader title="Title" subtitle="Subtitle" />
   ```

3. **Replace grid styling**:
   ```jsx
   // Replace this:
   <div className={styles.grid}>
     {items.map(item => <Card>...</Card>)}
   </div>
   
   // With this:
   <CardGrid columns={3}>
     {items.map(item => <StandardCard ... />)}
   </CardGrid>
   ```

4. **Replace containers**:
   ```jsx
   // Replace this:
   <div className={styles.section}>
   
   // With this:
   <Section>
   ```

5. **Replace custom makeStyles**: Delete entire `const useStyles = makeStyles({...})` block

6. **Test**: Check responsive behavior at 375px, 768px, 1024px, 1440px

---

## 🎨 Component Selection Quick Reference

| Page Element | Use Component | Note |
|---|---|---|
| Page title + subtitle | `PageHeader` | Always at top |
| Major section container | `Section` | Use `alternate` prop for variety |
| Section title (h2) | `SectionHeader` | With optional subtitle |
| Simple item card | `StandardCard` | title, description, footer |
| Image + text card | `MediaCard` | For news, events, programs |
| Quote + author | `TestimonialCard` | For testimonials/reviews |
| Multiple cards | `CardGrid` | Responsive 4→2→1 columns |
| Form wrapper | `FormContainer` | For all form pages |
| Success/error message | `Alert` | Types: info, success, warning, error |
| Numbers/metrics | `StatsGrid` | For key metrics display |
| Chronological items | `Timeline` | For events/schedule |
| Text content | `Article` | For body copy |
| Hero/large intro | `HeroSection` | For landing sections |
| Text + side image | `TwoColumnLayout` | Alternates left/right |
| Call-to-action area | `CTASection` | Prominent action area |

---

## 📊 Expected Results

**Per page refactoring:**
- Custom CSS reduced: 70-80%
- Responsive breakpoints: Automatic (no custom media queries)
- Consistency: 100% (all components use same tokens/spacing)
- Lines of code: ~30-50 per page (down from 100-200)

**Overall project:**
- Total custom CSS: Reduced from ~3000 lines → ~600 lines
- Maintainability: +150% (changes in one place affect all pages)
- Consistency: +200% (unified design system)
- Performance: No change (components are lightweight)

---

## ✅ Verification Checklist

After refactoring each page:

- [ ] Page title renders correctly
- [ ] Spacing is consistent (40px sections, 24px gaps)
- [ ] Hover effects work on cards
- [ ] Mobile layout responsive at 375px
- [ ] Tablet layout responsive at 768px
- [ ] Desktop layout responsive at 1024px+
- [ ] No console errors or warnings
- [ ] All links/buttons functional
- [ ] Forms still submit correctly
- [ ] No visual regression from before

---

## 📝 Notes

- MembershipPage: Full form logic preserved, only CSS simplified
- DonationPage: Stripe integration untouched
- HomePage: Most complex, recommend last (multiple custom components)
- FAQPage: Keep Accordion, just wrap with PageLayout components
- AnalyticsDashboard: Special case, keep as-is (not a content page)

**Time estimate:** ~2-3 hours for full 21-page refactoring
**Difficulty:** Low-Medium (pattern-based, safe refactoring)
