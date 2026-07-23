#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LEADERSHIP_DATA_PATH = path.join(ROOT_DIR, 'public', 'content', 'leadership-data.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const LEADERSHIP_DIR = path.join(PUBLIC_DIR, 'images', 'leadership');

const TARGET_SECTIONS = ['executiveBoard', 'ministryCoordinations', 'spiritualAdvisers'];
const isCheckOnly = process.argv.includes('--check');
const NAME_PREFIXES = new Set([
  'mr',
  'mrs',
  'ms',
  'miss',
  'dr',
  'prof',
  'sr',
  'fr',
  'rev',
  'reverend',
  'deacon',
]);

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugifyName(name) {
  const tokens = String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s.-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const cleanedTokens = [...tokens];
  while (cleanedTokens.length > 0) {
    const head = cleanedTokens[0].replace(/\.+$/g, '').toLowerCase();
    if (!NAME_PREFIXES.has(head)) {
      break;
    }
    cleanedTokens.shift();
  }

  return slugify(cleanedTokens.join(' '));
}

function fileExists(filePath) {
  return fs.access(filePath).then(() => true).catch(() => false);
}

function toPublicFile(photoPath) {
  if (!photoPath) {
    return '';
  }

  const cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
  return path.join(PUBLIC_DIR, cleanPath);
}

function extFor(filePath) {
  const ext = path.extname(filePath || '').toLowerCase();
  if (ext) {
    return ext;
  }

  return '.jpg';
}

async function resolveSourceFile(photoPath) {
  if (!photoPath) {
    return '';
  }

  const basename = path.basename(photoPath);
  const candidates = [
    toPublicFile(photoPath),
    path.join(LEADERSHIP_DIR, basename),
    path.join(PUBLIC_DIR, 'images', 'uploads', basename),
    path.join(PUBLIC_DIR, 'content', 'naacus-website', 'public', 'images', 'leadership', basename),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return '';
}

async function ensureUniqueTarget(baseSlug, extension, sourcePath) {
  let counter = 1;
  let targetName = `${baseSlug}${extension}`;
  let targetPath = path.join(LEADERSHIP_DIR, targetName);

  while (await fileExists(targetPath)) {
    if (sourcePath && path.resolve(sourcePath) === path.resolve(targetPath)) {
      break;
    }

    counter += 1;
    targetName = `${baseSlug}-${counter}${extension}`;
    targetPath = path.join(LEADERSHIP_DIR, targetName);
  }

  return {
    targetName,
    targetPath,
    publicPath: `/images/leadership/${targetName}`,
  };
}

async function normalizeSectionMembers(sectionName, members, report, checkOnly) {
  if (!Array.isArray(members)) {
    return;
  }

  for (const member of members) {
    const currentPhoto = member.photo || '';
    if (!currentPhoto) {
      continue;
    }

    const sourceFile = await resolveSourceFile(currentPhoto);
    const namingSeed = slugifyName(member.name) || slugify(member.name) || slugify(member.title) || 'leader';
    const extension = extFor(sourceFile || currentPhoto);

    const { targetPath, publicPath } = await ensureUniqueTarget(namingSeed, extension, sourceFile);

    if (sourceFile && path.resolve(sourceFile) !== path.resolve(targetPath)) {
      report.moves.push({ from: sourceFile, to: targetPath, name: member.name, section: sectionName });
      if (!checkOnly) {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.rename(sourceFile, targetPath);
      }
    }

    if (member.photo !== publicPath) {
      report.pathUpdates.push({
        section: sectionName,
        name: member.name,
        from: member.photo,
        to: publicPath,
      });
      if (!checkOnly) {
        member.photo = publicPath;
      }
    }

    if (!sourceFile && !(await fileExists(targetPath))) {
      report.warnings.push({
        section: sectionName,
        name: member.name,
        message: `Missing source image for path "${currentPhoto}"`,
      });
    }
  }
}

async function main() {
  const raw = await fs.readFile(LEADERSHIP_DATA_PATH, 'utf8');
  const data = JSON.parse(raw);
  const report = {
    moves: [],
    pathUpdates: [],
    warnings: [],
  };

  for (const sectionName of TARGET_SECTIONS) {
    await normalizeSectionMembers(sectionName, data[sectionName], report, isCheckOnly);
  }

  if (!isCheckOnly && report.pathUpdates.length > 0) {
    await fs.writeFile(LEADERSHIP_DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }

  const summary = [
    `Leadership photo normalization complete (${isCheckOnly ? 'check mode' : 'fix mode'}).`,
    `Moved files: ${report.moves.length}`,
    `Updated JSON paths: ${report.pathUpdates.length}`,
    `Warnings: ${report.warnings.length}`,
  ];

  console.log(summary.join('\n'));

  if (report.pathUpdates.length > 0) {
    for (const update of report.pathUpdates) {
      console.log(`PATH ${update.section} :: ${update.name} :: ${update.from} -> ${update.to}`);
    }
  }

  if (report.moves.length > 0) {
    for (const move of report.moves) {
      console.log(`MOVE ${move.section} :: ${move.name} :: ${move.from} -> ${move.to}`);
    }
  }

  if (report.warnings.length > 0) {
    for (const warning of report.warnings) {
      console.warn(`WARN ${warning.section} :: ${warning.name} :: ${warning.message}`);
    }
  }

  if (isCheckOnly && (report.pathUpdates.length > 0 || report.moves.length > 0 || report.warnings.length > 0)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Failed to normalize leadership photos.');
  console.error(error);
  process.exit(1);
});
