import { useCallback, useEffect, useRef, useState } from 'react';
import { postRequest } from '../services';
import { APICONFIG } from '../Redux/ApiConfig';
import { getAccessToken } from '../utils/helpers';
import {
  getWebPushToken,
  listenForegroundMessages,
} from '../services/firebase';

const TOKEN_STORAGE_KEY = 'fcmDeviceToken';

async function saveDeviceToken(deviceToken) {
  return postRequest(APICONFIG.DEVICE_TOKEN, {
    deviceToken,
    deviceType: 'web',
  });
}

export async function getWebDeviceLoginFields() {
  try {
    const fcmToken = await getWebPushToken();
    if (!fcmToken) {
      return {};
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, fcmToken);
    return {
      deviceToken: fcmToken,
      deviceType: 'web',
    };
  } catch (err) {
    console.warn('[FCM] login token skipped:', err?.message || err);
    return {};
  }
}

export function useFcmMessaging(enabled) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || '');
  const [status, setStatus] = useState('idle');
  const registeringRef = useRef(false);

  const register = useCallback(async () => {
    if (!enabled || registeringRef.current) {
      return null;
    }
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatus('unsupported');
      return null;
    }

    registeringRef.current = true;
    setStatus('registering');
    try {
      const fcmToken = await getWebPushToken();
      if (!fcmToken) {
        setStatus(Notification.permission === 'denied' ? 'denied' : 'missing-config');
        return null;
      }

      await saveDeviceToken(fcmToken);
      localStorage.setItem(TOKEN_STORAGE_KEY, fcmToken);
      setToken(fcmToken);
      setStatus('ready');
      return fcmToken;
    } catch (err) {
      console.warn('[FCM] register failed:', err?.message || err);
      setStatus('error');
      return null;
    } finally {
      registeringRef.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    register();

    let unsubscribe = () => {};
    listenForegroundMessages((payload) => {
      const title =
        payload?.notification?.title || payload?.data?.title || 'Optifo';
      const body =
        payload?.notification?.body || payload?.data?.body || '';
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/images/icon/notification.svg',
          });
        } catch {
          /* ignore */
        }
      }
    }).then((unsub) => {
      unsubscribe = typeof unsub === 'function' ? unsub : () => {};
    });

    return () => {
      unsubscribe();
    };
  }, [enabled, register]);

  return { token, status, register };
}

export async function clearWebPushTokenOnLogout() {
  if (getAccessToken()) {
    try {
      await postRequest(APICONFIG.DEVICE_TOKEN, {
        deviceToken: '',
        deviceType: 'web',
      });
    } catch {
      /* ignore logout cleanup errors */
    }
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
