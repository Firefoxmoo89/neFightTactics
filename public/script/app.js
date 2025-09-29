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

w.getRandomInt = (min, max=null) => {
		if (max == null) { max = min; min = 0 }	max--;
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
  }); console.log(options);
  let request = new CustomEvent("request", {detail: options}); 
  console.log(request);
  document.addEventListener("response", event => { callback(event.detail) }, {once:true});
  document.dispatchEvent(request);
}

export async function fetchadids(source, options, callback) {
  if (JSON.parse(localStorage.getItem("gameData")).mode.toLowerCase() == "offline") {
    offlineFetch(source, options, callback);
  } else {
    let source = localStorage.getItem("source");
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
    if (localStorage.getItem("gameData") == null) { window.location.replace("/home") }
    else {
      let gameData = JSON.parse(localStorage.getItem("gameData"));
      let promptText = "Want to load your old game data?\n";
      for (let [key, value] of Object.entries(gameData)) { promptText += key+": "+value+"\n" }
      if (confirm(promptText)) {
        sessionStorage.setItem("sessionGame",true);
      } else { window.location.replace("/home") }
    }
  }
  let gameData = JSON.parse(sessionStorage.getItem("gameData"));
  if (!gameData.mode) {
    window.location.replace("/home");
  } else if (gameData.mode.toLowerCase() == "offline") {
    await import("/script/offlineServer/server.js"); 
  } 
}