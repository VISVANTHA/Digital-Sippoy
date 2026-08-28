import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { authOptions } from "../../lib/auth";

/**
 * Pages Router equivalent of the App Router branches' session.ts.
 * Mints a real next-auth JWT (signed with the same secret authOptions
 * uses) and attaches it as the session cookie on a node-mocks-http
 * req/res pair, so tests exercise the actual token verification path in
 * lib/require-session.ts rather than mocking it away.
 */
type MockOptions = { method?: string; body?: unknown };

export async function authenticatedRequest(options: MockOptions = {}) {
  const token = await encode({
    token: { name: "admin", sub: "demo-user" },
    secret: authOptions.secret as string,
  });
  // node-mocks-http doesn't parse `headers.cookie` into `req.cookies`
  // itself (Next's own request handling normally does that before a
  // real handler runs), and getToken() reads req.cookies first -- so
  // both need to be set for the mock to be a faithful stand-in.
  return createMocks<NextApiRequest, NextApiResponse>({
    method: (options.method ?? "GET") as never,
    body: options.body as never,
    headers: { cookie: `next-auth.session-token=${token}` },
    cookies: { "next-auth.session-token": token },
  });
}

export function anonymousRequest(options: MockOptions = {}) {
  return createMocks<NextApiRequest, NextApiResponse>({
    method: (options.method ?? "GET") as never,
    body: options.body as never,
  });
}
