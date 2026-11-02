import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  form_identifier_not_found: "No encontramos ninguna cuenta con este correo",
  form_identifier_exists: "¡Ya tienes cuenta con este correo! Inicia sesión.",
  form_password_incorrect: "Esa contraseña no es la buena",
  form_password_pwned:
    "Esta contraseña ha aparecido en una filtración de datos. Mejor elige otra.",
  form_password_length_too_short:
    "Tu contraseña necesita al menos 8 caracteres",
  form_password_not_strong_enough:
    "Esa contraseña es muy fácil de adivinar. Prueba con una más larga o variada.",
  form_password_validation_failed: "Esa contraseña no es la buena",
  form_param_format_invalid: "Ese correo no parece válido. ¿Lo revisas?",
  not_allowed_access:
    "Con ese correo no podemos crear la cuenta. Prueba con otro que uses de verdad.",
  form_code_incorrect: "Ese código no es el bueno. Revísalo",
  verification_expired: "Este código ya ha caducado. Pide uno nuevo.",
  verification_failed: "Has probado muchas veces este código. Pide uno nuevo.",
  strategy_for_user_invalid:
    "Esta cuenta se creó con Google. Entra con Google o crea una contraseña desde «¿Olvidaste tu contraseña?».",
  too_many_requests: "Vas muy rápido. Espera un momento y vuelve a probar.",
  session_exists: "¡Ya estás dentro!",
};

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!isClerkAPIResponseError(error)) {
    return fallback;
  }

  const code = error.errors[0]?.code;

  if (!code) {
    return fallback;
  }

  return AUTH_ERROR_MESSAGES[code] ?? fallback;
}
