#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, 'reports');
const reportJsonPath = path.join(reportsDir, 'ai-first-eval.json');
const reportMdPath = path.join(reportsDir, 'ai-first-eval.md');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function unique(items) {
  return [...new Set(items)];
}

function extractRoutes(appSource) {
  const routeMatches = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const normalized = routeMatches
    .filter((route) => route !== '*')
    .map((route) => (route === '/ministries/:id' ? '/fellowship-ministries' : route));
  return unique(normalized);
}

function extractIntentRouteKeys(intentSource) {
  const matches = [...intentSource.matchAll(/^\s*'([^']+)':\s*\{/gm)].map((m) => m[1]);
  return unique(matches);
}

function hasLocaleIntentMetadata(intentSource, route, locale) {
  const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const routePattern = new RegExp(
    `'${escapedRoute}':\\s*\\{[\\s\\S]*?${locale}:\\s*\\{[\\s\\S]*?nextStepLabel:\\s*'[^']+'[\\s\\S]*?nextStepPath:\\s*'([^']+)'`,
    'm'
  );
  const match = routePattern.exec(intentSource);
  return match ? match[1] : null;
}

function extractNextStepPaths(intentSource) {
  return unique([...intentSource.matchAll(/nextStepPath:\s*'([^']+)'/g)].map((m) => m[1]));
}

function extractHeaderNavigationTargets(headerSource) {
  return unique([...headerSource.matchAll(/handleNavigationHelper\('([^']+)'/g)].map((m) => m[1]));
}

function run() {
  const appSource = read('src/App.js');
  const headerSource = read('src/components/Header.js');
  const chatWidgetSource = read('src/components/ChatWidget.js');
  const chatbotServiceSource = read('src/services/chatbotService.js');
  const pageIntentSource = read('src/content/pageIntentConfig.js');

  const checks = [];

  const panelFileExists = exists('src/components/PageIntentPanel.js');
  const panelReferenced = /PageIntentPanel/.test(appSource);
  checks.push({
    id: 'implicit-guidance-ui',
    name: 'No visible intent framework UI rendered',
    pass: !panelFileExists && !panelReferenced,
    detail: panelFileExists || panelReferenced
      ? 'Visible intent panel exists or is referenced in App shell.'
      : 'Intent framework is not rendered as visible page UI.'
  });

  const appShellChecks = [
    /<Header\s*\/>/.test(appSource),
    /<main id="main-content">/.test(appSource),
    /<Routes>/.test(appSource),
    /<Footer\s*\/>/.test(appSource),
    /<CookieConsent\s*\/>/.test(appSource),
    /<ErrorBoundary>/.test(appSource),
  ];

  checks.push({
    id: 'website-shell-structure',
    name: 'Core site shell supports whole-website journey and trust signals',
    pass: appShellChecks.every(Boolean),
    detail: appShellChecks.every(Boolean)
      ? 'Header/main routes/footer/error boundary/cookie consent are all present.'
      : 'Missing one or more core shell elements required for mission flow.'
  });

  const analyticsChecks = [
    /trackPageView\(document\.title \|\| location\.pathname\)/.test(appSource),
    /trackScrollDepth\(\)/.test(appSource),
    /const cookieConsent = localStorage\.getItem\('cookieConsent'\)/.test(appSource),
    /if \(cookieConsent === 'accepted'\)/.test(appSource),
    /initializeGoogleAnalytics\(\)/.test(appSource),
  ];

  checks.push({
    id: 'analytics-trust-instrumentation',
    name: 'Whole-site analytics and consent-aware trust instrumentation are wired',
    pass: analyticsChecks.every(Boolean),
    detail: analyticsChecks.every(Boolean)
      ? 'Page view, scroll depth, and consent-gated analytics initialization are present.'
      : 'Analytics or consent instrumentation is incomplete.'
  });

  const chatWiringChecks = [
    /import\s+\{\s*getPageIntent\s*\}\s+from\s+'\.\.\/content\/pageIntentConfig'/.test(chatWidgetSource),
    /const\s+pageIntent\s*=\s*getPageIntent\(location\.pathname,\s*currentLanguage\)/.test(chatWidgetSource),
    /processMessage\('hi',\s*messageContext\)/.test(chatWidgetSource),
    /processMessage\(userMessage,\s*messageContext\)/.test(chatWidgetSource),
    /if\s*\(quickAction\.path\)/.test(chatWidgetSource)
  ];

  checks.push({
    id: 'chat-contextual-guidance',
    name: 'Assistant layer receives route/language context and supports next-step navigation',
    pass: chatWiringChecks.every(Boolean),
    detail: chatWiringChecks.every(Boolean)
      ? 'Chat is context-aware and supports next-step quick-action navigation.'
      : 'Chat context wiring is incomplete.'
  });

  const serviceChecks = [
    /function\s+buildContextualQuickActions\(context\s*=\s*\{\}\)/.test(chatbotServiceSource),
    /function\s+buildGreetingMessage\(context\s*=\s*\{\}\)/.test(chatbotServiceSource),
    /function\s+buildNoMatchMessage\(context\s*=\s*\{\}\)/.test(chatbotServiceSource),
    /text:\s*buildGreetingMessage\(context\)/.test(chatbotServiceSource),
    /text:\s*buildNoMatchMessage\(context\)/.test(chatbotServiceSource),
    /quickActions:\s*contextualQuickActions/.test(chatbotServiceSource)
  ];

  checks.push({
    id: 'service-intent-behavior',
    name: 'Assistant service uses intent-aware behavior in greeting and fallback flows',
    pass: serviceChecks.every(Boolean),
    detail: serviceChecks.every(Boolean)
      ? 'Greeting/no-match/quick-actions are driven by contextual intent logic.'
      : 'Intent-aware service behavior is incomplete.'
  });

  const appRoutes = extractRoutes(appSource);
  const intentRouteKeys = extractIntentRouteKeys(pageIntentSource).filter((route) => route !== '/not-found');
  const missingIntentRoutes = appRoutes.filter((route) => !intentRouteKeys.includes(route));

  checks.push({
    id: 'route-coverage',
    name: 'Page intent covers all navigable routes',
    pass: missingIntentRoutes.length === 0,
    detail: missingIntentRoutes.length === 0
      ? `Coverage OK for ${appRoutes.length} route groups.`
      : `Missing intent coverage for routes: ${missingIntentRoutes.join(', ')}`
  });

  const requiredTrustRoutes = ['/about', '/leadership', '/faq', '/privacy', '/contact'];
  const missingTrustRoutes = requiredTrustRoutes.filter((route) => !appRoutes.includes(route));

  checks.push({
    id: 'trust-route-presence',
    name: 'Whole-site trust pages are present in route map',
    pass: missingTrustRoutes.length === 0,
    detail: missingTrustRoutes.length === 0
      ? 'About, leadership, FAQ, privacy, and contact pages are routed.'
      : `Missing trust routes: ${missingTrustRoutes.join(', ')}`
  });

  const headerNavTargets = extractHeaderNavigationTargets(headerSource);
  const keyJourneyTargets = ['/about', '/events', '/membership', '/volunteer', '/resources', '/contact', '/feedback'];
  const missingJourneyTargets = keyJourneyTargets.filter((route) => !headerNavTargets.includes(route));

  checks.push({
    id: 'navigation-journey-coverage',
    name: 'Primary website navigation exposes understand/connect/act journeys',
    pass: missingJourneyTargets.length === 0,
    detail: missingJourneyTargets.length === 0
      ? 'Header navigation exposes the key mission journey routes.'
      : `Missing journey targets in header navigation: ${missingJourneyTargets.join(', ')}`
  });

  const validNextPaths = new Set([...appRoutes, '/']);
  const invalidNextPaths = [];
  const missingLocaleMetadata = [];

  for (const route of appRoutes) {
    for (const locale of ['en', 'fr']) {
      const nextPath = hasLocaleIntentMetadata(pageIntentSource, route, locale);
      if (!nextPath) {
        missingLocaleMetadata.push(`${route}:${locale}`);
        continue;
      }
      if (!validNextPaths.has(nextPath)) {
        invalidNextPaths.push(`${route}:${locale}->${nextPath}`);
      }
    }
  }

  checks.push({
    id: 'next-step-integrity',
    name: 'Every route/locale has valid next-step label and path',
    pass: missingLocaleMetadata.length === 0 && invalidNextPaths.length === 0,
    detail:
      missingLocaleMetadata.length === 0 && invalidNextPaths.length === 0
        ? 'All EN/FR intent blocks include nextStepLabel and valid nextStepPath.'
        : [
            missingLocaleMetadata.length ? `Missing metadata: ${missingLocaleMetadata.join(', ')}` : '',
            invalidNextPaths.length ? `Invalid next paths: ${invalidNextPaths.join(', ')}` : ''
          ]
            .filter(Boolean)
            .join(' | ')
  });

  const allNextStepPaths = extractNextStepPaths(pageIntentSource);
  const coreActionTargets = ['/membership', '/contact', '/donation', '/events', '/volunteer'];
  const coveredCoreTargets = coreActionTargets.filter((route) => allNextStepPaths.includes(route));

  checks.push({
    id: 'next-step-action-distribution',
    name: 'Website intent model points users toward core action pathways',
    pass: coveredCoreTargets.length >= 4,
    detail: coveredCoreTargets.length >= 4
      ? `Core action next-step coverage is strong (${coveredCoreTargets.join(', ')}).`
      : `Insufficient core action coverage in next steps (covered: ${coveredCoreTargets.join(', ') || 'none'}).`
  });

  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.length - passed;
  const summary = {
    generatedAt: new Date().toISOString(),
    objective: 'Validate whole-website AI-first mission implementation as implicit guidance across structure, routes, trust, navigation, and assistant behavior',
    passed,
    failed,
    checks
  };

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(reportJsonPath, JSON.stringify(summary, null, 2));

  const mdLines = [
    '# AI-First Eval Report',
    '',
    `- Generated: ${summary.generatedAt}`,
    `- Objective: ${summary.objective}`,
    `- Result: ${failed === 0 ? 'PASS' : 'FAIL'} (${passed}/${checks.length} checks passed)`,
    '',
    '## Check Results',
    ...checks.map((check) => `- [${check.pass ? 'x' : ' '}] ${check.name} - ${check.detail}`),
    ''
  ];

  fs.writeFileSync(reportMdPath, mdLines.join('\n'));

  console.log(`AI-first eval summary: ${failed === 0 ? 'PASS' : 'FAIL'} (${passed}/${checks.length})`);
  console.log(`Report written to ${path.relative(projectRoot, reportMdPath)}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

run();
