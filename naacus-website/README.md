# NAACUS Official Website

Professional website for the National Association of African Catholics in the United States (NAACUS), built with React and ready for Microsoft 365 integration.

## 📚 Documentation

All project documentation lives in the [`docs/`](docs/README.md) folder, organized into three categories:

| Category | Who it's for | Index |
|----------|-------------|-------|
| 🔧 **Engineering** | Developers & IT | [docs/engineering/](docs/engineering/) |
| 📋 **Project Management** | IT leads & project tracking | [docs/project/](docs/project/) |
| 👥 **Stakeholders** | Board members & ministry leads | [docs/stakeholders/](docs/stakeholders/) |

→ **Full index:** [docs/README.md](docs/README.md)

---

## 🌟 Features

- **Modern React Application**: Built with React for optimal performance and user experience
- **Responsive Design**: Fully responsive layout that works on all devices
- **Professional UI**: Clean, modern design with smooth animations
- **Microsoft 365 Ready**: Pre-configured for Microsoft 365 authentication and services integration
- **Community Information**: Comprehensive sections about mission, programs, and activities
- **Contact Form**: Interactive contact form ready for backend integration

## 🚀 Quick Start

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

## 📦 Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## 🔧 Microsoft 365 Integration Setup

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

## 🎨 Customization

### Updating Content

- **Header/Logo**: Edit `src/components/Header.js`
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

See [`docs/engineering/WEBSITE_STRUCTURE.md`](docs/engineering/WEBSITE_STRUCTURE.md) for full theming details.

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Mobile: ≤ 768px

## 🔐 Security Notes

- Never commit Azure AD client secrets to version control
- Use environment variables for sensitive configuration
- Implement proper authentication checks before accessing protected resources
- Follow Microsoft's security best practices

## 📄 Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)

## 🌐 Deployment

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

## 📞 Support

For questions or issues:
- Email: info@naacus.org
- Website: Coming soon

## 📅 Biennial National Conference

Join us for our next national conference!

- Unity in Christ
- Evangelization and faith formation
- Cultural celebrations
- Networking with African Catholic communities nationwide

Conference details coming soon!

## 🙏 About NAACUS

The National Association of African Catholics in the United States (NAACUS) brings together African Catholics and their families to foster faith, leadership, and service in the Church across the United States. Rooted in the Gospel and our motto "Together with Christ," we welcome members into an active community for fellowship, workshops, and collaborative ministries that strengthen parish life and the wider Catholic community.

## 📝 License

Copyright © 2024 NAACUS. All rights reserved.

---

Built with ❤️ for the NAACUS community
