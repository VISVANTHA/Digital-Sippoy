#!/usr/bin/env node
// Code Churn / Risk-Based Testing Prioritization: aggregates git
// add+delete line counts per tracked source file across this branch's
// commit history, as a proxy for defect/regression risk (files that
// change often and heavily are more likely to need focused testing).
// Reads real `git log --numstat` output -- no synthetic data.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const TRACKED_DIRS = ["app/", "pages/", "components/", "lib/", "test/", "items-service/src/"];
const REPORT_PATH = path.join(process.cwd(), "churn-report.json");

function isTracked(filePath) {
  return TRACKED_DIRS.some((dir) => filePath.startsWith(dir));
}

function main() {
  const log = execFileSync("git", ["log", "--numstat", "--pretty=format:--commit--"], {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 32,
  });

  const churn = new Map();
  let commitCount = 0;

  for (const line of log.split("\n")) {
    if (line === "--commit--") {
      commitCount += 1;
      continue;
    }
    if (!line.trim()) continue;

    const [addedRaw, deletedRaw, filePath] = line.split("\t");
    if (!filePath || !isTracked(filePath)) continue;

    const added = addedRaw === "-" ? 0 : Number(addedRaw);
    const deleted = deletedRaw === "-" ? 0 : Number(deletedRaw);

    const entry = churn.get(filePath) ?? { file: filePath, commits: 0, added: 0, deleted: 0 };
    entry.commits += 1;
    entry.added += added;
    entry.deleted += deleted;
    churn.set(filePath, entry);
  }

  const rows = [...churn.values()]
    .map((r) => ({ ...r, churn: r.added + r.deleted }))
    .sort((a, b) => b.churn - a.churn);

  writeFileSync(
    REPORT_PATH,
    JSON.stringify({ commitsScanned: commitCount, files: rows }, null, 2) + "\n",
  );

  console.log(`Code churn (${commitCount} commits scanned) -- top files by churn:`);
  console.table(rows.slice(0, 15));
  console.log(`Full report written to ${REPORT_PATH}`);
}

main();
