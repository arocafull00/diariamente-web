import type { BeforeSendEvent } from "@vercel/analytics";
import { SIGNUP_ACQUISITION_COOKIE } from "@/lib/signup-acquisition";

const STORAGE_KEY = "diariamente-acquisition-v1";
const VISIT_TIMEOUT = 30 * 60 * 1000;
const CHANNELS = ["linkedin", "instagram", "facebook", "web"] as const;
type Channel = (typeof CHANNELS)[number];
type Visit = { channel: Channel; platform: "web" | "android"; lastSeen: number };
let visit: Visit | null = null;
let initialized = false;

function socialChannel(value: string): Channel | null {
  const source = value.toLowerCase().replace(/^www\./, "");
  if (["linkedin", "li", "lnkd.in"].includes(source) || /(^|\.)linkedin\.com$/.test(source)) return "linkedin";
  if (["instagram", "ig", "insta"].includes(source) || /(^|\.)instagram\.com$/.test(source)) return "instagram";
  if (["facebook", "fb", "fb.com", "fb.me"].includes(source) || /(^|\.)facebook\.com$/.test(source)) return "facebook";
  return null;
}

function readVisit(): Visit | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && CHANNELS.includes(saved.channel) && ["web", "android"].includes(saved.platform) && Number.isFinite(saved.lastSeen)) return saved;
  } catch {}
  return null;
}

function incomingChannel(): Channel | null {
  const source = new URL(location.href).searchParams.get("utm_source");
  if (source) return socialChannel(source) ?? "web";
  try {
    return socialChannel(new URL(document.referrer).hostname);
  } catch {
    return null;
  }
}

function currentPlatform(): Visit["platform"] {
  try {
    const referrer = new URL(document.referrer);
    if (referrer.protocol === "android-app:" && referrer.hostname === "com.arocafull.apppsicologia") return "android";
  } catch {}
  return visit?.platform === "android" && matchMedia("(display-mode: standalone)").matches ? "android" : "web";
}

export function getAcquisitionPlatform() {
  return captureVisit().platform;
}

function captureVisit() {
  if (!initialized) {
    visit = readVisit();
    initialized = true;
  }
  const channel = incomingChannel() ?? (visit && Date.now() - visit.lastSeen < VISIT_TIMEOUT ? visit.channel : "web");
  const platform = currentPlatform();
  visit = { channel, platform, lastSeen: Date.now() };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visit));
  } catch {}
  return visit;
}

export function trackAcquisition(event: BeforeSendEvent): BeforeSendEvent {
  if (event.type !== "pageview") return event;
  const { channel, platform } = captureVisit();
  const url = new URL(event.url);
  url.pathname = `/__acquisition/${platform}/${channel}${url.pathname}`;
  return { ...event, url: url.href };
}

export function clearAcquisition() {
  visit = null;
  initialized = true;
  document.cookie = `${SIGNUP_ACQUISITION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}
