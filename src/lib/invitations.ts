import { customAlphabet } from "nanoid";

export const generateInvitationCode = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  8,
);

export const INVITATION_EXPIRY_DAYS = 7;

export function getInvitationExpiryDate(from = new Date()) {
  const expiresAt = new Date(from);
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);
  return expiresAt;
}
