import { connection } from "next/server";

export async function getRenderTime() {
  await connection();

  return Date.now();
}
