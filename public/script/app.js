const w = window;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}
const setAppHeight = () => {
  document.documentElement.style.setProperty('--appHeight', `${w.innerHeight}px`);
};

w.addEventListener('resize', setAppHeight);
w.addEventListener('orientationchange', setAppHeight);
setAppHeight();

export var storage = new Proxy({
  clear() { localStorage.clear() }
}, {
  get(target, prop) { 
    if (typeof target[prop] == "function") { return target[prop] }
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    let value = localStorage.getItem(prop); console.log("get",target,prop);
    return value != null ? JSON.parse(value) : undefined 
  },
  set(_, prop, value) { 
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    console.log(prop,value);
    localStorage.setItem(prop,JSON.stringify(value)); return true 
  },
  deleteProperty(_, prop) { 
    if (typeof prop !== 'string') throw new TypeError('Keys must be strings');
    localStorage.removeItem(prop); return true 
  }
}); w.storage = storage;

let defaultProfile = {
  name: "Guest",
  icon: "/image/smileyface.svg",
  color: "#791C20ff",
  type: "player"
};
if (!storage.profile) { storage.profile = defaultProfile }
for (let item of ["name","icon","color","type"]) {
  if (storage.profile[item] == undefined) { storage.profile[item] = defaultProfile[item] }
}

async function serverFetch(source, type, options, daFunction=false) {
	if (type == "json") { function process(response){return response.json()} } 
	else if (type == "text") { function process(response){return response.text()} }
	else { function process(response){return response.text()} }
	await fetch(source,options).then(process)
	.then(data => { if (daFunction != false) { daFunction(data) } else { console.log("fetch at",source,":",data) } })
}

async function offlineFetch(source, options, callback) {
  Object.assign(options, {
    source: source,
  });
  let request = new CustomEvent("request", {detail: options}); 
  document.addEventListener("response", event => { callback(event.detail) }, {once:true});
  document.dispatchEvent(request);
}

export async function fetchadids(source, options, callback) {
  if (storage.gameData.mode.toLowerCase() == "offline") {
    offlineFetch(source, options, callback);
  } else {
    let source = storage.source;
    console.error("API endpoint not configured you silly goose");
    /*serverFetch(source,"json",{
      method: "POST",
      body: { 
        currentTurn: w.currentTurn,
        playerLayout: w.playerLayout,
      },
    }, callback);*/
  }
}

export async function checkGameData() {
  if (sessionStorage.getItem("sessionGame") == null) {
    if (storage.game == undefined) { 
      if (window.location.pathname != "/home") { window.location.replace("/home") }
    } else {
      let promptText = "Want to load your old game data?\n";
      for (let [key, value] of Object.entries(storage.game)) { promptText += key+": "+value+"\n" }
      if (confirm(promptText)) {
        sessionStorage.setItem("sessionGame",true);
        if (storage.game.status == "In Lobby") { window.location.replace("/lobby") }
        else { window.location.replace("/play") }
      } else { 
        storage.clear();
        window.location.replace("/home");
      }
    }
  }
  if (storage.game) {
    if (storage.game.mode.toLowerCase() == "offline") {
      await import("/script/offlineServer/server.js"); 
    } 
  }
} checkGameData();