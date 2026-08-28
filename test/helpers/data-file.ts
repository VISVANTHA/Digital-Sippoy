import fs from "node:fs/promises";
import path from "node:path";

/**
 * Shared by test/lib/db.test.ts and test/api/items.test.ts -- both had
 * copy-pasted read/write/rm logic for backing up and restoring
 * data/items.json around tests (jscpd caught it as a real, accidental
 * clone). Each file still wires its own before/after(Each) hooks, since
 * db.test.ts restores per-test and items.test.ts only restores once at
 * the end -- that difference is real and shouldn't be papered over.
 */
export const DATA_FILE = path.join(process.cwd(), "data", "items.json");

export async function captureDataFile(): Promise<string | null> {
  return fs.readFile(DATA_FILE, "utf-8").catch(() => null);
}

export async function restoreDataFile(original: string | null): Promise<void> {
  if (original !== null) {
    await fs.writeFile(DATA_FILE, original, "utf-8");
  } else {
    await fs.rm(DATA_FILE, { force: true });
  }
}
