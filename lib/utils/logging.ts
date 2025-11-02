type LogLevel = "info" | "error" | "warn";

type LogMetadata = Record<string, unknown>;

function log(level: LogLevel, message: string, metadata: LogMetadata = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  const serialized = JSON.stringify(entry);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

export function logInfo(message: string, metadata: LogMetadata = {}) {
  log("info", message, metadata);
}

export function logError(
  message: string,
  metadata: LogMetadata = {},
  error?: unknown
) {
  const errorMetadata = error instanceof Error
    ? { error: error.message, stack: error.stack }
    : {};
  log("error", message, { ...metadata, ...errorMetadata });
}

export function logWarn(message: string, metadata: LogMetadata = {}) {
  log("warn", message, metadata);
}
