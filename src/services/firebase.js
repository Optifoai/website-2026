import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let messaging = null;

function hasRequiredConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp() {
  if (!hasRequiredConfig()) {
    return null;
  }
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export async function getFirebaseMessaging() {
  if (messaging) {
    return messaging;
  }
  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return null;
  }
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }
  messaging = getMessaging(firebaseApp);
  return messaging;
}

export async function requestWebPushPermission() {
  if (typeof Notification === 'undefined') {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  return Notification.requestPermission();
}

export async function getWebPushToken() {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('[FCM] VITE_FIREBASE_VAPID_KEY is missing');
    return null;
  }

  const permission = await requestWebPushPermission();
  if (permission !== 'granted') {
    console.warn('[FCM] Notification permission:', permission);
    return null;
  }

  const msg = await getFirebaseMessaging();
  if (!msg) {
    console.warn('[FCM] Messaging not supported in this browser');
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js'
  );

  return getToken(msg, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
}

export async function listenForegroundMessages(handler) {
  const msg = await getFirebaseMessaging();
  if (!msg || typeof handler !== 'function') {
    return () => {};
  }
  return onMessage(msg, handler);
}
