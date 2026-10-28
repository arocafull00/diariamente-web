import { neon } from "@neondatabase/serverless";

const devKey = process.env.CLERK_DEV_SECRET_KEY;
const prodKey = process.env.CLERK_SECRET_KEY;
const apply = process.argv.includes("--apply");

if (!devKey?.startsWith("sk_test_") || !prodKey?.startsWith("sk_live_")) {
  console.error("Requires CLERK_DEV_SECRET_KEY (sk_test_) and CLERK_SECRET_KEY (sk_live_).");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function clerk(key, path, init = {}) {
  const res = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} -> ${res.status} ${await res.text()}`);
  }

  return res.json();
}

async function listUsers(key) {
  const users = [];

  for (let offset = 0; ; offset += 100) {
    const page = await clerk(key, `/users?limit=100&offset=${offset}`);
    users.push(...page);
    if (page.length < 100) return users;
  }
}

function primaryEmail(user) {
  const email = user.email_addresses.find((e) => e.id === user.primary_email_address_id);
  return email?.email_address.toLowerCase() ?? null;
}

async function hasData(profileId) {
  const [row] = await sql`
    SELECT
      EXISTS (SELECT 1 FROM patient_records WHERE patient_id = ${profileId})
      OR EXISTS (SELECT 1 FROM psychologist_patient WHERE patient_id = ${profileId} OR psychologist_id = ${profileId})
      OR EXISTS (SELECT 1 FROM connection_requests WHERE patient_id = ${profileId} OR psychologist_id = ${profileId})
      OR EXISTS (SELECT 1 FROM invite_links WHERE psychologist_id = ${profileId})
      AS has_data
  `;
  return row.has_data;
}

const [devUsers, prodUsers, profileRows] = await Promise.all([
  listUsers(devKey),
  listUsers(prodKey),
  sql`SELECT id FROM profiles`,
]);

const profileIds = new Set(profileRows.map((p) => p.id));
const prodByEmail = new Map(prodUsers.map((u) => [primaryEmail(u), u]));

for (const devUser of devUsers) {
  if (!profileIds.has(devUser.id)) continue;

  const email = primaryEmail(devUser);

  if (!email) {
    console.warn(`SKIP ${devUser.id}: no primary email`);
    continue;
  }

  let prodUser = prodByEmail.get(email);

  if (prodUser && profileIds.has(prodUser.id) && (await hasData(prodUser.id))) {
    console.warn(`SKIP ${email}: production profile ${prodUser.id} already has data, merge manually`);
    continue;
  }

  if (!apply) {
    console.log(`${email}: ${devUser.id} -> ${prodUser?.id ?? "(new production user)"}`);
    continue;
  }

  prodUser ??= await clerk(prodKey, "/users", {
    method: "POST",
    body: JSON.stringify({
      email_address: [email],
      first_name: devUser.first_name,
      last_name: devUser.last_name,
      external_id: devUser.id,
      skip_password_requirement: true,
      ...(devUser.legal_accepted_at
        ? { legal_accepted_at: new Date(devUser.legal_accepted_at).toISOString() }
        : { skip_legal_checks: true }),
    }),
  });

  await sql.transaction([
    sql`DELETE FROM profiles WHERE id = ${prodUser.id}`,
    sql`UPDATE profiles SET id = ${prodUser.id}, updated_at = now() WHERE id = ${devUser.id}`,
  ]);

  console.log(`MIGRATED ${email}: ${devUser.id} -> ${prodUser.id}`);
}

if (!apply) console.log("\nDry run. Re-run with --apply to migrate.");
