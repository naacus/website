# Environment Variables Management

> **Category:** 🔧 Engineering | **Audience:** Developers & DevOps Team
> **Last Updated:** July 17, 2026 | [← Docs Index](../readme.md)

---

A secure, scalable approach for managing configuration across local development, testing, and Azure production.

## Overview

```
LOCAL DEVELOPMENT      TESTING           PRODUCTION (AZURE)
    ↓                    ↓                     ↓
.env.local         .env.test.local      Azure Key Vault
.env               (CI/CD vars)         App Configuration
(placeholder)                            (Managed Identities)
```

For production templates (`.env.production`), keep Stripe secret values empty in source control. Inject real values during CI using `.env.production.local` so committed placeholders cannot leak into deployed bundles.

---

## 1. Local Development

### Strategy: Use `.env.local` for actual credentials

**Why?**
- `.env` contains only placeholders (safe to commit)
- `.env.local` contains real credentials (in `.gitignore`, never committed)
- Each developer has their own secure configuration

### Setup:

**1a. Placeholder file (`.env` - COMMIT THIS)**
```bash
# DO NOT include real credentials here
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
REACT_APP_STRIPE_BUY_BUTTON_ID=buy_btn_your_buy_button_id_here
REACT_APP_API_BASE_URL=http://localhost:5001
REACT_APP_DEBUG_PAYMENTS=false
```

**1b. Local overrides (`.env.local` - NEVER COMMIT)**
```bash
# Add to .gitignore (already done ✓)
# Your actual local credentials
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_ACTUAL_KEY_HERE
REACT_APP_STRIPE_BUY_BUTTON_ID=buy_btn_ACTUAL_ID_HERE
```

### Verify `.gitignore` includes these:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 2. Testing & CI/CD Environment

### Strategy: GitHub Secrets + Azure Static Web Apps Workflow

Your existing Azure workflow (`.github/workflows/azure-static-web-apps-polite-pebble-0f00f890f.yml`) has been enhanced to automatically inject environment variables from GitHub Secrets during the build process.

**2a. Store secrets in GitHub:**
```
Settings → Secrets and variables → Actions → New repository secret
```

**Required secrets to add:**
```
STRIPE_PUBLIC_KEY_TEST=pk_test_...
STRIPE_BUY_BUTTON_ID_TEST=buy_btn_...
API_BASE_URL_TEST=https://api-test.naacus.org (optional)
```

**2b. How it works:**
1. When you push to `develop` or create a PR:
   - GitHub Actions runs your quality gate job
   - Secrets are injected as environment variables
   - Build uses test credentials (safe, non-destructive)
   - Tests & evals run with real test API keys
   - Build artifacts uploaded to Azure

2. If push succeeds:
   - Build artifacts deployed to Azure Static Web Apps
   - Production app uses Azure Key Vault secrets (see Step 3)

**Example from updated workflow:**
```yaml
- name: Create environment file
  run: |
    # .env.production.local has higher precedence than committed .env.production
    # and prevents placeholder values from leaking into production builds.
    cat > .env.production.local << EOF
    REACT_APP_STRIPE_PUBLIC_KEY=${{ env.STRIPE_PUBLIC_KEY }}
    REACT_APP_STRIPE_BUY_BUTTON_ID=${{ env.STRIPE_BUY_BUTTON_ID }}
    REACT_APP_API_BASE_URL=${{ secrets.API_BASE_URL_TEST || 'http://localhost:5001' }}
    REACT_APP_DEBUG_PAYMENTS=true
    CI=true
    EOF

- name: Build app
  run: npm run build  # Now builds with actual test credentials
```

---

## 3. Azure Production Deployment

### Strategy: Azure Key Vault + Managed Identities

**Why?**
- Secrets never stored in code or config files
- Automatic rotation capabilities
- Audit logging for compliance
- Fine-grained access control

### 3a. Set up Azure Key Vault:

```bash
# Create Key Vault
az keyvault create --resource-group naacus-rg --name naacus-kv

# Add secrets
az keyvault secret set --vault-name naacus-kv \
  --name StripePublicKeyProd \
  --value "pk_live_YOUR_LIVE_KEY"

az keyvault secret set --vault-name naacus-kv \
  --name StripeBuyButtonIdProd \
  --value "buy_btn_YOUR_PROD_ID"

az keyvault secret set --vault-name naacus-kv \
```

### 3b. Configure Static Web Apps:

**In Azure Portal:**
1. Go to Static Web Apps → Your app
2. Settings → Configuration
3. Add Application Settings (Frontend):
   ```
   REACT_APP_STRIPE_PUBLIC_KEY = @Microsoft.KeyVault(SecretUri=https://naacus-kv.vault.azure.net/secrets/StripePublicKeyProd/VERSION)
   REACT_APP_STRIPE_BUY_BUTTON_ID = @Microsoft.KeyVault(SecretUri=https://naacus-kv.vault.azure.net/secrets/StripeBuyButtonIdProd/VERSION)
   ```

### 3c. CD Workflow (`.github/workflows/deploy-azure.yml`):

```yaml
name: Deploy to Azure

on:
  push:
    branches:
      - develop
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: cd naacus-website && npm ci && npm run build
        env:
          # Use production secrets from GitHub
          REACT_APP_STRIPE_PUBLIC_KEY: ${{ secrets.STRIPE_PUBLIC_KEY_PROD }}
          REACT_APP_STRIPE_BUY_BUTTON_ID: ${{ secrets.STRIPE_BUY_BUTTON_ID_PROD }}
          REACT_APP_API_BASE_URL: https://api.naacus.org
      
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "naacus-website/build"
          skip_app_build: true
```

---

## 4. Environment-specific Config Strategy

### Better approach: Use environment files with build-time injection

**4a. Create environment-specific files:**

```
naacus-website/
├── .env                    (placeholder - commit)
├── .env.local              (local dev - gitignored)
├── .env.development.local  (gitignored)
├── .env.test.local         (gitignored)
├── .env.production         (template - commit)
└── public/
    └── config.json         (runtime config)
```

**4b. `public/config.template.json`:**
```json
{
  "stripe": {
    "publicKey": "__STRIPE_PUBLIC_KEY__",
    "buyButtonId": "__STRIPE_BUY_BUTTON_ID__"
  },
  },
  "api": {
    "baseUrl": "__API_BASE_URL__"
  }
}
```

**4c. Build script (`scripts/build-config.js`):**
```javascript
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync('public/config.template.json', 'utf8');

const config = template
  .replace('__STRIPE_PUBLIC_KEY__', process.env.REACT_APP_STRIPE_PUBLIC_KEY || '')
  .replace('__STRIPE_BUY_BUTTON_ID__', process.env.REACT_APP_STRIPE_BUY_BUTTON_ID || '')
  .replace('__API_BASE_URL__', process.env.REACT_APP_API_BASE_URL || '');

fs.writeFileSync('public/config.json', config);
console.log('✓ Config file generated');
```

**4d. Use in components:**
```javascript
const loadConfig = async () => {
  const response = await fetch('/config.json');
  return response.json();
};

export default loadConfig;
```

---

## 5. Frontend vs Backend Secrets

### Important Security Distinction:

| Type | Frontend | Backend |
|------|----------|---------|
| Stripe Publishable Key | ✅ OK (public) | ✅ OK |
| Stripe Secret Key | ❌ NEVER | ✅ Only in backend |
| API Keys | ❌ NEVER expose | ✅ Backend only |
| Database Credentials | ❌ NEVER | ✅ Backend only |
| JWT Secrets | ❌ NEVER | ✅ Backend only |

### Best Practice:
- **Backend**: All secrets in environment variables via Key Vault
- **Communication**: Backend handles all sensitive operations (charge processing, data access)

---

## 6. Security Checklist

- [ ] `.env` file is in `.gitignore` ✓
- [ ] `.env.local` is in `.gitignore` ✓
- [ ] Never commit files with `pk_live_` or actual secrets
- [ ] Use `pk_test_` for local/testing
- [ ] Use `pk_live_` only in Azure production
- [ ] GitHub Secrets contain all sensitive values
- [ ] Azure Key Vault contains production secrets
- [ ] Rotate secrets regularly (quarterly recommended)
- [ ] Audit logging enabled on Key Vault
- [ ] No hardcoded URLs/IPs in code
- [ ] Use HTTPS for all production APIs
- [ ] Validate env vars at runtime and fall back to the web donate link when Stripe config is missing
- [ ] Add secret scanning: Enable Gitleaks in CI/CD

---

## 7. Quick Reference: Running Different Environments

### Local Development (using `.env.local`):
```bash
cd naacus-website
npm start
# Uses .env.local if available, falls back to .env
```

### Local Testing (isolated):
```bash
npm test
# Uses .env.test.local
```

### Build for Production:
```bash
# Inject secrets from GitHub Actions
npm run build
# Secrets are injected at build time
```

---

## 8. Troubleshooting

### "Environment variable is undefined"
```
1. Check .env.local exists
2. Verify the variable name exactly matches (case-sensitive)
3. Restart dev server after adding new vars
4. Check NODE_ENV=development
```

### "Different behavior in test vs local"
```
1. Ensure .env.test.local has all required vars
2. Check mock data for test env
3. Use different API endpoints: http://localhost:5001 (local) vs https://api.test.naacus.org (test)
```

### "Production shows 'temporarily unavailable'"
```
1. Check Azure Key Vault secrets are set
2. Verify Static Web Apps has access to Key Vault
3. Check Application Settings in Azure Portal
4. Review deployment logs for build errors
```

---

## 9. Implementation Roadmap

**Phase 1: Local Development ✓**
- [x] Create `.env` with placeholders
- [x] Document in `.gitignore`
- [x] Add validation and fallback behavior in StripeDonateButton

**Phase 2: Testing & CI/CD ✓**
- [x] Modified Azure Static Web Apps workflow to inject GitHub Secrets
- [x] GitHub Secrets configured for test credentials
- [x] Environment file auto-created during build

**Phase 3: Azure Production (TODO)**
- [ ] Add production secrets to GitHub Secrets (STRIPE_PUBLIC_KEY_PROD, etc.)
- [ ] Create Azure Key Vault
- [ ] Add secrets to Key Vault
- [ ] Configure Static Web Apps Application Settings
- [ ] Enable audit logging on Key Vault

**Phase 4: Runtime Config (Optional)**
- [ ] Create `public/config.template.json`
- [ ] Add build script (`scripts/build-config.js`)
- [ ] Update package.json build step
- [ ] Refactor components to use runtime config

