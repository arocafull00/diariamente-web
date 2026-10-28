import * as Sentry from "@sentry/nextjs";

import { redactSensitiveText } from "@/lib/sentry-options";

type LogContext = Record<string, string | number | boolean | null | undefined>;

type LogLevel = "info" | "warn" | "error";

function toError(error: unknown, message: string) {
  if (error instanceof Error) {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return new Error(error.message);
  }

  return new Error(message);
}

function writeToConsole(level: LogLevel, message: string, details: unknown[]) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console[level](`[${level}] ${message}`, ...details.filter(Boolean));
}

export const logger = {
  identify(userId: string | null) {
    Sentry.setUser(userId ? { id: userId } : null);
  },
  info(message: string, context?: LogContext) {
    Sentry.logger.info(message, context);
    writeToConsole("info", message, [context]);
  },
  warn(message: string, context?: LogContext) {
    Sentry.logger.warn(message, context);
    writeToConsole("warn", message, [context]);
  },
  error(message: string, error: unknown, context?: LogContext) {
    const exception = toError(error, message);

    Sentry.logger.error(message, {
      ...context,
      errorName: exception.name,
      errorMessage: redactSensitiveText(exception.message),
    });
    Sentry.captureException(exception, {
      tags: { event: message },
      extra: context,
    });
    writeToConsole("error", message, [context, error]);
  },
};
