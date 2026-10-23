/* Runs inside the YouTube page: removes ad data from player responses before the player sees it (no ad is ever requested or shown). */
(() => {
  const on = () => { try { return JSON.parse(localStorage.getItem("ytg_s") || "{}").ads !== false; } catch (e) { return true; } };
  const KEYS = ["adPlacements", "playerAds", "adSlots", "adBreakParams"];
  const strip = o => {
    if (!o || typeof o !== "object" || !on()) return o;
    for (const k of KEYS) if (k in o) delete o[k];
    if (o.playerResponse) for (const k of KEYS) delete o.playerResponse[k];
    if (o.response && o.response.playerResponse) for (const k of KEYS) delete o.response.playerResponse[k];
    return o;
  };
  const jp = JSON.parse;
  JSON.parse = function () { return strip(jp.apply(this, arguments)); };
  const rj = Response.prototype.json;
  Response.prototype.json = function () { return rj.apply(this, arguments).then(strip); };
  let v;
  try { Object.defineProperty(window, "ytInitialPlayerResponse", { configurable: true, get() { return v; }, set(x) { v = strip(x); } }); } catch (e) {}

  // Reset any stored 1.35x speed back to normal 1.0x YouTube default
  try {
    localStorage.removeItem("yt-player-playback-rate");
    sessionStorage.removeItem("yt-player-playback-rate");
  } catch (e) {}
})();
