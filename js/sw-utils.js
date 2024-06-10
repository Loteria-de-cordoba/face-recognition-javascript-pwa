// Guardar  en el cache dinamico
// function actualizaCacheDinamico(dynamicCache, req, res) {
//     if (res.ok) {
//         return caches.open(dynamicCache).then(cache => {
//             cache.put(req, res.clone());
//             // limpiarCache( dynamicCache, 5);      
//             return res.clone();
//         }).catch(err => {
//             if (e.request.headers.get('accept').includes('text/html')) {
//                 return caches.match('/pages/offline.html');
//             }
//         });
//     } else {
//         return res;
//     }
// }
