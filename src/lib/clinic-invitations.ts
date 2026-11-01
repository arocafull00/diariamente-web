export function buildClinicInviteUrl(origin: string, token: string) {
  return `${origin}/unirse-clinica/${token}`;
}

export const CLINIC_INVITE_COOKIE_NAME = "dm_clinic_invite";
