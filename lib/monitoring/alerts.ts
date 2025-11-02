// lib/monitoring/alerts.ts - Alerting and notification system

/**
 * Alert severity levels
 */
export type AlertSeverity = "info" | "warning" | "error" | "critical";

/**
 * Alert configuration
 */
export interface AlertConfig {
  name: string;
  severity: AlertSeverity;
  threshold?: number;
  enabled: boolean;
}

/**
 * Alert types
 */
export const ALERT_CONFIGS: Record<string, AlertConfig> = {
  HIGH_ERROR_RATE: {
    name: "High Error Rate",
    severity: "error",
    threshold: 5, // 5% error rate
    enabled: true,
  },
  SLOW_RESPONSE_TIME: {
    name: "Slow Response Time",
    severity: "warning",
    threshold: 3000, // 3 seconds
    enabled: true,
  },
  SERVICE_DOWN: {
    name: "Service Down",
    severity: "critical",
    enabled: true,
  },
  HIGH_API_USAGE: {
    name: "High API Usage",
    severity: "warning",
    threshold: 80, // 80% of rate limit
    enabled: true,
  },
  SECURITY_INCIDENT: {
    name: "Security Incident",
    severity: "critical",
    enabled: true,
  },
};

/**
 * Send alert to Slack
 */
export async function sendSlackAlert(
  message: string,
  severity: AlertSeverity,
  metadata?: Record<string, any>
) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("Slack webhook URL not configured");
    return;
  }
  
  const color = {
    info: "#36a64f",
    warning: "#ff9800",
    error: "#f44336",
    critical: "#d32f2f",
  }[severity];
  
  const payload = {
    attachments: [
      {
        color,
        title: `[${severity.toUpperCase()}] AdGenXAI Alert`,
        text: message,
        fields: metadata
          ? Object.entries(metadata).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            }))
          : undefined,
        footer: "AdGenXAI Monitoring",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
  
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send Slack alert:", error);
  }
}

/**
 * Send alert to Discord
 */
export async function sendDiscordAlert(
  message: string,
  severity: AlertSeverity,
  metadata?: Record<string, any>
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured");
    return;
  }
  
  const color = {
    info: 0x36a64f,
    warning: 0xff9800,
    error: 0xf44336,
    critical: 0xd32f2f,
  }[severity];
  
  const payload = {
    embeds: [
      {
        title: `[${severity.toUpperCase()}] AdGenXAI Alert`,
        description: message,
        color,
        fields: metadata
          ? Object.entries(metadata).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            }))
          : undefined,
        footer: { text: "AdGenXAI Monitoring" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
  
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send Discord alert:", error);
  }
}

/**
 * Send email alert (via SendGrid, Mailgun, or similar)
 */
export async function sendEmailAlert(
  message: string,
  severity: AlertSeverity,
  metadata?: Record<string, any>
) {
  const emailEndpoint = process.env.EMAIL_ALERT_ENDPOINT;
  if (!emailEndpoint) {
    console.warn("Email alert endpoint not configured");
    return;
  }
  
  const payload = {
    to: process.env.ALERT_EMAIL_RECIPIENTS?.split(",") || [],
    subject: `[${severity.toUpperCase()}] AdGenXAI Alert`,
    body: message,
    metadata,
  };
  
  try {
    await fetch(emailEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send email alert:", error);
  }
}

/**
 * Trigger alert based on configuration
 */
export async function triggerAlert(
  alertType: keyof typeof ALERT_CONFIGS,
  message: string,
  metadata?: Record<string, any>
) {
  const config = ALERT_CONFIGS[alertType];
  if (!config || !config.enabled) {
    return;
  }
  
  // Log alert
  console.error(JSON.stringify({
    type: "alert",
    alertType,
    severity: config.severity,
    message,
    metadata,
    timestamp: new Date().toISOString(),
  }));
  
  // Send to notification channels based on severity
  if (config.severity === "critical") {
    // Critical alerts go to all channels
    await Promise.all([
      sendSlackAlert(message, config.severity, metadata),
      sendDiscordAlert(message, config.severity, metadata),
      sendEmailAlert(message, config.severity, metadata),
    ]);
  } else if (config.severity === "error") {
    // Errors go to Slack and Discord
    await Promise.all([
      sendSlackAlert(message, config.severity, metadata),
      sendDiscordAlert(message, config.severity, metadata),
    ]);
  } else if (config.severity === "warning") {
    // Warnings go to Slack
    await sendSlackAlert(message, config.severity, metadata);
  }
}

/**
 * Check error rate and trigger alert if needed
 */
export function checkErrorRate(errorCount: number, totalCount: number) {
  const errorRate = (errorCount / totalCount) * 100;
  const threshold = ALERT_CONFIGS.HIGH_ERROR_RATE.threshold || 5;
  
  if (errorRate > threshold) {
    triggerAlert("HIGH_ERROR_RATE", `Error rate is ${errorRate.toFixed(2)}%`, {
      errorCount,
      totalCount,
      errorRate: `${errorRate.toFixed(2)}%`,
    });
  }
}

/**
 * Check response time and trigger alert if needed
 */
export function checkResponseTime(responseTime: number) {
  const threshold = ALERT_CONFIGS.SLOW_RESPONSE_TIME.threshold || 3000;
  
  if (responseTime > threshold) {
    triggerAlert("SLOW_RESPONSE_TIME", `Response time is ${responseTime}ms`, {
      responseTime: `${responseTime}ms`,
      threshold: `${threshold}ms`,
    });
  }
}

/**
 * Report service down
 */
export function reportServiceDown(serviceName: string, error?: string) {
  triggerAlert("SERVICE_DOWN", `Service ${serviceName} is down`, {
    service: serviceName,
    error: error || "Unknown error",
  });
}

/**
 * Report security incident
 */
export function reportSecurityIncident(
  incidentType: string,
  details: Record<string, any>
) {
  triggerAlert("SECURITY_INCIDENT", `Security incident: ${incidentType}`, {
    incidentType,
    ...details,
  });
}
