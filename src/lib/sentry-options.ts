import type { ErrorEvent, Log } from "@sentry/nextjs";

const QUERY_PARAMS_PATTERN = /\nparams:[\s\S]*$/;

export function redactSensitiveText(text: string) {
  return text.replace(QUERY_PARAMS_PATTERN, "\nparams: [redacted]");
}

function scrubEvent(event: ErrorEvent) {
  if (event.message) {
    event.message = redactSensitiveText(event.message);
  }

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) {
      exception.value = redactSensitiveText(exception.value);
    }
  }

  return event;
}

function scrubLog(log: Log) {
  return {
    ...log,
    message:
      typeof log.message === "string"
        ? redactSensitiveText(log.message)
        : log.message,
  };
}

export const sentryOptions = {
  dsn: "https://42f274b12cc9dacd70f369c613ab5c84@o4511311377137664.ingest.de.sentry.io/4512336416211024",
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    databaseQueryData: false,
    queues: false,
    stackFrameVariables: false,
    genAI: { inputs: false, outputs: false },
    mcp: { inputs: false, outputs: false },
  },
  beforeSend: scrubEvent,
  beforeSendLog: scrubLog,
};
