import type { NextApiRequest, NextApiResponse } from "next";
import { addItem, getItems } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const items = await getItems();
    res.status(200).json({ items });
    return;
  }

  if (req.method === "POST") {
    const body = req.body as unknown;
    const name = (body as { name?: unknown })?.name;
    if (typeof name !== "string" || name.trim().length === 0) {
      res
        .status(400)
        .json({ error: "`name` is required and must be a non-empty string" });
      return;
    }
    const item = await addItem(name);
    res.status(201).json({ item });
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
