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

async function offlineFetch(source, callback) {
  let request = new CustomEvent("request", {
    source: source,
    currentTurn: w.currentTurn,
    playerLayout: w.playerLayout
  });
  document.addEventListener("response", callback);
  document.dispatchEvent(request);
}

async function fetchadids(source, callback) {
  if (sessionStorage.getItem("mode") == "offline") {
    offlineFetch(source, callback);
  } else {
    let source = sessionStorage.getItem("source");
    throw new Error("API endpoint not configured you silly goose");
    /*serverFetch(source,"json",{
      method: "POST",
      body: { 
        currentTurn: w.currentTurn,
        playerLayout: w.playerLayout,
      },
    }, callback);*/
  }
}