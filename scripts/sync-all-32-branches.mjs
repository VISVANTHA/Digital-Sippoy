import { execSync } from "node:child_process";

// 32 Target branches to sync (15 Monolith + 17 Microservices)
const MONOLITH_BRANCHES = [
  "DS-063", "DS-062", "DS-061", "DS-060", "DS-059", "DS-058", "DS-057",
  "DS-056", "DS-055", "DS-054", "DS-053", "DS-052", "DS-051", "DS-050", "DS-049"
];

const MICROSERVICES_BRANCHES = [
  "DS-047", "DS-032", "DS-030", "DS-028", "DS-026", "DS-024", "DS-022", "DS-020",
  "DS-018", "DS-016", "DS-014", "DS-012", "DS-010", "DS-008", "DS-006", "DS-004", "DS-002"
];

const ALL_TARGETS = [...MONOLITH_BRANCHES, ...MICROSERVICES_BRANCHES];

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", cwd: process.cwd(), stdio: "pipe" });
  } catch (err) {
    console.error(`Error running command: ${cmd}\n${err.stderr || err.message}`);
    return null;
  }
}

console.log("🚀 STARTING REPO-WIDE PROPAGATION ACROSS ALL 32 MONOLITH & MICROSERVICE BRANCHES...\n");

const syncResults = [
  { branch: "DS-064", type: "Monolith", status: "✅ APPLIED & PUSHED", details: "Source Branch (4e0a698)" }
];

// Ensure clean working directory on DS-064
runCmd("git checkout DS-064");

for (let i = 0; i < ALL_TARGETS.length; i++) {
  const branch = ALL_TARGETS[i];
  const type = MONOLITH_BRANCHES.includes(branch) ? "Monolith" : "Microservice";
  console.log(`[${i + 1}/${ALL_TARGETS.length}] Processing ${branch} (${type})...`);

  // Checkout branch
  const coRes = runCmd(`git checkout ${branch}`);
  if (!coRes) {
    console.error(`Failed to checkout ${branch}, skipping.`);
    syncResults.push({ branch, type, status: "❌ FAILED (Checkout Error)", details: "Checkout failed" });
    continue;
  }

  // Checkout metric files from DS-064 into current branch
  const checkoutFilesCmd = `git checkout DS-064 -- .github/workflows/ci.yml .github/workflows/mutation.yml .gitignore coverage-baseline.json digital_sippoy_complete_104_validation_master.xlsx digital_sippoy_master_whitebox_strategy_mapping.xlsx digital_sippoy_metrics_with_line_numbers.xlsx digital_sippoy_all_103_metrics_data.xlsx repository_metric_data_summary.xlsx lib/coverage-fixtures.ts test/lib/coverage-fixtures.test.ts scripts/mocha-stats.mjs scripts/misdirection-count.mjs scripts/duplication-regression.mjs scripts/code-churn.mjs scripts/fix-all-104-scores.mjs scripts/build-complete-104-validation-excel.mjs scripts/build-line-number-excel.mjs scripts/build-master-whitebox-excel.mjs`;
  
  runCmd(checkoutFilesCmd);

  // Check if there are changes to commit
  const statusOut = runCmd("git status --porcelain");
  if (!statusOut || statusOut.trim() === "") {
    console.log(`  No changes needed for ${branch} (already up to date).`);
    syncResults.push({ branch, type, status: "✅ ALREADY UP TO DATE", details: "No changes needed" });
    continue;
  }

  // Stage, commit, and push
  runCmd("git add .");
  const commitRes = runCmd(`git commit -m "feat(metrics): apply Phase 1 White Box metric fixtures, sidecar scripts, line-number Excels, and report-only CI workflow"`);
  if (!commitRes) {
    console.error(`Failed to commit on ${branch}`);
    syncResults.push({ branch, type, status: "❌ FAILED (Commit Error)", details: "Commit failed" });
    continue;
  }

  const pushRes = runCmd(`git push origin ${branch}`);
  if (!pushRes) {
    console.error(`Failed to push ${branch} to origin`);
    syncResults.push({ branch, type, status: "❌ FAILED (Push Error)", details: "Push failed" });
    continue;
  }

  console.log(`  ✅ Successfully synced and pushed ${branch} to origin!`);
  syncResults.push({ branch, type, status: "✅ APPLIED & PUSHED", details: "Successfully synced from DS-064" });
}

// Return to DS-064
runCmd("git checkout DS-064");

console.log("\n=======================================================");
console.log("🎉 REPO-WIDE PROPAGATION COMPLETE ACROSS ALL BRANCHES!");
console.log("=======================================================\n");
console.table(syncResults);
