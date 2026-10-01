export const Config = {
  // Environment
  appEnv: import.meta.env.VITE_APP_ENV,
  env: import.meta.env.VITE_ENV_NAME,

  // URLs
  // VITE_SERVER_URL / VITE_MEDIA_BASE_URL = origin that serves /uploads (e.g. https://optifo.in or http://localhost:5001)
  serverUrl: import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_MEDIA_BASE_URL,
  serverAPIUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/',
  webUrl: import.meta.env.VITE_WEB_URL,
};