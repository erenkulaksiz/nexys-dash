if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),d={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-4f8070a3"],(function(e){"use strict";importScripts("fallback-06djOqtJMZ04Dkvwhfep5.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/06djOqtJMZ04Dkvwhfep5/_buildManifest.js",revision:"2b4be4b39eb1ea85e428cf3f97e7d73e"},{url:"/_next/static/06djOqtJMZ04Dkvwhfep5/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0c428ae2-509a46b8a0140372.js",revision:"509a46b8a0140372"},{url:"/_next/static/chunks/152.c57d2f09ae82a264.js",revision:"c57d2f09ae82a264"},{url:"/_next/static/chunks/17007de1-dc19db7e49d53a18.js",revision:"dc19db7e49d53a18"},{url:"/_next/static/chunks/1a48c3c1-b783b53113cfe690.js",revision:"b783b53113cfe690"},{url:"/_next/static/chunks/1bfc9850-8deb26632ba27a09.js",revision:"8deb26632ba27a09"},{url:"/_next/static/chunks/252f366e-af822d8b5638a041.js",revision:"af822d8b5638a041"},{url:"/_next/static/chunks/328-d86b26afbcfe8adc.js",revision:"d86b26afbcfe8adc"},{url:"/_next/static/chunks/465.1938d3ee3209f61a.js",revision:"1938d3ee3209f61a"},{url:"/_next/static/chunks/534.19cb310cb02865dc.js",revision:"19cb310cb02865dc"},{url:"/_next/static/chunks/537-10a374ac4ea5c496.js",revision:"10a374ac4ea5c496"},{url:"/_next/static/chunks/608.0290dcf46652d472.js",revision:"0290dcf46652d472"},{url:"/_next/static/chunks/683-5bc3c91453e5d686.js",revision:"5bc3c91453e5d686"},{url:"/_next/static/chunks/734-8211668a082637e3.js",revision:"8211668a082637e3"},{url:"/_next/static/chunks/737-3db60ba04ee1f48d.js",revision:"3db60ba04ee1f48d"},{url:"/_next/static/chunks/78e521c3-bba2a9b1c4f867de.js",revision:"bba2a9b1c4f867de"},{url:"/_next/static/chunks/831-55705b00e3eb2c69.js",revision:"55705b00e3eb2c69"},{url:"/_next/static/chunks/832-cef1cfd32198b877.js",revision:"cef1cfd32198b877"},{url:"/_next/static/chunks/853.e7ab102d048cdc69.js",revision:"e7ab102d048cdc69"},{url:"/_next/static/chunks/857-1805016c23c80f95.js",revision:"1805016c23c80f95"},{url:"/_next/static/chunks/95b64a6e-6c8838eaa5a9d5cd.js",revision:"6c8838eaa5a9d5cd"},{url:"/_next/static/chunks/ae51ba48-6219ef14f56edc97.js",revision:"6219ef14f56edc97"},{url:"/_next/static/chunks/c31f1870-f1cc417a4f98e29f.js",revision:"f1cc417a4f98e29f"},{url:"/_next/static/chunks/d0c16330-cd753d99bd3d2044.js",revision:"cd753d99bd3d2044"},{url:"/_next/static/chunks/d64684d8-8985bc57cc1e4ced.js",revision:"8985bc57cc1e4ced"},{url:"/_next/static/chunks/d70ca943-f5068a32c911bebc.js",revision:"f5068a32c911bebc"},{url:"/_next/static/chunks/d7eeaac4-a6a518d05c3918f6.js",revision:"a6a518d05c3918f6"},{url:"/_next/static/chunks/ee8b1517.a964c8e148cca93a.js",revision:"a964c8e148cca93a"},{url:"/_next/static/chunks/framework-2c79e2a64abdb08b.js",revision:"2c79e2a64abdb08b"},{url:"/_next/static/chunks/main-2236e4cb36f607ef.js",revision:"2236e4cb36f607ef"},{url:"/_next/static/chunks/pages/404-1a3328abf9a8de90.js",revision:"1a3328abf9a8de90"},{url:"/_next/static/chunks/pages/_app-2bce420e22d5720c.js",revision:"2bce420e22d5720c"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/_offline-1b1707410c7050c0.js",revision:"1b1707410c7050c0"},{url:"/_next/static/chunks/pages/admin-f5e8b56c0e12deaf.js",revision:"f5e8b56c0e12deaf"},{url:"/_next/static/chunks/pages/auth/forgot-password-9ca1ccecb41a7238.js",revision:"9ca1ccecb41a7238"},{url:"/_next/static/chunks/pages/auth/signin-578e2ebe1d8f0174.js",revision:"578e2ebe1d8f0174"},{url:"/_next/static/chunks/pages/auth/signup-97819a9631557ac6.js",revision:"97819a9631557ac6"},{url:"/_next/static/chunks/pages/auth/verify-8e8c8e682528cd7d.js",revision:"8e8c8e682528cd7d"},{url:"/_next/static/chunks/pages/feedback-bce9c31c78196834.js",revision:"bce9c31c78196834"},{url:"/_next/static/chunks/pages/index-8d836f888da1ae16.js",revision:"8d836f888da1ae16"},{url:"/_next/static/chunks/pages/naz-dc65c00e4683e17a.js",revision:"dc65c00e4683e17a"},{url:"/_next/static/chunks/pages/new-e51be102e791957e.js",revision:"e51be102e791957e"},{url:"/_next/static/chunks/pages/plan-1aa776de37345aeb.js",revision:"1aa776de37345aeb"},{url:"/_next/static/chunks/pages/privacy-policy-15e6f315b09a6d1b.js",revision:"15e6f315b09a6d1b"},{url:"/_next/static/chunks/pages/project/%5Bid%5D-c02b9452382ab59f.js",revision:"c02b9452382ab59f"},{url:"/_next/static/chunks/pages/project/%5Bid%5D/batch/%5BbatchId%5D-f69c7e9d4c3e1301.js",revision:"f69c7e9d4c3e1301"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-5f48b536b02480d1.js",revision:"5f48b536b02480d1"},{url:"/_next/static/css/7de943f8e0823dd5.css",revision:"7de943f8e0823dd5"},{url:"/_next/static/media/logo_black.e925d516.png",revision:"485e45caed2faf8ae33ae838cc870c5c"},{url:"/_next/static/media/logo_white.3c64c7d4.png",revision:"9cab3eeb9228cdd6fbf09965a89defa7"},{url:"/_offline",revision:"06djOqtJMZ04Dkvwhfep5"},{url:"/favicon.ico",revision:"4813426490588ed04436130b846aa7ab"},{url:"/icons/android-chrome-192x192.png",revision:"f15fe21069aa96f5b3dfa1b426eeb6a4"},{url:"/icons/android-chrome-384x384.png",revision:"5a8959ba0c6eb81aa79d1c3d8e9106a3"},{url:"/icons/icon-512x512.png",revision:"53e57438ef88cf3a1fe9333f3a8614fa"},{url:"/images/avatar.png",revision:"a26ef93d5fa9609ca680dde60149aa06"},{url:"/images/beams.png",revision:"d7810600ca171f7494906c5e8d9a2090"},{url:"/images/logo_black.png",revision:"485e45caed2faf8ae33ae838cc870c5c"},{url:"/images/logo_white.png",revision:"9cab3eeb9228cdd6fbf09965a89defa7"},{url:"/images/ne/ne1.jpg",revision:"0ea252474a07a4e9bf9f85855dd81b5b"},{url:"/images/ne/ne2.jpg",revision:"eead069c49d889139c6734475ece534b"},{url:"/images/ne/ne3.jpg",revision:"0c25d2d82db3a7abb02af89a7f267a06"},{url:"/images/ne/ne4.jpg",revision:"1bc44059f298e506fddcffb7265937d4"},{url:"/images/ne/ne5.jpg",revision:"c7e8fc6eaf477ecee8dadb37d9392740"},{url:"/images/ne/ne6.jpg",revision:"06ec5a5b2c81d5740bc3f905af50b3af"},{url:"/images/ne/ne7.jpg",revision:"b1d1d22daaab8318726136f4b32601a1"},{url:"/images/ne/ne8.jpg",revision:"bb72056b81428e3d978a831fccdf3b41"},{url:"/images/nexys_black.png",revision:"aef3daf8552c711d92d571b7cc0c576c"},{url:"/images/nexys_white.png",revision:"d88f653df756f01e14f46a7a7776cdcc"},{url:"/images/serhat.png",revision:"32402285d4e0d871762e97ddf704e235"},{url:"/manifest.json",revision:"f825059c049739ad2b62c0a6b6e8cfa3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
