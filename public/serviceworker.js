const CACHE_NAME = "version-1";
const urlsToCatche = ['index.html', 'offline.html'];
const self = this;

//install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('opened cache');

            return cache.addAll(urlsToCatche);
        })
    )
});
//listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(()=> {
                return fetch(event.request)
                .cache(()=>caches.match('offline.html'))
            })
    )
});
//activate service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME)

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});