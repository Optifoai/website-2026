/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBtgb6ZXEXp539FyGjXNneW7ZEULYL_BWc',
  authDomain: 'optifo-5568c.firebaseapp.com',
  projectId: 'optifo-5568c',
  storageBucket: 'optifo-5568c.firebasestorage.app',
  messagingSenderId: '398307705652',
  appId: '1:398307705652:web:1fa24bc457faf5ae605b61',
  measurementId: 'G-NLEH898Q2E',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const title =
    (payload.notification && payload.notification.title) ||
    (payload.data && payload.data.title) ||
    'Optifo';
  const options = {
    body:
      (payload.notification && payload.notification.body) ||
      (payload.data && payload.data.body) ||
      '',
    icon: '/images/icon/notification.svg',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
