import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  INVITE_COOKIE_MAX_AGE_SECONDS,
  INVITE_COOKIE_NAME,
} from "@/lib/invitations";
import { getInviteLinkByToken } from "@/server/queries";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const { origin } = new URL(request.url);

  const link = await getInviteLinkByToken(token);

  if (!link) {
    return NextResponse.redirect(`${origin}/conectar?error=invalido`);
  }

  const cookieStore = await cookies();
  cookieStore.set(INVITE_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: INVITE_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.redirect(`${origin}/conectar`);
}
