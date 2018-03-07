// https://developers.google.com/web/fundamentals/primers/service-workers/

const CACHE_NAME = 'my-site-cache-v4'
var urlToCache = ['img/p01.jpg']

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('opened cache')
                return cache.addAll(urlToCache)
            })
    )
})

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // if cache hit return response
                if (response) {
                    return response
                }
                return fetch(event.request)
                    .then(function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response
                        }
                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone()

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                // cache new request
                                console.log('cache new request: ', event)
                                return cache.put(event.request, responseToCache)
                            })

                        return response
                    })
            })
    )
})

self.addEventListener('activate', function (event) {
    var cacheWhitelists = [CACHE_NAME]
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            console.log(cacheNames)
            return Promise.all(
                cacheNames.map(function (name) {
                    if (cacheWhitelists.indexOf(name) === -1) {
                        console.log('will delete cache:', name)
                        return caches.delete(name)
                    }
                })
            )
        })
    )
})