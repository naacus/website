const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES = ['en', 'fr'];
const bootstrapMode = process.argv.includes('--bootstrap');
const PAGE_GROUPS = [
  {
    fileName: 'website-shell.json',
    sections: ['cookies', 'header', 'footer', 'backToTop', 'search', 'chat', 'notFound'],
  },
  {
    fileName: 'home-page.json',
    sections: ['hero', 'heroButtons', 'conference2027', 'memberBenefits', 'testimonials', 'newsletter', 'contact'],
  },
  {
    fileName: 'about-leadership.json',
    sections: ['about', 'whatWeDo', 'whoWeServe', 'objectives', 'leadership'],
  },
  {
    fileName: 'ministries-programs.json',
    sections: ['ministries', 'programs'],
  },
  {
    fileName: 'events-prayer-library.json',
    sections: ['events', 'naacus2025', 'prayerLibrary'],
  },
  {
    fileName: 'membership-volunteer-giving.json',
    sections: ['membership', 'volunteer', 'donation'],
  },
  {
    fileName: 'resources-newsletters-support.json',
    sections: ['resourcesPage', 'newsletters', 'faq', 'feedback'],
  },
];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse JSON at ${filePath}: ${message}`);
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDirIfExists(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function bootstrapLocale(localeDir) {
  const translationPath = path.join(localeDir, 'translation.json');
  const pagesDir = path.join(localeDir, 'pages');
  const translation = readJson(translationPath);

  ensureDir(pagesDir);

  PAGE_GROUPS.forEach(({ fileName, sections }) => {
    const pagePath = path.join(pagesDir, fileName);
    if (!fs.existsSync(pagePath)) {
      const pageData = {};
      sections.forEach((sectionName) => {
        if (Object.prototype.hasOwnProperty.call(translation, sectionName)) {
          pageData[sectionName] = translation[sectionName];
        }
      });
      writeJson(pagePath, pageData);
    }
  });
}

function syncLocale(localeDir) {
  const translationPath = path.join(localeDir, 'translation.json');
  const pagesDir = path.join(localeDir, 'pages');

  if (!fs.existsSync(pagesDir)) {
    throw new Error(`Missing pages directory: ${pagesDir}`);
  }

  const pageFiles = fs
    .readdirSync(pagesDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();

  if (pageFiles.length === 0) {
    throw new Error(`No page files found in ${pagesDir}`);
  }

  const merged = {};

  pageFiles.forEach((fileName) => {
    const pagePath = path.join(pagesDir, fileName);
    const pageData = readJson(pagePath);

    Object.entries(pageData).forEach(([sectionName, sectionValue]) => {
      if (Object.prototype.hasOwnProperty.call(merged, sectionName)) {
        throw new Error(`Duplicate section ${sectionName} found while reading ${pagePath}`);
      }
      merged[sectionName] = sectionValue;
    });
  });

  writeJson(translationPath, merged);
}

LOCALES.forEach((locale) => {
  const localeDir = path.join(ROOT_DIR, 'public', 'locales', locale);
  if (bootstrapMode) {
    bootstrapLocale(localeDir);
    removeDirIfExists(path.join(localeDir, 'sections'));
  }
  syncLocale(localeDir);
});
