import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

/**
 * Pages Router equivalent of the App Router branches' require-session.ts.
 * next-auth/jwt's getToken() accepts a NextApiRequest directly (it's
 * IncomingMessage-based, same as what getToken expects there), so the
 * pattern -- and the reason for it (keeping this directly callable from
 * tests without Next's implicit request context) -- carries over
 * unchanged. Writes the 401 response itself and returns false, matching
 * Pages Router's imperative req/res style rather than App Router's
 * return-a-Response style.
 */
export async function requireSession(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const token = await getToken({ req, secret: authOptions.secret });
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return false;
  }
  return true;
}
