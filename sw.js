const CACHE="loreto-advent-v4";
const CORE=["./","./index.html","./manifest.webmanifest"];
const REMOTE=["https://pcdn1.i-web.ch/kisA815v1V-X5kCVQ9U_HLFqWIo%3D/0x0/smart/filters%3Astrip_exif%28%29/s46/0/0/63b9ab4dbf116"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(async cache=>{
      await cache.addAll(CORE);
      for(const url of REMOTE){
        try{
          const r=await fetch(url,{mode:"no-cors"});
          await cache.put(url,r);
        }catch(e){}
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  event.respondWith(
    caches.match(event.request).then(cached=>cached || fetch(event.request).then(resp=>{
      const clone=resp.clone();
      caches.open(CACHE).then(c=>c.put(event.request,clone)).catch(()=>{});
      return resp;
    }).catch(()=>caches.match("./index.html")))
  );
});
