const CACHE_NAME = 'youngseang-cal-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 항상 네트워크 우선, 실패 시 캐시 (오프라인 대비)
// cache: 'no-store' 로 브라우저 HTTP 캐시(Cache-Control 헤더)까지 건너뛰고
// 매번 서버의 진짜 최신 파일을 받아오도록 함
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
