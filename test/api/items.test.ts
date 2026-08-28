import assert from "node:assert/strict";
import handler from "../../pages/api/items";
import { ITEM_NAME_MAX_LENGTH } from "../../lib/validate";
import { authenticatedRequest, anonymousRequest } from "../helpers/session";
import { useFakeItemsService, type FakeItem } from "../helpers/fake-items-service";

const SEED: FakeItem[] = [
  { id: "1", name: "Existing item", createdAt: "2024-01-01T00:00:00.000Z" },
];

async function authedPost(body: unknown) {
  const { req, res } = await authenticatedRequest({ method: "POST", body });
  await handler(req, res);
  return res;
}

async function assertPostRejects(body: unknown, expectedError: RegExp): Promise<void> {
  const res = await authedPost(body);
  assert.equal(res._getStatusCode(), 400);
  assert.match(res._getJSONData().error, expectedError);
}

describe("pages/api/items.ts (Pages Router)", () => {
  const service = useFakeItemsService(SEED);

  it("GET without a session returns 401 with an explanatory message", async () => {
    const { req, res } = anonymousRequest({ method: "GET" });
    await handler(req, res);
    assert.equal(res._getStatusCode(), 401);
    assert.equal(res._getJSONData().error, "Authentication required");
  });

  it("POST without a session returns 401 and never reaches items-service", async () => {
    const { req, res } = anonymousRequest({
      method: "POST",
      body: { name: "Should not be created" },
    });
    await handler(req, res);
    assert.equal(res._getStatusCode(), 401);
    assert.equal(res._getJSONData().error, "Authentication required");

    const { req: getReq, res: getRes } = await authenticatedRequest({ method: "GET" });
    await handler(getReq, getRes);
    assert.equal(getRes._getJSONData().items.length, SEED.length);
  });

  it("GET with a valid session returns 200 and items-service's items", async () => {
    const { req, res } = await authenticatedRequest({ method: "GET" });
    await handler(req, res);
    assert.equal(res._getStatusCode(), 200);
    assert.deepEqual(res._getJSONData().items, SEED);
  });

  it("POST with a valid session and body returns 201 and the created item", async () => {
    const res = await authedPost({ name: "Chair" });
    assert.equal(res._getStatusCode(), 201);
    assert.equal(res._getJSONData().item.name, "Chair");
  });

  it("POST with an empty name returns 400 with the validation message", async () => {
    await assertPostRejects({ name: "" }, /non-empty string/);
  });

  it("POST with a missing name field returns 400 with the validation message", async () => {
    await assertPostRejects({}, /non-empty string/);
  });

  it("POST with a null body returns 400 via the validation message, not a crash", async () => {
    // Exercises the `(req.body as {...})?.name` optional chain. Without
    // it, reading `.name` off a null body throws instead of returning a
    // clean 400.
    await assertPostRejects(null, /non-empty string/);
  });

  it("POST with an over-long name returns 400 (a cap the old manual check lacked)", async () => {
    const overLong = "x".repeat(ITEM_NAME_MAX_LENGTH + 1);
    await assertPostRejects({ name: overLong }, /200 characters or fewer/);
  });

  it("GET with an unsupported method returns 405 with an Allow header", async () => {
    const { req, res } = await authenticatedRequest({ method: "DELETE" });
    await handler(req, res);
    assert.equal(res._getStatusCode(), 405);
    assert.equal(res._getJSONData().error, "Method DELETE not allowed");
    assert.deepEqual(res.getHeader("Allow"), ["GET", "POST"]);
  });

  it("GET surfaces an items-service outage as a 502, not a crash", async () => {
    process.env.ITEMS_SERVICE_URL = "http://127.0.0.1:47999";
    try {
      const { req, res } = await authenticatedRequest({ method: "GET" });
      await handler(req, res);
      assert.equal(res._getStatusCode(), 502);
      assert.ok(res._getJSONData().error);
    } finally {
      process.env.ITEMS_SERVICE_URL = service.url;
    }
  });
});
