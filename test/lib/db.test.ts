import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { getItems, addItem } from "../../lib/db";
import { DATA_FILE, captureDataFile, restoreDataFile } from "../helpers/data-file";

async function seedDataFile(
  items: { id: string; name: string; createdAt: string }[]
): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items), "utf-8");
}

async function assertItemsOrder(expectedIds: string[]): Promise<void> {
  const items = await getItems();
  assert.deepEqual(
    items.map((i) => i.id),
    expectedIds
  );
}

describe("lib/db.ts", () => {
  let originalData: string | null;

  before(async () => {
    originalData = await captureDataFile();
  });

  afterEach(async () => {
    await restoreDataFile(originalData);
  });

  it("reads existing items as an array", async () => {
    const items = await getItems();
    assert.ok(Array.isArray(items));
  });

  it("adds a new item and persists it", async () => {
    const item = await addItem("Test Item");
    assert.ok(item.id);
    assert.equal(item.name, "Test Item");

    const items = await getItems();
    assert.ok(items.some((i) => i.id === item.id));
  });

  it("trims surrounding whitespace off the stored name", async () => {
    const item = await addItem("  Chair  ");
    assert.equal(item.name, "Chair");
  });

  it("rejects an empty name with the expected message", async () => {
    await assert.rejects(() => addItem(""), /non-empty string/);
  });

  it("rejects a whitespace-only name with the expected message", async () => {
    await assert.rejects(() => addItem("   "), /non-empty string/);
  });

  it("sorts items newest-first by createdAt, not insertion order", async () => {
    await seedDataFile([
      { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
      { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
    ]);
    await assertItemsOrder(["b", "a"]);
  });

  it("leaves an already-sorted file unchanged (comparator isn't a blind reversal)", async () => {
    await seedDataFile([
      { id: "b", name: "Newer", createdAt: "2024-06-01T00:00:00.000Z" },
      { id: "a", name: "Older", createdAt: "2024-01-01T00:00:00.000Z" },
    ]);
    await assertItemsOrder(["b", "a"]);
  });

  it("returns an empty array when the data file is missing (ENOENT)", async () => {
    await fs.rm(DATA_FILE, { force: true });
    const items = await getItems();
    assert.deepEqual(items, []);
  });

  it("re-throws non-ENOENT read errors instead of swallowing them", async () => {
    // Replace the data file with a directory of the same name: reading it
    // fails with EISDIR, not ENOENT, so getItems() must propagate the error
    // rather than treating it like a missing file.
    await fs.rm(DATA_FILE, { force: true, recursive: true });
    await fs.mkdir(DATA_FILE, { recursive: true });
    try {
      await assert.rejects(() => getItems());
    } finally {
      await fs.rm(DATA_FILE, { force: true, recursive: true });
    }
  });
});
