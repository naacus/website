#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, 'reports');
const inputPath = path.join(reportsDir, 'ai-first-metrics.json');
const outputPath = path.join(reportsDir, 'ai-first-threshold-check.json');

const thresholds = {
  missionIndex: 70,
  minCategoryScore: 55,
  minAudienceFit: 0.7,
  minUnderstanding: 0.6,
  minNextStepInfo: 0.35,
  minNextStepAction: 0.45,
  maxLocaleDelta: 10,
};

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function check(name, pass, detail, checks) {
  checks.push({ name, pass, detail });
}

if (!fs.existsSync(inputPath)) {
  fail(`Missing metrics input: ${path.relative(projectRoot, inputPath)}. Generate this report from analytics export before running threshold checks.`);
}

const metrics = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const checks = [];

const missionIndex = Number(metrics.missionIndex ?? 0);
check(
  'Mission index threshold',
  missionIndex >= thresholds.missionIndex,
  `missionIndex=${missionIndex}, required>=${thresholds.missionIndex}`,
  checks
);

const categoryScores = metrics.categoryScores || {};
const categoryNames = ['trust', 'understand', 'connect', 'act'];
for (const category of categoryNames) {
  const score = Number(categoryScores[category] ?? 0);
  check(
    `${category} category minimum`,
    score >= thresholds.minCategoryScore,
    `${category}=${score}, required>=${thresholds.minCategoryScore}`,
    checks
  );
}

const pageMetrics = Array.isArray(metrics.pageMetrics) ? metrics.pageMetrics : [];
for (const pm of pageMetrics) {
  const page = pm.page || 'unknown-page';
  const audienceFit = Number(pm.audienceFit ?? 0);
  const understanding = Number(pm.understanding ?? 0);
  const nextStep = Number(pm.nextStep ?? 0);
  const actionPage = Boolean(pm.actionPage);
  const nextStepThreshold = actionPage ? thresholds.minNextStepAction : thresholds.minNextStepInfo;

  check(
    `${page} audience fit`,
    audienceFit >= thresholds.minAudienceFit,
    `audienceFit=${audienceFit}, required>=${thresholds.minAudienceFit}`,
    checks
  );

  check(
    `${page} understanding`,
    understanding >= thresholds.minUnderstanding,
    `understanding=${understanding}, required>=${thresholds.minUnderstanding}`,
    checks
  );

  check(
    `${page} next step`,
    nextStep >= nextStepThreshold,
    `nextStep=${nextStep}, required>=${nextStepThreshold}`,
    checks
  );
}

const localeParity = metrics.localeParity || {};
const localeDelta = Number(localeParity.maxDelta ?? 0);
check(
  'Locale parity guardrail',
  localeDelta <= thresholds.maxLocaleDelta,
  `maxDelta=${localeDelta}, allowed<=${thresholds.maxLocaleDelta}`,
  checks
);

const failed = checks.filter((c) => !c.pass);
const summary = {
  generatedAt: new Date().toISOString(),
  input: path.relative(projectRoot, inputPath),
  thresholds,
  passed: checks.length - failed.length,
  failed: failed.length,
  checks,
};

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

console.log(`AI-first threshold check: ${failed.length === 0 ? 'PASS' : 'FAIL'} (${summary.passed}/${checks.length})`);
console.log(`Report: ${path.relative(projectRoot, outputPath)}`);

if (failed.length > 0) {
  process.exitCode = 1;
}
