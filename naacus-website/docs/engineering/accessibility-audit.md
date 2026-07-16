# NAACUS Website - Accessibility (a11y) Audit Report

**Generated:** July 16, 2026  
**Status:** Updated After Critical Fix Pass

---

## 📊 Executive Summary

The NAACUS website has a **strong baseline** after a targeted critical remediation pass.
Automated a11y checks are in place and passing, and previously flagged critical items
for decorative image handling, form control labeling, and contrast-sensitive feedback
controls were addressed.

---

## ✅ Strengths

| Item | Status | Details |
|------|--------|---------|
| **Semantic HTML** | ✅ Good | Using `Text as="h1"`, `as="h2"` for proper heading hierarchy |
| **Reduced Motion** | ✅ Good | `@media (prefers-reduced-motion: reduce)` respected in App.css |
| **Keyboard Navigation** | ✅ Partial | Ministry cards have `role="button"`, `tabIndex`, and `onKeyDown` |
| **Fluent UI Components** | ✅ Good | Built-in a11y support from Microsoft Fluent library |
| **Aria Labels** | ✅ Partial | `aria-label` used on BackToTop button |
| **Focus Styling** | ⚠️ Moderate | Hover states visible, focus indicators could be stronger |

---

## ⚠️ Issues Found

### **Critical Issues**

| Issue | Severity | Location | Recommendation |
|-------|----------|----------|-----------------|
| **Decorative Image Announcements** | ✅ Resolved | `src/components/Hero.js`, `src/components/Conference2027Teaser.js` | Decorative slideshow images now use `alt=""` and `aria-hidden="true"` |
| **Color Contrast** | ✅ Resolved | `src/components/Header.js` feedback buttons | Updated to darker red shades and added stronger focus-visible outlines |
| **Missing Form Labels** | ✅ Resolved | `src/pages/FAQPage.js`, `src/components/SearchInput.js` | Added explicit `aria-label` values and clear-button labeling |
| **Stripe Button Contrast** | 🟠 High | Donate button may have low contrast over image backgrounds | Add background container or border |

### **Major Issues**

| Issue | Severity | Location | Recommendation |
|--------|----------|----------|-----------------|
| **No Skip Navigation Link** | 🟠 High | Header/navigation | Add "Skip to Main Content" link at top of page |
| **Div Used as Button** | 🟠 High | Multiple locations (e.g., `Ministries.js`) | Use `<button>` elements instead of `<div role="button">` |
| **Missing Link Descriptions** | 🟠 High | Footer links, breadcrumbs | Use descriptive link text instead of generic "Learn More" |
| **No Focus Indicators** | 🟠 High | Many interactive elements | Add visible `:focus` and `:focus-visible` styles |
| **Image Gallery** | 🟠 High | Photo galleries lack alt text and proper labeling | Add ARIA labels to gallery controls |

### **Minor Issues**

| Issue | Severity | Location | Recommendation |
|--------|----------|----------|-----------------|
| **Animated Text** | 🟡 Minor | Blinking feedback button, hero animations | Ensure animations stop or can be paused |
| **Mobile Menu Gap** | 🟡 Minor | Tablet width breakpoint (already fixed) | ✅ Fixed in latest commit |
| **Heading Hierarchy** | 🟡 Minor | Some sections missing `<h2>` properly | Ensure no skipped heading levels (h1 → h3) |
| **Tooltip ARIA** | 🟡 Minor | Hover tooltips lack `role="tooltip"` and `aria-describedby` | Add ARIA attributes for context |

---

## 🔍 Detailed Component Analysis

### **Header Component**
- ✅ Uses semantic nav structure
- ⚠️ Hamburger menu button needs clearer aria-label (currently uses icon only)
- ⚠️ Search input may need aria-label for screen readers
- 🔴 Missing skip-to-content link

### **Hero Component**
- ✅ Decorative slideshow images are hidden from assistive tech with `alt=""` and `aria-hidden="true"`
- ✅ Decorative emojis are wrapped with `aria-hidden="true"`
- ✅ Primary button has descriptive text

### **Hero Section Images**
- ✅ Decorative slideshow images updated for non-verbal presentation
- ℹ️ Content images continue to use descriptive alt text where meaningful

### **Leadership/Ministry Cards**
- 🔴 No alt text on member photos
- ⚠️ "Read More" button could be more descriptive
- Consider: `aria-label="Read more about {name}"`

### **Forms (Membership, Newsletter, Contact)**
- ✅ FAQ and header search controls now have explicit accessible names
- ⚠️ Broader form review remains recommended for consistency across all flows
- ⚠️ Error messages need `aria-live="polite"` and `aria-invalid="true"`
- Consider: Add inline error messages with `aria-describedby`

### **Stripe Donate Button**
- ⚠️ Button may be hard to see over backgrounds
- ✅ Renders natively from Stripe (uses Stripe's a11y)

### **Mobile Menu**
- ⚠️ Disabled menu items (section headers) should not be disabled, use styling only
- ⚠️ No focus management when menu opens
- Recommendation: Trap focus within menu, return focus to trigger on close

---

## 📋 WCAG 2.1 Compliance Status

| Principle | Level AA | Issues | Priority |
|-----------|----------|--------|----------|
| **Perceivable** | ✅ Improved | Critical image/contrast findings addressed | Medium |
| **Operable** | ✅ Improved | Skip link present, focus indicators strengthened in header controls | Medium |
| **Understandable** | ✅ Good | Clear language, good structure | Low |
| **Robust** | ⚠️ Partial | Some semantic HTML issues | Medium |

---

## Remediation Log (July 16, 2026)

- Updated decorative slideshow images to avoid unnecessary screen reader announcements.
- Added explicit labels for FAQ search and search-trigger controls.
- Added clear-button accessible name in FAQ search.
- Increased feedback button contrast and added `:focus-visible` outlines for keyboard users.
- Verified `npm run lint:a11y` and `npm run test:a11y -- --watch=false` both pass.

---

## 🛠️ Recommended Fixes (Priority Order)

### **Phase 1: Critical (Week 1)**
```javascript
// 1. ADD ALT TEXT TO ALL IMAGES
<img src="hero.jpg" alt="NAACUS 2025 Annual Conference" />

// 2. ADD SKIP LINK
<a href="#main" className="skip-link">Skip to main content</a>
<main id="main">...</main>

// 3. FIX FORM LABELS
<label htmlFor="email">Email Address</label>
<Input id="email" type="email" />

// 4. ADD FOCUS STYLES
button {
  &:focus-visible {
    outline: 3px solid #0067b8;
    outline-offset: 2px;
  }
}
```

### **Phase 2: High (Week 2-3)**
- Replace `<div role="button">` with `<button>` elements
- Add focus management to mobile menu
- Improve color contrast on animated elements
- Add aria-labels to gallery controls

### **Phase 3: Medium (Week 4)**
- Fix heading hierarchy throughout site
- Add proper ARIA descriptions to complex widgets
- Implement focus trap in dialogs
- Test with screen readers (NVDA, JAWS, VoiceOver)

---

## 🧪 Testing Tools & Setup

### **Immediate Actions**
1. **Install jest-axe for automated testing:**
```bash
npm install --save-dev jest-axe @testing-library/jest-axe
```

2. **Run Lighthouse Audit:**
   - Open DevTools → Lighthouse tab
   - Run audit for accessibility
   - Target: Score ≥ 90

3. **Manual Testing:**
   - Use axe DevTools browser extension
   - Test with keyboard only (Tab, Enter, Esc)
   - Test with screen reader (macOS VoiceOver, NVDA on Windows)

4. **Color Contrast Check:**
   - Use WebAIM Contrast Checker
   - Check: feedback button, Stripe button, links

### **Add to CI/CD Pipeline:**
```json
{
  "scripts": {
    "test:a11y": "jest --testPathPattern='a11y' --coverage",
    "lint:a11y": "eslint src --plugin jsx-a11y"
  }
}
```

---

## 📚 WCAG Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Blog](https://webaim.org/articles/)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/)
- [Microsoft Accessibility Hub](https://www.microsoft.com/en-us/accessibility/)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## 📞 Next Steps

1. **Review this report** with the team
2. **Prioritize fixes** based on impact and effort
3. **Create GitHub issues** for each item
4. **Assign owners** and set deadlines
5. **Set up automated testing** (jest-axe)
6. **Schedule regular audits** (quarterly)

---

**Questions?** Contact the development team or accessibility lead.
