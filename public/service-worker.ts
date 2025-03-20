/// <reference lib="webworker" />
/// <reference lib="es2015" />

declare let self: ServiceWorkerGlobalScope;

// API 요청 및 동적 컨텐츠는 항상 네트워크 우선으로 처리
self.addEventListener('fetch', (event) => {
  // API 요청 처리
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (!cachedResponse) {
            throw new Error('No cached response available');
          }
          return cachedResponse;
        }),
    );
    return;
  }

  // 동적 데이터 요청 처리
  if (event.request.headers.get('Accept')?.includes('application/json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (!cachedResponse) {
            throw new Error('No cached response available');
          }
          return cachedResponse;
        }),
    );
    return;
  }

  // 정적 자원은 캐시 우선으로 처리
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((response) => {
          return response;
        })
      );
    }),
  );
});

// 새로운 서비스 워커 설치 시 즉시 활성화
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// 서비스 워커 활성화 시 모든 클라이언트 제어 시작
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // 이전 캐시 삭제
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          }),
        );
      }),
    ]),
  );
});

// 타입스크립트를 위한 빈 export
export {};
