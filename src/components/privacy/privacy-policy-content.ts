import {
  AUDIT_RETENTION_MONTHS,
  IDLE_SIGN_OUT_MINUTES,
  INACTIVE_ACCOUNT_RETENTION_MONTHS,
  INACTIVE_ACCOUNT_WARNING_DAYS,
} from "@/lib/privacy";

export const PRIVACY_POLICY_SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "Qué datos tratamos",
    paragraphs: [
      "Tu nombre, tu foto de perfil y cómo prefieres que te llamemos. El correo y la contraseña los gestiona nuestro proveedor de identidad y no se guardan junto a tus registros.",
      "Si eres paciente, los registros que creas: fecha, emociones, intensidad, contexto, sensaciones corporales y lo que escribes sobre la situación, tus pensamientos y tus conductas. Son datos de salud, una categoría especial según el RGPD.",
      "Un registro de actividad con las acciones relevantes de tu cuenta, como vincularte, crear registros o cuándo tu profesional abre cada uno de ellos.",
    ],
  },
  {
    title: "Quién puede verlos",
    paragraphs: [
      "Solo tú y, si das tu consentimiento explícito al vincularte, el profesional con el que conectas. Antes de enviar la solicitud te mostramos exactamente qué verá.",
      "Puedes retirar el consentimiento en cualquier momento desvinculándote desde tu perfil: tu profesional dejará de tener acceso de inmediato.",
      "Cada vez que tu profesional abre uno de tus registros queda anotado. Puedes consultarlo en el historial de accesos de la sección «Privacidad y cuenta» de Ajustes.",
    ],
  },
  {
    title: "Cuánto tiempo los conservamos",
    paragraphs: [
      "Tus registros se conservan mientras tu cuenta esté activa. Si eliminas la cuenta, borramos tus datos y tu identidad de forma inmediata y definitiva.",
      `Si no usas la app durante ${INACTIVE_ACCOUNT_RETENTION_MONTHS} meses, eliminamos la cuenta y todos sus datos. Te avisaremos con ${INACTIVE_ACCOUNT_WARNING_DAYS} días de antelación si tienes las notificaciones activadas.`,
      `El registro de actividad y de accesos se conserva ${AUDIT_RETENTION_MONTHS} meses.`,
    ],
  },
  {
    title: "Cómo los protegemos",
    paragraphs: [
      "Comprobamos en el servidor quién eres y a qué tienes acceso en cada consulta. Las notificaciones nunca incluyen contenido clínico.",
      `La sesión se cierra automáticamente tras ${IDLE_SIGN_OUT_MINUTES.psychologist} minutos sin actividad para profesionales y tras ${IDLE_SIGN_OUT_MINUTES.patient / (24 * 60)} días para pacientes.`,
    ],
  },
  {
    title: "Dónde se guardan y quién nos ayuda",
    paragraphs: [
      "Tus registros y el resto de datos de la app se guardan en servidores de la Unión Europea, en Fráncfort (Alemania). Allí están nuestra base de datos (Neon) y los servidores que hacen funcionar la app (Vercel).",
      "Tu correo, tu contraseña y los datos básicos de tu cuenta de acceso los gestiona nuestro proveedor de identidad, Clerk, en servidores de Estados Unidos. Clerk está adherido al Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea reconoce como garantía adecuada. No recibe el contenido de tus registros.",
      "Para detectar errores usamos Sentry, con servidores en la Unión Europea. Los profesionales pagan su suscripción a través de Stripe.",
      "Algunos de estos proveedores son empresas de Estados Unidos y pueden tratar datos técnicos, como registros de acceso o estadísticas de visitas, fuera de la Unión Europea. Cuando ocurre, lo hacen con las garantías que exige el RGPD: el Marco de Privacidad de Datos UE-EE. UU. o cláusulas contractuales tipo.",
      "Las notificaciones pasan por el servicio de tu navegador o de tu móvil (Google, Apple o Mozilla) y nunca incluyen contenido clínico.",
    ],
  },
  {
    title: "Tus derechos",
    paragraphs: [
      "Puedes acceder a tus datos y descargarlos en JSON o PDF desde «Privacidad y cuenta» en Ajustes (derecho de acceso y portabilidad).",
      "Puedes corregir tu perfil y tus registros desde la app, y eliminar tu cuenta desde «Privacidad y cuenta» en Ajustes (derecho de rectificación y supresión).",
    ],
  },
];
