import { NextResponse } from "next/server";
import { addItem, getItems } from "@/lib/db";

export async function GET() {
  const items = await getItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body as { name?: unknown })?.name;
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "`name` is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const item = await addItem(name);
  return NextResponse.json({ item }, { status: 201 });
}