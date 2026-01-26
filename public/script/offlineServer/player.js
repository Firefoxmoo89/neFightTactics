import * as rad from "../radicalModule.js" 

export function generateToken(tokenList=[]) {
	let final = undefined; let index;
	while (final == undefined || tokenList.includes(final)) {
		final = "";
		for (let i=0; i<4; i++) {
			index = rad.getRandomInt(rad.alphanumeric.length);
			final += rad.alphanumeric[index];
		}
	} return final
}

export var defaultProfile = {
	name: "Guest",
	icon: "/image/smileyface.svg",
	color: "#791C20ff",
	type: "player"
}








/*const w = window;
w.idList = 0;
w.players = {};

class Player {
	constructor(name, color, iconRef="smileyface.svg", bot=false, user=false) {
		this.name = name;
		this.id = w.idList; w.idList++;
		this.color = color+"9e";
		this.bot = bot; this.user = user;
		this.iconRef = "../image/"+iconRef;
		this.element = document.createElement("div"); this.element.id = "player"+this.id;
		this.element.innerHTML = "<div> \
			<div class=\"playerIcon\"></div> \
				<div id=\"row"+this.id+".1\" class=\"row\"> \
					<div id=\"slot"+this.id+".1\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".2\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".3\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".4\" class=\"slot\"></div> \
				</div><div id=\"row"+this.id+".2\" class=\"row\"> \
					<div id=\"slot"+this.id+".5\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".6\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".7\" class=\"slot\"></div> \
					<div id=\"slot"+this.id+".8\" class=\"slot\"></div> \
				</div> \
			</div>";
		if (user) { myHand.appendChild(this.element) }
		else { others.appendChild(this.element) }
		w.players[this.element.id] = this;
		this.element.style.backgroundColor = this.color;
		this.element.querySelector("div.playerIcon").style.backgroundImage = "url(\""+this.iconRef+"\")";
		this.element.querySelector("div.playerIcon").innerText = this.name;
	}
	getSlot(position) {	return this.element.querySelectorAll(".slot")[position] }
	slotIndex(slot) { 
		let slotList = this.element.querySelectorAll(".slot"); 
		for (let i=0;i<slotList.length;i++) { 
			if (slot == slotList[i]) { return i }
		} return null
	}
	cardIndex(card) { return this.slotIndex(card.parentSlot()) }
	cardInIndex(index) {
		return w.cards[this.element.querySelectorAll("div.card")[index].id]
	}
	knock() {
		let knocked = new CustomEvent("knocked", { detail: { player: this } });
		document.dispatchEvent(knocked);
	}
	playTurn() {
		console.log("I'm turning the wheel");
	}
}
	*/