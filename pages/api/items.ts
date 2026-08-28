import type { NextApiRequest, NextApiResponse } from "next";
import { addItem, getItems } from "@/lib/db";
import { assertItemName } from "@/lib/validate";
import { requireSession } from "@/lib/require-session";

/**
 * Mirrors the App Router branches' itemsServiceFailure() helper: an
 * items-service outage becomes a 502 (gateway-to-upstream failure), not
 * an uncaught rejection -- Pages Router's own request pipeline does
 * catch unhandled errors in API routes (unlike Express 4), but this
 * keeps the status code and error shape identical to the App Router
 * branches and avoids duplicating the try/catch between GET and POST.
 */
async function withItemsServiceErrorHandling(
  res: NextApiResponse,
  action: () => Promise<void>
): Promise<void> {
  try {
    await action();
  } catch (err) {
    res
      .status(502)
      .json({ error: err instanceof Error ? err.message : "items-service request failed" });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireSession(req, res))) {
    return;
  }

  if (req.method === "GET") {
    await withItemsServiceErrorHandling(res, async () => {
      const items = await getItems();
      res.status(200).json({ items });
    });
    return;
  }

  if (req.method === "POST") {
    let name: string;
    try {
      name = assertItemName((req.body as { name?: unknown })?.name);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Invalid `name`" });
      return;
    }

    await withItemsServiceErrorHandling(res, async () => {
      const item = await addItem(name);
      res.status(201).json({ item });
    });
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
