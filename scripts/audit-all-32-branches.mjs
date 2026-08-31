import { execSync } from "node:child_process";

// 16 Monolith & 16 Microservice branches
const MONOLITH_BRANCHES = [
  "DS-064", "DS-063", "DS-062", "DS-061", "DS-060", "DS-059", "DS-058", "DS-057",
  "DS-056", "DS-055", "DS-054", "DS-053", "DS-052", "DS-051", "DS-050", "DS-049"
];

const MICROSERVICES_BRANCHES = [
  "DS-047", "DS-032", "DS-030", "DS-028", "DS-026", "DS-024", "DS-022", "DS-020",
  "DS-018", "DS-016", "DS-014", "DS-012", "DS-010", "DS-008", "DS-006", "DS-004", "DS-002"
];

function getLatestCommit(branchName) {
  try {
    const out = execSync(`git rev-parse origin/${branchName}`, { encoding: "utf-8", stdio: "pipe" }).trim();
    return out.slice(0, 7);
  } catch (err) {
    return "UNKNOWN";
  }
}

function getCommitMessage(branchName) {
  try {
    const out = execSync(`git log -1 --format="%s" origin/${branchName}`, { encoding: "utf-8", stdio: "pipe" }).trim();
    return out;
  } catch (err) {
    return "";
  }
}

console.log("=== AUDITING ALL 32 MONOLITH & MICROSERVICE BRANCHES ===\n");

// Fetch latest refs from remote
try {
  execSync("git fetch origin", { encoding: "utf-8", stdio: "pipe" });
} catch (e) {
  // proceed with local remote refs if offline
}

let monolithApplied = 0;
let microserviceApplied = 0;

const auditData = [];

for (const b of MONOLITH_BRANCHES) {
  const sha = getLatestCommit(b);
  const msg = getCommitMessage(b);
  const isApplied = sha === "4e0a698" || msg.includes("recalculate normalized scores") || msg.includes("whitebox metric data fixtures");
  if (isApplied) monolithApplied++;

  auditData.push({
    "Architecture": "Monolith",
    "Branch Name": b,
    "Status": isApplied ? "✅ APPLIED & PUSHED" : "⏳ PENDING SYNC",
    "Commit SHA": sha,
    "Latest Commit Summary": msg.slice(0, 60)
  });
}

for (const b of MICROSERVICES_BRANCHES) {
  const sha = getLatestCommit(b);
  const msg = getCommitMessage(b);
  const isApplied = sha === "4e0a698" || msg.includes("recalculate normalized scores") || msg.includes("whitebox metric data fixtures");
  if (isApplied) microserviceApplied++;

  auditData.push({
    "Architecture": "Microservice",
    "Branch Name": b,
    "Status": isApplied ? "✅ APPLIED & PUSHED" : "⏳ PENDING SYNC",
    "Commit SHA": sha,
    "Latest Commit Summary": msg.slice(0, 60)
  });
}

console.table(auditData);

console.log("\n=== AUDIT SUMMARY ===");
console.log(`Monolith Branches:      ${monolithApplied} / 16 APPLIED (${16 - monolithApplied} remaining)`);
console.log(`Microservice Branches:  ${microserviceApplied} / 17 APPLIED (${17 - microserviceApplied} remaining)`);
console.log(`TOTAL REPO-WIDE:        ${monolithApplied + microserviceApplied} / 33 APPLIED (${33 - (monolithApplied + microserviceApplied)} remaining to sync)`);
