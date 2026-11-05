import { drizzleAdapter } from "@neon/realtime-drizzle";
import { createRealtime } from "@neon/realtime/server";

const secret = process.env.NEON_REALTIME_SECRET;
const databaseUrl = process.env.DATABASE_URL;

export const realtime =
  secret && databaseUrl
    ? createRealtime({
        secret,
        db: new URL(databaseUrl).pathname.slice(1),
        adapter: drizzleAdapter(),
      })
    : null;
