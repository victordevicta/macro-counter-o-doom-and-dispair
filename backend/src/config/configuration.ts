export default () => {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}.`,
    );
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    nutritionix: {
      appId: process.env.NUTRITIONIX_APP_ID,
      appKey: process.env.NUTRITIONIX_APP_KEY,
      baseUrl: 'https://trackapi.nutritionix.com/v2',
    },
    usda: {
      apiKey: process.env.USDA_API_KEY || 'DEMO_KEY',
      baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    },
    openFoodFacts: {
      baseUrl: process.env.OPEN_FOOD_FACTS_URL || 'https://world.openfoodfacts.org',
    },
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
      limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
    },
    mail: {
      resendApiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "Macro Counter O' Doom <onboarding@resend.dev>",
      publicUrl: process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`,
    },
  };
};
