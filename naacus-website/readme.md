# NAACUS Official Website

Professional website for the National Association of African Catholics in the United States (NAACUS), built with React and ready for Microsoft 365 integration.

## README Scope

This file is the app-level README for the React project in [naacus-website](./).

Use this file when you need:
- local app setup and run commands
- build and deployment commands for the frontend
- app implementation notes (components, styles, scripts)

For workspace-level overview and cross-project context, use [../readme.md](../readme.md).

Related index: [docs/readme.md](docs/readme.md).

## Documentation

All project documentation lives in the [docs/](docs/readme.md) folder, organized into three categories:

| Category | Who it's for | Index |
|----------|-------------|-------|
| Engineering | Developers and IT | [docs/engineering/](docs/engineering/) |
| Project Management | IT leads and project tracking | [docs/project/](docs/project/) |
| Stakeholders | Board members and ministry leads | [docs/stakeholders/](docs/stakeholders/) |

→ **Full index:** [docs/readme.md](docs/readme.md)

---

## Features

- **Modern React Application**: Built with React for optimal performance and user experience
- **Responsive Design**: Fully responsive layout that works on all devices
- **Professional UI**: Clean, modern design with smooth animations
- **Microsoft 365 Ready**: Pre-configured for Microsoft 365 authentication and services integration
- **Community Information**: Comprehensive sections about mission, programs, and activities
- **Contact Form**: Interactive contact form ready for backend integration

### Homepage Implementation

The published homepage flow is Hero, Convention 2027, Mission, Why Join, Membership Benefits, Ministries, and Testimonials.

- Convention dates, location, schedule, contact, and registration availability come from `src/data/convention2027.js`.
- Convention actions use a validated registration URL when configured and otherwise offer email updates through the verified Convention contact address.
- The ministries preview reuses verified records from `public/content/ministries.json`.
- Homepage copy is maintained in matching English and French structures under `public/locales/{en,fr}/pages/home-page.json`.
- Incomplete homepage gallery, events, newsletter, contact form, and social-link capabilities remain disabled by default in `src/config/featureFlags.js` until their required content or integrations are verified. Contact information and `info@naacus.org` remain visible when the form is disabled.
- Unsupported attendance, membership, event-count, and geographic claims must not be added without owner approval and a recorded source.

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd naacus-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## New Developer Start Here

If you are new to the project, follow this path first:

1. [Day 0 to Day 2 Onboarding](docs/engineering/quickstart.md)
2. [AI-First Evaluation Guide](docs/engineering/ai-first-evaluation.md)
3. [Environment Variables and Security](docs/engineering/environment-variables.md)
4. [GitHub + Azure Secrets Setup](docs/engineering/github-azure-secrets-setup.md)

Before opening your first PR, run:

```bash
npm run check:translations
npm run eval:ai-first
npm run eval:ai-first:html
```

Stripe key policy for all contributors:
- Do not store Stripe keys in CMS or locale content.
- CI source order is Azure Key Vault first, then GitHub Secrets fallback.
- If no valid key is available, CI logs a warning and deploys with Stripe buy buttons disabled (safe fallback).

### Copy/Paste Onboarding Prompt (for New Team Members)

Use this prompt in Copilot Chat (or your AI assistant) after opening the repository:

```text
I am new to this NAACUS project and I know nothing about the codebase yet.

Please onboard me step-by-step using this repo only:
1) Explain the product goal, main user journeys, and what AI-first means in this project.
2) Give me a map of where key things live (routes, pages, services, CMS content, env/security config).
3) Tell me exactly what commands to run first for setup and baseline validation.
4) Make me run and interpret these checks: translations parity, AI-first eval, AI-first HTML report, tests, and build.
5) Explain the Stripe key security policy and CI behavior:
   - never in CMS/locales,
   - Azure Key Vault first,
   - GitHub Secrets fallback,
   - if unavailable/invalid, Stripe buy buttons are disabled and fallback buttons remain available.
6) Suggest one low-risk first contribution and define done criteria for my first PR.

Use concise steps, include exact file paths, and pause after each step for confirmation.
```

## Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## Microsoft 365 Integration Setup

### Step 1: Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Configure:
   - Name: "NAACUS Website"
   - Supported account types: Choose based on your needs
   - Redirect URI: Add your deployment URLs

### Step 2: Configure Authentication

1. Open `src/config/authConfig.js`
2. Replace `YOUR_CLIENT_ID_HERE` with your Azure AD app client ID
3. Update the authority if needed (for single tenant, use your tenant ID)

### Step 3: API Permissions

In Azure AD, add these API permissions:
- Microsoft Graph > Delegated permissions:
  - `User.Read` - Read user profile
  - `Mail.Send` - Send emails on behalf of user
  - (Optional) `Calendars.ReadWrite` - Calendar integration
  - (Optional) `Files.ReadWrite` - OneDrive integration

### Step 4: Implementation

The MSAL (Microsoft Authentication Library) packages are already installed. To implement:

1. Wrap your app with MsalProvider in `src/index.js`
2. Use authentication hooks in components
3. Call Microsoft Graph APIs for enhanced functionality

Example integration code is available in the configuration files.

## Customization

### Updating Content

- **Header/Logo**: Edit `src/components/Header.js`
- **Header Navigation / Donate CTA**: Edit `src/components/Header.js` (top-level nav links, mobile menu groups, and right-side Donate pill button)
- **Donation & Dues Card Layout**: Edit `src/components/PaymentItemCard.js`, `src/pages/DonationPage.js`, and `src/pages/DuesRegistrationPage.js`
- **Footer Links & Spacing**: Edit `src/components/Footer.js`
- **Menu/Label Text (EN/FR)**: Update `public/locales/en/translation.json` and `public/locales/fr/translation.json`
- **Convention Map Text (EN/FR)**: Update `public/locales/en/pages/events-prayer-library.json` and `public/locales/fr/pages/events-prayer-library.json` under `events.mapHub`
- **Hero Section**: Modify `src/components/Hero.js`
- **About Section**: Update `src/components/About.js`
- **Conference Details**: Edit `src/components/Conference.js`
- **Contact Information**: Modify `src/components/Contact.js`

### Styling

- Global styles: `src/App.css` and `src/index.css`
- Component styles: Individual CSS files in `src/components/`

### Colors

The website uses NAACUS logo-inspired colors defined in `src/config/theme.js`:
- Royal Blue: `#1428A0` (primary brand — logo background)
- Leafy Green: `#4a9900` / `#76D000` (accent — logo Africa silhouette)
- Gold: `#C8A000` (decorative — logo text & laurels)

See [docs/engineering/website_structure.md](docs/engineering/website_structure.md) for full theming details.

## Responsive Breakpoints

- Desktop: > 768px
- Mobile: ≤ 768px

## Security Notes

- Never commit Azure AD client secrets to version control
- Use environment variables for sensitive configuration
- Implement proper authentication checks before accessing protected resources
- Follow Microsoft's security best practices

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)

## Deployment

### Recommended Platforms

1. **Azure Static Web Apps** (Best for Microsoft 365 integration)
   - Seamless integration with Azure AD
   - Free SSL certificates
   - Global CDN

2. **Netlify**
   - Easy deployment from Git
   - Automatic builds on push

3. **Vercel**
   - Optimized for React applications
   - Automatic deployments

### Environment Variables

For production, set these environment variables:
- `REACT_APP_CLIENT_ID` - Azure AD client ID
- `REACT_APP_TENANT_ID` - Azure AD tenant ID (if single tenant)

## Support

For questions or issues:
- Email: info@naacus.org
- Website: Coming soon

## Biennial National Conference

Join us for our next national conference!

- Unity in Christ
- Evangelization and faith formation
- Cultural celebrations
- Networking with African Catholic communities nationwide

Conference details coming soon!

## About NAACUS

The National Association of African Catholics in the United States (NAACUS) brings together African Catholics and their families to foster faith, leadership, and service in the Church across the United States. Rooted in the Gospel and our motto "Together with Christ," we welcome members into an active community for fellowship, workshops, and collaborative ministries that strengthen parish life and the wider Catholic community.

## License

Copyright © 2024 NAACUS. All rights reserved.

---

Built with care for the NAACUS community
