export const Config = {
  // Environment
  appEnv: import.meta.env.VITE_APP_ENV,
  env: import.meta.env.VITE_ENV_NAME,

  // URLs
  serverUrl: import.meta.env.VITE_SERVER_URL,
  serverAPIUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/',
  webUrl: import.meta.env.VITE_WEB_URL,
};