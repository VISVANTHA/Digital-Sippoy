import { execSync } from "node:child_process";

// The 32 target active branches across Microservices & Monolith
const TARGET_BRANCHES = [
  // 16 Monolith Branches
  "DS-064", "DS-063", "DS-062", "DS-061", "DS-060", "DS-059", "DS-058", "DS-057",
  "DS-056", "DS-055", "DS-054", "DS-053", "DS-052", "DS-051", "DS-050", "DS-049",
  // 16 Microservices Branches
  "DS-047", "DS-032", "DS-030", "DS-028", "DS-026", "DS-024", "DS-022", "DS-020",
  "DS-018", "DS-016", "DS-014", "DS-012", "DS-010", "DS-008", "DS-006", "DS-004", "DS-002"
];

// Files to sync repo-wide from DS-064
const METRIC_FILES_TO_SYNC = [
  ".github/workflows/ci.yml",
  ".github/workflows/mutation.yml",
  "coverage-baseline.json",
  "digital_sippoy_complete_104_validation_master.xlsx",
  "digital_sippoy_master_whitebox_strategy_mapping.xlsx",
  "digital_sippoy_metrics_with_line_numbers.xlsx",
  "digital_sippoy_all_103_metrics_data.xlsx",
  "repository_metric_data_summary.xlsx",
  "lib/coverage-fixtures.ts",
  "test/lib/coverage-fixtures.test.ts",
  "scripts/mocha-stats.mjs",
  "scripts/misdirection-count.mjs",
  "scripts/duplication-regression.mjs",
  "scripts/code-churn.mjs",
  "scripts/fix-all-104-scores.mjs",
  "scripts/build-complete-104-validation-excel.mjs",
  "scripts/build-line-number-excel.mjs",
  "scripts/build-master-whitebox-excel.mjs"
];

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", cwd: process.cwd(), stdio: "pipe" });
  } catch (err) {
    console.error(`Command failed: ${cmd}\n${err.stderr || err.message}`);
    return null;
  }
}

console.log("=== REPO-WIDE METRIC PROPAGATION STATUS ===");
console.log(`Current branch: DS-064 (APPLIED & PUSHED)`);
console.log(`Target branches to propagate: ${TARGET_BRANCHES.length}\n`);

const statusReport = [];

for (const b of TARGET_BRANCHES) {
  if (b === "DS-064") {
    statusReport.push({ branch: b, status: "APPLIED & PUSHED", commit: "4e0a698" });
    continue;
  }
  statusReport.push({ branch: b, status: "PENDING PROPAGATION", commit: "Needs sync from DS-064" });
}

console.table(statusReport);
