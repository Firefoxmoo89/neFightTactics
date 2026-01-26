import * as App from "./app.js"

await App.fetchadids("/lobby", {register: true, profile: App.storage.profile}, data => {
	App.storage.profile = data.profile;
});

await App.fetchadids("/lobby", {botData: true}, data => {
	App.storage.botData = data.botData;
});

document.querySelector("#start").addEventListener("click", event => {
	App.fetchadids("/lobby", { startGame: true }, data => {
		if (data.success) { window.location.href = "/play" }
	});
});

let typeList = document.querySelectorAll("select.type");
for (let typeSelect of typeList) {
	typeSelect.addEventListener("change", event => {

		let daValue = event.target.value.toLowerCase(); let array = []; console.log("daValue",daValue);
		if (daValue == "bot") { array = Object.keys(App.storage.botData) }
		else if (daValue == "player") { 
			for (let player of App.storage.gameData.players) { array.push(player.name) }
		}
		
		let daSlot = event.target; while (!daSlot.className.includes("slot")) { daSlot = daSlot.parentElement }
		let daName = daSlot.querySelector("select.name");
		let endText = "";

		if (array.length == 0) { daName.innerText = "" }
		else {
			for (let character of array) {
				endText += "<option>"+character+"</option>";
			} daName.innerHTML = endText;
		}
	});
}

function regularUpdate(data=undefined) {
	if (data != undefined) {
		if (data.players) { App.storage.players = data.players }
		if (data.startGame) { window.location.href = "/play" }
	}
	App.fetchadids("/lobby", {
		update: true, 
		players: App.storage.players
	}, regularUpdate);
} regularUpdate();