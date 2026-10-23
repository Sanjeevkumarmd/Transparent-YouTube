// Background Service Worker for YT Gold Glass
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req && req.type === "GET_SPONSORS" && req.videoId) {
    (async () => {
      try {
        const vid = req.videoId;
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(vid));
        const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
        const prefix = hash.slice(0, 4);
        const res = await fetch(`https://sponsor.ajay.app/api/skipSegments/${prefix}?service=YouTube&categories=["sponsor","selfpromo"]`);
        if (!res.ok) { sendResponse([]); return; }
        const data = await res.json();
        const match = data.find(item => item.videoID === vid);
        sendResponse(match && match.segments ? match.segments : []);
      } catch (e) {
        sendResponse([]);
      }
    })();
    return true; // keep message channel open for async response
  }
});
