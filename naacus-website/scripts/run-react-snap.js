const fs = require('fs');
const { spawnSync } = require('child_process');

const browserCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}/Google/Chrome/Application/chrome.exe`,
  process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}/Google/Chrome/Application/chrome.exe`,
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));

if (!browserPath) {
  console.error('A modern Chrome or Chromium installation is required to prerender the production build.');
  process.exit(1);
}

const reactSnapPath = require.resolve('react-snap/run.js');
const result = spawnSync(process.execPath, [reactSnapPath], {
  env: {
    ...process.env,
    PUPPETEER_EXECUTABLE_PATH: browserPath,
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);