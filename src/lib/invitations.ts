import { customAlphabet } from "nanoid";

export const generateInviteToken = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",
  21,
);

export function buildInviteUrl(origin: string, token: string) {
  return `${origin}/conectar/${token}`;
}

export const INVITE_COOKIE_NAME = "dm_invite";
export const INVITE_COOKIE_MAX_AGE_SECONDS = 30 * 60;
