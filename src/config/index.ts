/**
 * Application Configuration
 * 
 * Centralized configuration using environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },

  // App Information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Match',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    messaging: import.meta.env.VITE_ENABLE_MESSAGING === 'true',
  },

  // Development Settings
  dev: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    mockDataMode: import.meta.env.VITE_MOCK_DATA_MODE === 'true',
  },
} as const;

export default config;
