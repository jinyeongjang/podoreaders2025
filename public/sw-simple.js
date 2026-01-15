/// <reference lib="webworker" />

self.addEventListener('install', (event) => {
  console.log('[SW Simple] Installing...');
  // 설치 후 즉시 활성화
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW Simple] Activating...');
  // 클라이언트 즉시 claim
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || '알림';
    const options = {
      body: data.body || '',
      icon: '/images/icon-192.png',
      badge: '/images/icon-192.png',
      data: data.url || '/', // URL 저장
      vibrate: data.vibrate || [100, 50, 100],
      tag: data.tag || 'simple-push',
      renotify: data.renotify ?? true,
      actions: data.actions || [],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('[SW Simple] Push Error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data;

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // 이미 열린 윈도우가 있다면 focus
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // 그렇지 않다면 새로운 Window를 열어준다
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});
