export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'doom-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'doom-refresh-secret',
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
});
