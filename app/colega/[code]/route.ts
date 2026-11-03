import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  REFERRAL_COOKIE_MAX_AGE_SECONDS,
  REFERRAL_COOKIE_NAME,
} from "@/lib/referrals";
import { getReferralCodeOwner } from "@/server/queries";
import { referralCodeSchema } from "@/validation/schemas";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { code } = await params;
  const { origin } = new URL(request.url);

  const parsed = referralCodeSchema.safeParse(code);
  const owner = parsed.success ? await getReferralCodeOwner(parsed.data) : null;

  if (parsed.success && owner) {
    const cookieStore = await cookies();
    cookieStore.set(REFERRAL_COOKIE_NAME, parsed.data, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  }

  const { userId } = await auth();

  return NextResponse.redirect(`${origin}${userId ? "/" : "/registro"}`);
}
