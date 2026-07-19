const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CMS_CONFIG_PATH = path.join(ROOT_DIR, 'public', 'admin', 'config.yml');

const LOCALES = [
  { code: 'en', cmsFileName: 'website_shell_en' },
  { code: 'fr', cmsFileName: 'website_shell_fr' },
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function splitLines(text) {
  return text.replace(/\r\n/g, '\n').split('\n');
}

function findWebsiteShellBlock(lines, cmsFileName) {
  const startRegex = new RegExp(`^\\s{6}-\\s+name:\\s+${cmsFileName}\\s*$`);
  const fileStart = lines.findIndex((line) => startRegex.test(line));

  if (fileStart === -1) {
    throw new Error(`Could not find CMS file block: ${cmsFileName}`);
  }

  const nextFileRegex = /^\s{6}-\s+name:\s+/;
  let fileEnd = lines.length;

  for (let i = fileStart + 1; i < lines.length; i += 1) {
    if (nextFileRegex.test(lines[i])) {
      fileEnd = i;
      break;
    }
  }

  return lines.slice(fileStart, fileEnd);
}

function extractHeaderSchemaNames(fileLines) {
  const headerNames = new Set();
  const navNames = new Set();

  let headerIndent = -1;
  let navIndent = -1;

  fileLines.forEach((line) => {
    const nameMatch = line.match(/^\s*name:\s*([A-Za-z0-9_]+)\s*$/);

    if (!nameMatch) {
      return;
    }

    const indent = line.search(/\S/);
    const name = nameMatch[1];

    if (headerIndent !== -1 && indent <= headerIndent && name !== 'header') {
      headerIndent = -1;
      navIndent = -1;
    }

    if (name === 'header') {
      headerIndent = indent;
      navIndent = -1;
      return;
    }

    if (headerIndent === -1) {
      return;
    }

    if (navIndent !== -1 && indent <= navIndent && name !== 'nav') {
      navIndent = -1;
    }

    if (name === 'nav') {
      navIndent = indent;
      return;
    }

    if (navIndent !== -1 && indent > navIndent) {
      navNames.add(name);
      return;
    }

    if (indent > headerIndent) {
      headerNames.add(name);
    }
  });

  return { headerNames, navNames };
}

function getExpectedHeaderNames(localeCode) {
  const localePath = path.join(
    ROOT_DIR,
    'public',
    'locales',
    localeCode,
    'pages',
    'website-shell.json',
  );
  const localeJson = readJson(localePath);

  if (!localeJson.header || !localeJson.header.nav) {
    throw new Error(`Missing header/nav in ${localePath}`);
  }

  const expectedHeader = Object.keys(localeJson.header).filter((key) => key !== 'nav').sort();
  const expectedNav = Object.keys(localeJson.header.nav).sort();

  return { expectedHeader, expectedNav };
}

function main() {
  if (!fs.existsSync(CMS_CONFIG_PATH)) {
    console.error(`CMS config not found: ${CMS_CONFIG_PATH}`);
    process.exit(1);
  }

  const cmsLines = splitLines(readText(CMS_CONFIG_PATH));
  const issues = [];

  LOCALES.forEach(({ code, cmsFileName }) => {
    const fileBlock = findWebsiteShellBlock(cmsLines, cmsFileName);
    const { headerNames, navNames } = extractHeaderSchemaNames(fileBlock);
    const { expectedHeader, expectedNav } = getExpectedHeaderNames(code);

    expectedHeader.forEach((field) => {
      if (!headerNames.has(field)) {
        issues.push(`[${code}] Missing CMS header field: header.${field}`);
      }
    });

    expectedNav.forEach((field) => {
      if (!navNames.has(field)) {
        issues.push(`[${code}] Missing CMS nav field: header.nav.${field}`);
      }
    });
  });

  if (issues.length > 0) {
    console.error(`CMS locale coverage check failed with ${issues.length} issue(s):`);
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }

  console.log('CMS locale coverage check passed for website shell EN/FR header fields.');
}

main();
