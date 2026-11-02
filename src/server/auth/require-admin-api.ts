import { timingSafeEqual } from "node:crypto";

export function isAdminApiRequest(req: Request) {
  const secret = process.env.ADMIN_API_SECRET;
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
