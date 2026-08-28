import type { NextApiRequest, NextApiResponse } from "next";
import { addItem, getItems } from "@/lib/db";
import { assertItemName } from "@/lib/validate";
import { requireSession } from "@/lib/require-session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireSession(req, res))) {
    return;
  }

  if (req.method === "GET") {
    const items = await getItems();
    res.status(200).json({ items });
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
    const item = await addItem(name);
    res.status(201).json({ item });
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
