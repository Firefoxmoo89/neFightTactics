const w = window;

const rootDiv = document.querySelector("#root");
const menuDiv = rootDiv.querySelector("#menu"); 

const onlineDiv = menuDiv.querySelector("#online");
menuDiv.querySelector("#onlineButton").addEventListener("click", event => {
	if (onlineDiv.classList.contains("hidden")) { onlineDiv.classList.remove("hidden") }
	else { onlineDiv.classList.add("hidden") }
});
onlineDiv.querySelector("#closeOnline").addEventListener("click", event => {
	onlineDiv.classList.add("hidden"); console.log("pressed close online");
});

const localDiv = menuDiv.querySelector("#local");
menuDiv.querySelector("#localButton").addEventListener("click", event => {
	if (localDiv.classList.contains("hidden")) { localDiv.classList.remove("hidden") }
	else { localDiv.classList.add("hidden") }
});
localDiv.querySelector("#closeLocal").addEventListener("click", event => {
	localDiv.classList.add("hidden");
});

const offlineButton = menuDiv.querySelector("#offlineButton");
offlineButton.addEventListener("click", event => {
	sessionStorage.setItem("gameMode","offline");
	localStorage.setItem("gameMode","offline");
	window.location.href = "/lobby";
});

const settingsDiv = menuDiv.querySelector("#settings");
menuDiv.querySelector("#settingsButton").addEventListener("click", event => {
	if (settingsDiv.classList.contains("hidden")) { settingsDiv.classList.remove("hidden") }
	else { settingsDiv.classList.add("hidden") }
});
settingsDiv.querySelector("#closeSettings").addEventListener("click", event => {
	settingsDiv.classList.add("hidden");
});

function changeArtwork() {
	let artworkList = document.querySelectorAll("div.artwork div.img"); let name;
	if (artworkList[0].style.display != "none") {
		for (let artwork of artworkList) {
			artwork.parentElement.classList.remove("full");
			let index = w.getRandomInt(0,12);
			if (index > 6) { 
				name = ["add","assassin","back","extra","protect"][index-7];
				if (name == "back") { artwork.parentElement.classList.add("full")	}
			}
			else { name = index.toString() }
			artwork.style.backgroundImage = "url('/image/"+name+".png')";
		}
	}
} changeArtwork();
setInterval(changeArtwork,10000);