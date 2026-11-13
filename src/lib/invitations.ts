import { customAlphabet } from "nanoid";

export const generateInviteToken = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",
  21,
);

export const INVITE_CODE_LENGTH = 6;

export const generateInviteCode = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  INVITE_CODE_LENGTH,
);

export function normalizeInviteCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function formatInviteCode(code: string) {
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}

export function buildInviteUrl(origin: string, token: string) {
  return `${origin}/conectar/${token}`;
}

export const INVITE_COOKIE_NAME = "dm_invite";
export const INVITE_COOKIE_MAX_AGE_SECONDS = 30 * 60;
