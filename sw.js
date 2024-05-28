// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',
    'index.html',
    'backoffice.html',
    'assets/apple-touch-icon.png',
    'assets/favicon-32x32.png',
    'assets/favicon-16x16.png',
    'assets/logo-loteria.jpg',
    'app.js',
    'js/sw-utils.js',
    'backoffice.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css',
    'jquery-3.7.1/jquery-3.7.1.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js',
    'sweetalert2@11/sweetalert2@11.js',
    'librerias/twbs-pagination-master/jquery.twbsPagination.min.js',
    'librerias/fontawesome-free-6.4.2-web/js/all.min.js',
    'librerias/fontawesome-free-6.4.2-web/css/all.css'
];



self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

    // Forzamos la activacion del serviceworker
    // self.skipWaiting();

});


self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if (  key !== STATIC_CACHE && key.includes('static_v1') ) {
                return caches.delete(key);
            }
            if (  key !== DYNAMIC_CACHE && key.includes('dynamic_v1') ) {
                return caches.delete(key);
            }
            if (  key !== INMUTABLE_CACHE && key.includes('inmutable') ) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( respuesta );
});


self.addEventListener( 'fetch', e => {
    const respuesta = caches.match( e.request ).then( res => {
        if ( res ) {
            return res;
        } else {
            return fetch( e.request ).then( newRes => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            }).catch(error => console.log(error));
        }
    });
    e.respondWith( respuesta );
});

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