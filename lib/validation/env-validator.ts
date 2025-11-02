// lib/validation/env-validator.ts
// Environment variable validation utilities for BEE-SHIP

export interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export interface PlatformRequirements {
  instagram?: boolean;
  youtube?: boolean;
  tiktok?: boolean;
}

/**
 * Validate environment variables for specific platforms
 */
export function validateEnvironment(
  requirements: PlatformRequirements = {}
): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Instagram validation
  if (requirements.instagram) {
    if (!process.env.INSTAGRAM_ACCOUNT_ID) {
      missing.push("INSTAGRAM_ACCOUNT_ID");
    }
    if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
      missing.push("INSTAGRAM_ACCESS_TOKEN");
    }
  }

  // YouTube validation
  if (requirements.youtube) {
    if (!process.env.YOUTUBE_CLIENT_ID) {
      missing.push("YOUTUBE_CLIENT_ID");
    }
    if (!process.env.YOUTUBE_CLIENT_SECRET) {
      missing.push("YOUTUBE_CLIENT_SECRET");
    }
    if (!process.env.YOUTUBE_REFRESH_TOKEN) {
      missing.push("YOUTUBE_REFRESH_TOKEN");
    }
  }

  // TikTok validation
  if (requirements.tiktok) {
    if (!process.env.TIKTOK_CLIENT_KEY) {
      missing.push("TIKTOK_CLIENT_KEY");
    }
    if (!process.env.TIKTOK_CLIENT_SECRET) {
      missing.push("TIKTOK_CLIENT_SECRET");
    }
    if (!process.env.TIKTOK_ACCESS_TOKEN) {
      missing.push("TIKTOK_ACCESS_TOKEN");
    }
  }

  // Optional but recommended
  if (!process.env.WEBHOOK_SECRET) {
    warnings.push(
      "WEBHOOK_SECRET not set - webhook signature verification disabled"
    );
  }

  if (!process.env.RATE_LIMIT_PER_MINUTE) {
    warnings.push(
      "RATE_LIMIT_PER_MINUTE not set - using default (10 req/min)"
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validate all platform credentials are configured
 */
export function validateAllPlatforms(): ValidationResult {
  return validateEnvironment({
    instagram: true,
    youtube: true,
    tiktok: true,
  });
}

/**
 * Get configured platforms based on available credentials
 */
export function getConfiguredPlatforms(): string[] {
  const platforms: string[] = [];

  // Check Instagram
  if (
    process.env.INSTAGRAM_ACCOUNT_ID &&
    process.env.INSTAGRAM_ACCESS_TOKEN
  ) {
    platforms.push("instagram");
  }

  // Check YouTube
  if (
    process.env.YOUTUBE_CLIENT_ID &&
    process.env.YOUTUBE_CLIENT_SECRET &&
    process.env.YOUTUBE_REFRESH_TOKEN
  ) {
    platforms.push("youtube");
  }

  // Check TikTok
  if (
    process.env.TIKTOK_CLIENT_KEY &&
    process.env.TIKTOK_CLIENT_SECRET &&
    process.env.TIKTOK_ACCESS_TOKEN
  ) {
    platforms.push("tiktok");
  }

  return platforms;
}

/**
 * Validate environment on startup and log results
 */
export function validateAndLog(): void {
  const result = validateAllPlatforms();
  const configured = getConfiguredPlatforms();

  console.log("🔍 BEE-SHIP Environment Validation");
  console.log("==================================");

  if (configured.length > 0) {
    console.log("✅ Configured platforms:", configured.join(", "));
  } else {
    console.log("⚠️  No platforms configured");
  }

  if (result.missing.length > 0) {
    console.log("\n❌ Missing environment variables:");
    result.missing.forEach((key) => {
      console.log(`   - ${key}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    result.warnings.forEach((warning) => {
      console.log(`   - ${warning}`);
    });
  }

  if (result.valid && configured.length === 3) {
    console.log("\n✅ All platforms configured and ready!");
  } else if (configured.length > 0) {
    console.log("\n✅ Partial configuration - some platforms ready");
  }

  console.log("==================================\n");
}

/**
 * Assert environment variables are set (throws error if not)
 */
export function assertEnvironment(requirements: PlatformRequirements): void {
  const result = validateEnvironment(requirements);

  if (!result.valid) {
    throw new Error(
      `Missing required environment variables: ${result.missing.join(", ")}\n` +
        `Please configure these in your .env file or Netlify environment variables.\n` +
        `See .env.example for details.`
    );
  }
}
