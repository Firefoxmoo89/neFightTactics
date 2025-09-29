import * as App from "./app.js"

await App.checkGameData();
var gameData = localStorage.getItem("gameData");

await App.fetchadids("/lobby", {botData: true}, data => {
	localStorage.setItem("botData",JSON.stringify(data.botData));
});

let typeList = document.querySelectorAll("select.type");
for (let typeSelect of typeList) {
	typeSelect.addEventListener("change", event => {

		let daValue = event.target.value.toLowerCase(); let array = []; console.log("daValue",daValue);
		if (daValue == "bot") { array = Object.keys(JSON.parse(localStorage.botData)) }
		else if (daValue == "player") { array = Object.keys(JSON.parse(localStorage.game.players)) }
		
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

function regularUpdate(data) {
	if (data) {
		console.log();
	}
	App.fetchadids("/lobby", {update: true}, regularUpdate);
}