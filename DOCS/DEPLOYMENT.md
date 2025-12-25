# Deployment Guide

## Azure Static Web Apps

Automatic deployment on push to `develop` branch.

### Check Status

1. Visit https://github.com/naacus/website
2. Go to **Actions** tab
3. Look for latest "Azure Static Web Apps CI/CD" workflow
4. Green ✅ = deployed, Red ❌ = failed

### Your Live Site

URL: https://polite-pebble-0f00f890f.4.azurestaticapps.net

### Manual Deploy

If auto-deploy fails:
1. Push to `develop` branch again
2. Or visit Azure Portal → Static Web Apps → Re-deploy

## Environment Variables

Add to `.env` or set in Azure:
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_GA_MEASUREMENT_ID=G-0PWQTGEVJ6
```

## Build Output

Static files built to `naacus-website/build/`
- Served from Azure CDN
- Cached globally

## Troubleshooting

**Deployment stuck?**
- Check GitHub Actions for errors
- Ensure `naacus-website/package.json` exists

**Site not updating after push?**
- Wait 5-10 minutes for deployment
- Clear browser cache (Ctrl+Shift+Del)

**Build fails?**
- Run locally: `npm start` to test
- Check for console errors in build logs
