import { NextResponse, type NextRequest } from "next/server";
import { addItem, getItems } from "@/lib/db";
import { assertItemName } from "@/lib/validate";
import { unauthorizedResponse } from "@/lib/require-session";

export async function GET(request: NextRequest) {
  const unauthorized = await unauthorizedResponse(request);
  if (unauthorized) {
    return unauthorized;
  }

  const items = await getItems();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const unauthorized = await unauthorizedResponse(request);
  if (unauthorized) {
    return unauthorized;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let name: string;
  try {
    name = assertItemName((body as { name?: unknown })?.name);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid `name`" },
      { status: 400 }
    );
  }

  const item = await addItem(name);
  return NextResponse.json({ item }, { status: 201 });
}
