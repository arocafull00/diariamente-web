import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { readSignupOrigin, signupChannel, signupLandingSchema, SIGNUP_ACQUISITION_COOKIE, SIGNUP_ACQUISITION_WINDOW } from "@/lib/signup-acquisition";

export default clerkMiddleware(async (auth, request) => {
  const response = NextResponse.next();
  if (request.method !== "GET" || request.nextUrl.pathname.startsWith("/api/") || !request.headers.get("accept")?.includes("text/html") || request.headers.has("rsc") || request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") return response;
  if ((await auth()).userId || readSignupOrigin(request.cookies.get(SIGNUP_ACQUISITION_COOKIE)?.value)) return response;
  let referrerHost = "";
  try {
    referrerHost = new URL(request.headers.get("referer") ?? "").hostname;
  } catch {}
  const landing = signupLandingSchema.safeParse(request.nextUrl.searchParams.get("utm_landing") ?? referrerHost);
  response.cookies.set(SIGNUP_ACQUISITION_COOKIE, JSON.stringify({
    channel: signupChannel(request.nextUrl.searchParams.get("utm_source") ?? referrerHost),
    landingHost: landing.success ? landing.data : null,
    capturedAt: Date.now(),
  }), { path: "/", sameSite: "lax", secure: request.nextUrl.protocol === "https:", maxAge: SIGNUP_ACQUISITION_WINDOW / 1000 });
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
