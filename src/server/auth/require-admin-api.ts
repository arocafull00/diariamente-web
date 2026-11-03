import { timingSafeEqual } from "node:crypto";

export function hasBearerSecret(req: Request, secret: string | undefined) {
  const header = req.headers.get("authorization");

  if (!secret || !header) {
    return false;
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function isAdminApiRequest(req: Request) {
  return hasBearerSecret(req, process.env.ADMIN_API_SECRET);
}

export function isCronRequest(req: Request) {
  return hasBearerSecret(req, process.env.CRON_SECRET);
}
