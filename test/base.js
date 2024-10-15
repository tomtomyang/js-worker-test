addEventListener("fetch", (event) => {
  console.log(event.request.url);

  if (event.request.url.includes("test")) {
    event.respondWith(new Response("Hello Test!"));
    return;
  }
  
  event.respondWith(new Response("Hello Worker!"));
});
