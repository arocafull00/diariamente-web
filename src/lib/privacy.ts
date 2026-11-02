import type { UserRole } from "@/db/schema";

export const CONSENT_VERSION = "2026-10";

export const PRIVACY_POLICY_PATH = "/privacidad";
export const ACCESS_LOG_PATH = "/accesos";
export const DATA_EXPORT_PDF_PATH = "/mis-datos";

export const PSYCHOLOGIST_VISIBLE_DATA = [
  "Tu nombre y tu foto de perfil.",
  "Todos tus registros: fecha, emociones, intensidad, contexto y sensaciones corporales.",
  "Lo que escribas en situación, pensamientos y conductas.",
  "Tu última actividad y cuántos registros tienes sin revisar.",
];

export const PSYCHOLOGIST_HIDDEN_DATA = [
  "Tu correo electrónico y tu contraseña.",
  "No podrá editar ni borrar tus registros.",
  "Dejará de ver tus datos en cuanto te desvincules.",
];

export const CLINIC_VISIBLE_DATA = [
  "Tu nombre, tu foto de perfil y tu última conexión.",
  "Cuántos pacientes tienes y cuántos se han vinculado recientemente.",
  "Cuántos registros reciben y revisas, cuántas sesiones haces y cuántos pacientes llevan tiempo sin escribir.",
];

export const CLINIC_HIDDEN_DATA = [
  "Nunca verá los registros, las notas ni los nombres de tus pacientes.",
  "No podrá vincular ni desvincular pacientes.",
  "Dejará de ver tu actividad en cuanto salgas de la clínica.",
];

export const RECORD_VIEW_ACTION = "record.viewed_by_psychologist";
export const RECORD_VIEW_DEDUPE_MINUTES = 30;

export const INACTIVE_ACCOUNT_RETENTION_MONTHS = 24;
export const INACTIVE_ACCOUNT_WARNING_DAYS = 30;
export const AUDIT_RETENTION_MONTHS = 24;

export const IDLE_SIGN_OUT_MINUTES: Record<UserRole, number> = {
  patient: 14 * 24 * 60,
  psychologist: 30,
  clinic: 30,
  admin: 30,
};
