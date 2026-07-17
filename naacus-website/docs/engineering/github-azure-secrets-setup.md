# GitHub Secrets & Azure Key Vault Setup

> **Category:** 🔧 Engineering | **Audience:** DevOps Team & Platform Admins
> **Last Updated:** July 17, 2026 | [← Docs Index](../readme.md)

---

Quick reference for setting up GitHub Secrets and Azure Key Vault for secure environment management across local, test, and production environments.

## Step 1: Add GitHub Secrets for Testing/CI

### Go to:
```
Settings → Secrets and variables → Actions → New repository secret
```

### Add these secrets:

| Secret Name | Value | Notes |
|---|---|---|
| `STRIPE_PUBLIC_KEY_TEST` | `pk_test_...` | From Stripe Dashboard (test mode) |
| `STRIPE_BUY_BUTTON_ID_TEST` | `buy_btn_...` | From Stripe Buy Button (test) |
| `PAYPAL_CLIENT_ID_TEST` | `A...` or `EB...` | From PayPal Developer (sandbox) |
| `STRIPE_PUBLIC_KEY_PROD` | `pk_live_...` | From Stripe Dashboard (live mode) |
| `STRIPE_BUY_BUTTON_ID_PROD` | `buy_btn_...` | From Stripe Buy Button (live) |
| `PAYPAL_CLIENT_ID_PROD` | `A...` or `EB...` | From PayPal Developer (live) |
| `API_BASE_URL_TEST` | `https://api-test.naacus.org` | Optional - test API endpoint |

### Verify they work:
```bash
# Run test locally with secrets
export STRIPE_PUBLIC_KEY_TEST=pk_test_...
export STRIPE_BUY_BUTTON_ID_TEST=buy_btn_...
npm test
```

---

## Step 2: Azure Key Vault Setup

### Create Key Vault:
```bash
az group create --name naacus-rg --location eastus

az keyvault create \
  --resource-group naacus-rg \
  --name naacus-kv-prod \
  --location eastus \
  --enable-soft-delete true \
  --enable-purge-protection true
```

### Add Production Secrets:
```bash
# Stripe
az keyvault secret set \
  --vault-name naacus-kv-prod \
  --name StripePublicKey \
  --value "pk_live_YOUR_ACTUAL_KEY"

az keyvault secret set \
  --vault-name naacus-kv-prod \
  --name StripeBuyButtonId \
  --value "buy_btn_YOUR_ACTUAL_ID"

# PayPal
az keyvault secret set \
  --vault-name naacus-kv-prod \
  --name PaypalClientId \
  --value "YOUR_LIVE_CLIENT_ID"

# List all secrets
az keyvault secret list --vault-name naacus-kv-prod
```

### View Secret Details:
```bash
# Get secret value
az keyvault secret show \
  --vault-name naacus-kv-prod \
  --name StripePublicKey

# Get secret URI (for App Configuration)
az keyvault secret show \
  --vault-name naacus-kv-prod \
  --name StripePublicKey \
  --query id
```

---

## Step 3: Azure Static Web Apps Configuration

### Option A: Direct Environment Variables (Simpler)

1. Go to **Azure Portal → Static Web Apps → Your App**
2. Click **Configuration** in left sidebar
3. Click **+ Add** under Application Settings
4. Add each environment variable:

**Name:** `REACT_APP_STRIPE_PUBLIC_KEY`  
**Value:** *(from GitHub Secrets or paste directly)*

**Name:** `REACT_APP_STRIPE_BUY_BUTTON_ID`  
**Value:** *(from GitHub Secrets)*

**Name:** `REACT_APP_API_BASE_URL`  
**Value:** `https://api.naacus.org`

### Option B: Key Vault References (More Secure)

1. **Grant Static Web App access to Key Vault:**
   ```bash
   # Get the Static Web App's system-assigned identity
   IDENTITY=$(az staticwebapp show \
     --name naacus-website \
     --resource-group naacus-rg \
     --query identity.principalId \
     -o tsv)

   # Grant it access to Key Vault
   az keyvault set-policy \
     --vault-name naacus-kv-prod \
     --object-id $IDENTITY \
     --secret-permissions get list
   ```

2. **Add Key Vault references to App Configuration:**
   ```bash
   # In Azure Portal, add settings with Key Vault references:
   # Name: REACT_APP_STRIPE_PUBLIC_KEY
   # Value: @Microsoft.KeyVault(SecretUri=https://naacus-kv-prod.vault.azure.net/secrets/StripePublicKey/)
   ```

---

## Step 4: Update CI/CD Workflows

### Your existing Azure workflow (`.github/workflows/azure-static-web-apps-polite-pebble-0f00f890f.yml`):

The workflow has been enhanced to automatically inject GitHub Secrets during build:

**For Development/Test builds (triggered by PR or push to develop):**
- Uses `STRIPE_PUBLIC_KEY_TEST` and `STRIPE_BUY_BUTTON_ID_TEST` from GitHub Secrets
- Sets `REACT_APP_PAYPAL_ENV=sandbox`
- Sets `REACT_APP_DEBUG_PAYMENTS=true`

**For Production deployment (automatic after PR merge to develop):**
- Uses secrets from Azure Key Vault (configured in Azure Portal)
- Bypasses GitHub Secrets for production (more secure)
- Production app receives credentials from Application Settings

**Example workflow section:**
```yaml
- name: Create environment file
  run: |
    cat > .env << EOF
    REACT_APP_STRIPE_PUBLIC_KEY=${{ secrets.STRIPE_PUBLIC_KEY_TEST }}
    REACT_APP_STRIPE_BUY_BUTTON_ID=${{ secrets.STRIPE_BUY_BUTTON_ID_TEST }}
    REACT_APP_PAYPAL_CLIENT_ID=${{ secrets.PAYPAL_CLIENT_ID_TEST }}
    REACT_APP_API_BASE_URL=${{ secrets.API_BASE_URL_TEST || 'http://localhost:5001' }}
    REACT_APP_DEBUG_PAYMENTS=true
    CI=true
    EOF

- name: Build app
  run: npm run build  # Builds with test credentials injected
```

---

## Step 5: Local Development Setup

### First time setup:
```bash
# Clone repo
git clone https://github.com/naacus/website.git
cd website/naacus-website

# Copy example env
cp .env.example .env.local

# Edit with your test credentials
nano .env.local
# Add: REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
# Add: REACT_APP_STRIPE_BUY_BUTTON_ID=buy_btn_YOUR_ID
# Save and exit
```

### Daily workflow:
```bash
# Start dev server
npm start
# Automatically uses .env.local

# Run tests
npm test

# Build locally
npm run build
```

---

## Step 6: Verify Secrets Are Working

### Check GitHub Actions:
1. Go to **Actions** tab
2. Click on **"Azure Static Web Apps CI/CD"** workflow
3. Check the latest run for your branch
4. Expand the "Create environment file" step in the Quality Gate job
5. Secrets should show as `***` (masked) in logs

### Verify in logs:
```
✓ Build completed with test credentials
✓ Tests passed with Stripe/PayPal test keys
```

### Check Azure deployment:
```bash
# Test static web app loads with secrets
curl https://your-site.azurestaticapps.net

# Check if Stripe button renders (no error message)
# Open browser DevTools → Console
```

### Local verification:
```bash
# Verify .env.local loads
cd naacus-website
npm start
# Check browser console - should NOT see "Stripe config missing" error
# Stripe button should render with your test credentials
```

---

## Troubleshooting

### "Stripe button not rendering"
```
1. Verify REACT_APP_STRIPE_PUBLIC_KEY is not placeholder
2. Verify REACT_APP_STRIPE_BUY_BUTTON_ID is set
3. Check browser console for errors
4. Ensure .env.local is in .gitignore
```

### "GitHub Action fails with secret not found"
```
1. Verify secret name matches exactly (case-sensitive)
2. Refresh GitHub page if just added
3. Check secret is in correct scope (Repository, not Organization)
4. Re-run workflow
```

### "Azure shows env vars but app doesn't see them"
```
1. Check variable names start with REACT_APP_
2. Rebuild and redeploy after adding settings
3. Check Application Settings were saved (hit Save button)
4. Wait 5 minutes for changes to propagate
5. Clear browser cache (Ctrl+Shift+Delete)
```

---

## Security Checklist

- [ ] All `.env` files added to `.gitignore`
- [ ] No real `pk_live_` keys in code
- [ ] GitHub Secrets are masked in logs
- [ ] Azure Key Vault has soft-delete enabled
- [ ] Static Web App has identity-based access to Key Vault
- [ ] Production secrets use `pk_live_` and `:live:` URLs
- [ ] Test/local use `pk_test_` and sandbox
- [ ] Rotation policy set (quarterly audit)
- [ ] Audit logging enabled on Key Vault
- [ ] All team members have personal `.env.local` (never shared)

