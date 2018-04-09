var cacheName = 'FIRST-WEATHER-PWA-APP-4';
var dataCacheName = 'weatherData-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener('install', (e) => {
  console.log('Enter SW install');
  e.waitUntil(caches.open(cacheName).then((cache) => {
    console.log('SW Caching app shell');
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then((keyList) => {
      console.log(keyList, 'activate keylist');
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('SW Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // method 1 fetchThen cache
  // const fetched = fetch(e.request)
  // const fetchedCopy = fetched.then(resp => resp.clone());

  // Promise.all([fetchedCopy, caches.open(cacheName)])
  //   .then(([response, cache]) => response.ok && cache.put(e.request, response))
  //   .catch(_ => {/* eat any errors */})
  
  // return fetched;

  // method 2
  // console.log(`SW Fetch: ${e.request.url}`);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }

  // method 3 race
  // const cached = caches.match(event.request);
  // const cloneRequest = event.request.clone();
  // const fetched = fetch(cloneRequest);
  // const fetchedCopy = fetched.then(resp => resp.clone());
  
  // // Call respondWith() with whatever we get first.
  // // Promise.race() resolves with first one settled (even rejected)
  // // If the fetch fails (e.g disconnected), wait for the cache.
  // // If there’s nothing in cache, wait for the fetch.
  // // If neither yields a response, return offline pages.
  // event.respondWith(
  //   Promise.race([fetched.catch(_ => cached), cached])
  //     .then(resp => resp || fetched)
  //     .catch(_ => caches.match('offline.html'))
  // );

  // // Update the cache with the version we fetched (only for ok status)
  // event.waitUntil(
  //   Promise.all([fetchedCopy, caches.open(cacheName)])
  //     .then(([response, cache]) => response.ok && cache.put(event.request, response))
  //     .catch(_ => {/* eat any errors */ })
  // );
});