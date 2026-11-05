import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env.prod");

const url = process.env.PROD_DATABASE_URL;
if (!url) throw new Error("Missing PROD_DATABASE_URL in .env.prod");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
