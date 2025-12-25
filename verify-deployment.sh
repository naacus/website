#!/bin/bash

# Deployment Verification Script for NAACUS GA4 Updates
# Checks if the latest code is deployed and GA properties are being sent

echo "🔍 NAACUS Deployment Verification"
echo "=================================="
echo ""

# Check GitHub Actions status
echo "1️⃣ GitHub Actions Deployment Status:"
echo "   Visit: https://github.com/naacus/website/actions"
echo "   ✓ Look for 'Azure Static Web Apps CI/CD' workflow"
echo "   ✓ Ensure latest commit (0d35a33) shows green checkmark"
echo ""

# Production URL (update this with your actual URL)
PROD_URL="https://polite-pebble-0f00f890f.4.azurestaticapps.net"

echo "2️⃣ Checking Production URL:"
echo "   URL: $PROD_URL"
if curl -s -o /dev/null -w "%{http_code}" "$PROD_URL" | grep -q "200"; then
    echo "   ✓ Site is accessible (HTTP 200)"
else
    echo "   ⚠️ Site may not be accessible or URL needs updating"
fi
echo ""

echo "3️⃣ Verify GA4 Script in Production HTML:"
echo "   Checking for GA4 measurement ID..."
if curl -s "$PROD_URL" | grep -q "G-0PWQTGEVJ6"; then
    echo "   ✓ GA4 script found (G-0PWQTGEVJ6)"
else
    echo "   ⚠️ GA4 script not found - check index.html"
fi
echo ""

echo "4️⃣ Manual Verification Steps:"
echo ""
echo "   A. Test Locally:"
echo "      cd naacus-website && npm start"
echo "      → Open http://localhost:3000"
echo "      → Accept cookie consent (page reloads)"
echo "      → Open browser console (F12)"
echo "      → Look for: '✓ Google Analytics initialized with user properties'"
echo "      → Look for: '📊 GA User Properties set: {...}'"
echo ""
echo "   B. Test Production:"
echo "      → Open: $PROD_URL"
echo "      → Accept cookie consent"
echo "      → Open browser console (F12)"
echo "      → Run: localStorage.getItem('ga_session_count')"
echo "      → Should return '1' (or higher if you visited before)"
echo ""
echo "   C. Check GA4 DebugView:"
echo "      → GA4 → Admin → DebugView"
echo "      → Visit your site with cookie consent accepted"
echo "      → Click any page/CTA/form"
echo "      → Events should show with user_properties parameter"
echo ""
echo "   D. Register Custom Dimensions (REQUIRED):"
echo "      → GA4 → Admin → Custom definitions → Create custom dimension"
echo "      → Create 4 dimensions:"
echo "         1. preferred_language (user property)"
echo "         2. visitor_type (user property)"
echo "         3. engagement_level (user property)"
echo "         4. session_count (user property)"
echo ""

echo "5️⃣ Data Availability Timeline:"
echo "   ✓ Deployment: ~5-10 minutes after push"
echo "   ✓ Real-time data: Immediate (see in DebugView/Realtime)"
echo "   ✓ Standard reports: 24-48 hours processing delay"
echo "   ✓ Custom dimensions: Must register first, then 24-48 hours"
echo ""

echo "6️⃣ Quick Console Test (paste in browser console):"
cat << 'CONSOLE_TEST'
   
// Paste this in browser console on your site:
console.log('=== GA4 Verification ===');
console.log('gtag available:', typeof gtag !== 'undefined');
console.log('Language:', localStorage.getItem('i18nextLng'));
console.log('Has visited:', localStorage.getItem('ga_has_visited'));
console.log('Session count:', localStorage.getItem('ga_session_count'));
console.log('Cookie consent:', localStorage.getItem('cookieConsent'));

CONSOLE_TEST

echo ""
echo "✅ Next Steps:"
echo "   1. Visit https://github.com/naacus/website/actions to confirm deployment"
echo "   2. Test locally with npm start"
echo "   3. Test production at $PROD_URL"
echo "   4. Register custom dimensions in GA4 Admin"
echo "   5. Wait 24-48 hours for data to populate in reports"
echo ""
echo "📊 GA4 Dashboard: https://analytics.google.com/analytics/web/#/p<your-property-id>/reports/dashboard"
