import { customAlphabet } from "nanoid";

export const REFERRAL_BONUS_DAYS = 30;

export const generateReferralCode = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  8,
);

export function buildReferralUrl(origin: string, code: string) {
  return `${origin}/colega/${code}`;
}

export const REFERRAL_COOKIE_NAME = "dm_referral";
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
