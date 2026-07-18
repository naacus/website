const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALE_DIR = path.join(ROOT_DIR, 'public', 'locales');
const EN_PATH = path.join(LOCALE_DIR, 'en', 'translation.json');
const FR_PATH = path.join(LOCALE_DIR, 'fr', 'translation.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function extractPlaceholders(value) {
  if (typeof value !== 'string') {
    return [];
  }

  const matches = value.match(/\{\{\s*([^{}\s]+)\s*\}\}/g) || [];
  return [...new Set(matches.map((token) => token.replace(/[{}\s]/g, '')))].sort();
}

function compareNodes(enNode, frNode, currentPath, issues) {
  const enIsObj = isPlainObject(enNode);
  const frIsObj = isPlainObject(frNode);

  if (enIsObj !== frIsObj) {
    issues.push(`[type] ${currentPath}: EN is ${typeof enNode}, FR is ${typeof frNode}`);
    return;
  }

  if (!enIsObj && !frIsObj) {
    if (Array.isArray(enNode) !== Array.isArray(frNode)) {
      issues.push(`[type] ${currentPath}: EN/FR array mismatch`);
      return;
    }

    if (typeof enNode === 'string' && typeof frNode === 'string') {
      const enPlaceholders = extractPlaceholders(enNode);
      const frPlaceholders = extractPlaceholders(frNode);

      if (enPlaceholders.join('|') !== frPlaceholders.join('|')) {
        issues.push(
          `[placeholder] ${currentPath}: EN(${enPlaceholders.join(', ') || 'none'}) vs FR(${frPlaceholders.join(', ') || 'none'})`,
        );
      }
    }

    return;
  }

  const enKeys = Object.keys(enNode).sort();
  const frKeys = Object.keys(frNode).sort();

  const enOnly = enKeys.filter((key) => !frKeys.includes(key));
  const frOnly = frKeys.filter((key) => !enKeys.includes(key));

  enOnly.forEach((key) => issues.push(`[missing-fr] ${currentPath}.${key}`));
  frOnly.forEach((key) => issues.push(`[missing-en] ${currentPath}.${key}`));

  const commonKeys = enKeys.filter((key) => frKeys.includes(key));
  commonKeys.forEach((key) => {
    compareNodes(enNode[key], frNode[key], `${currentPath}.${key}`, issues);
  });
}

function main() {
  if (!fs.existsSync(EN_PATH) || !fs.existsSync(FR_PATH)) {
    console.error('Missing translation files. Expected EN and FR translation.json files.');
    process.exit(1);
  }

  const en = readJson(EN_PATH);
  const fr = readJson(FR_PATH);
  const issues = [];

  compareNodes(en, fr, 'translation', issues);

  if (issues.length > 0) {
    console.error(`Locale parity check failed with ${issues.length} issue(s):`);
    issues.slice(0, 200).forEach((issue) => console.error(`- ${issue}`));
    if (issues.length > 200) {
      console.error(`...and ${issues.length - 200} more issue(s).`);
    }
    process.exit(1);
  }

  console.log('Locale parity check passed: EN and FR translation keys/types/placeholders are aligned.');
}

main();
