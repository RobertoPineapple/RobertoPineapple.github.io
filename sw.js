var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/css/bootstrap.min.css',
  '/css/estilos.css',
  '/js/app.js',
  '/img/01.png',
  '/img/02.png',
  '/img/03.png',
  '/img/logo.png',
  '/img/logo2.png'
];

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

importScripts('js/sw-utils.js'); 

const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './favicon.ico',
  '/css/bootstrap.min.css',
  '/css/estilos.css',
  '/js/app.js',
  '/img/01.png',
  '/img/02.png',
  '/img/03.png',
  '/img/logo.png',
  '/img/logo2.png',
  './js/app.js',
  './js/modal.js',
  './js/navbar.js'
];

const APP_SHELL_INMUTABLE =[
  'https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900',
  'https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i',
  'https://kit.fontawesome.com/a3455e2a7c.js',
  './css/estilos.css',
  './css/bootstrap.min.css',
  './js/libs/jquery.js'
]

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache open!');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
      cache.addAll( APP_SHELL);
  });

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
      cache.addAll( APP_SHELL_INMUTABLE);
  });

  e.waitUntil( Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activate', e => {

  //eliminar el cache anterior
  const respuesta = caches.keys().then( keys => {
      //recorrrer los caches
      keys.forEach(key => {
          if(key != STATIC_CACHE && key.includes('static')){
              return caches.delete(key);
          }
      });
  });

  e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {

  const respuesta = caches.match( e.request).then(res => {
      //si esta en el cache
      if(res){
          return res;
      } else {
          //console.log(e.request.url);
          //subir cache dynamic
          return fetch(e.request).then(newRes =>{
              return actualizarCacheDinamico(DYNAMIC_CACHE, e.res, newRes);
          })
      }
  })    

  e.waitUntil(respuesta);
});
