// imports

console.log('Hola Mundo!!!.....');
importScripts('js/sw-utils.js');

// 2 - Cache with Network Fallback

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const DYNAMIC_CACHE_LIMIT = 50;


function limpiarCache(cacheName, numeroItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {

                    if (keys.length > numeroItems) {
                        caches.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItems));
                    }
                });
        });
}

const APP_SHELL = [
    // '/',
    '/face-recognition-javascript-pwa/index.html',
    '/face-recognition-javascript-pwa/assets/logo-loteria.jpg',
    '/face-recognition-javascript-pwa/assets/favicon.ico',
    '/face-recognition-javascript-pwa/app.js',
    '/face-recognition-javascript-pwa/app-index.js',
    '/face-recognition-javascript-pwa/js/app.js',
    '/face-recognition-javascript-pwa/js/sw-utils.js',
    '/face-recognition-javascript-pwa/backoffice.html',
    '/face-recognition-javascript-pwa/backoffice.js'
];

const APP_SHELL_INMUTABLE = [
    '/face-recognition-javascript-pwa/jquery-3.7.1/jquery-3.7.1.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js',
    '/face-recognition-javascript-pwa/sweetalert2@11/sweetalert2@11.js',
    '/face-recognition-javascript-pwa/librerias/twbs-pagination-master/jquery.twbsPagination.min.js',
    '/face-recognition-javascript-pwa/librerias/fontawesome-free-6.4.2-web/css/all.css',
    '/face-recognition-javascript-pwa/librerias/fontawesome-free-6.4.2-web/js/all.min.js'
];



self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

    // Forzamos la activacion del serviceworker
    // self.skipWaiting();

});


self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
            if (key !== INMUTABLE_CACHE && key.includes('inmutable')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});


// self.addEventListener('fetch', e => {
//     const respuesta = caches.match(e.request).then(res => {
//         if (res) {
//             return res;
//         } else {
//             return fetch(e.request).then(newRes => {
//                 return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
//             }).catch(console.log);
//         }
//     });
//     e.respondWith(respuesta);
// });

self.addEventListener('fetch', function (event) {
    event.respondWith((async () => {
        try {
            // Intenta obtener la respuesta de la caché
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            // Si no está en caché, realiza una solicitud de red
            const networkResponse = await fetch(event.request);
            // actualizaCacheDinamico(DYNAMIC_CACHE, event.request, networkResponse);
            return networkResponse;
        } catch (error) {
            console.error('Fetch failed:', error);
            throw error; // Asegúrate de lanzar el error para que respondWith() reciba una promesa rechazada
        }
    })
    // .then(newRes => {
    //     return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes)
    // })
    ());
});

//   self.addEventListener('fetch', event => {
//     event.respondWith(
//       (async () => {
//         try {
//           // Intenta obtener la respuesta de la red primero
//           const networkResponse = await fetch(event.request);
//           return networkResponse;
//         } catch (error) {
//           // Si falla la red, intenta obtener la respuesta de la caché
//           const cacheResponse = await caches.match(event.request);
//           if (cacheResponse) {
//             return cacheResponse;
//           }
//           // Si no hay respuesta en la caché, muestra un mensaje de error o una página de fallback
//           return new Response('No se pudo cargar la página', {
//             status: 503,
//             statusText: 'Service Unavailable',
//             headers: new Headers({ 'Content-Type': 'text/html' }),
//           });
//         }
//       })()
//     );
//   });

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        // const title = "Web Push example";
        const title = "Face recognition server";

        return self.registration.showNotification(title, {
            body,
        });
    };

    if (event.data) {
        const payload = event.data.json();
        event.waitUntil(sendNotification(payload.message));
    }
});