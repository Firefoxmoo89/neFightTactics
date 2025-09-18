import {Player} from define.js

class botPlayer extends Player {
	constructor(name) {
		let character = characters[name];
		super(name+" (bot)", character["color"], character["iconRef"], true, false);
		this.character = character;
		this.strategy = this.character["strategy"];
	}
	async playTurn() { 
		return new Promise(resolve => { 
			setTimeout(() => {	
				this.strategy(resolve)
			},100);
		})
	}
}

var characters = {
	"George": {
		"color": "#aa4412",
		"iconRef": "smileyface.svg",
		"strategy": (resolve) => {
			let unfulfilledCards = []; let selectedCard = null; let drawCard = cardInSlot(discard); console.log(drawCard);
			for (let position=0;position<=3;position++) {
				let soldierCard = cardInSlot(currentPlayer.getSlot(position));
				let captainCard = cardInSlot(currentPlayer.getSlot(position+4));
				if (captainCard.value != "P" && soldierCard.value != "P" && captainCard.value != soldierCard.value) {
					unfulfilledCards.push(captainCard);
					if (soldierCard.isUp()) { unfulfilledCards.push(soldierCard) }
				} else if (soldierCard.isDown()) { unfulfilledCards.push(captainCard) }
			} 
			if (unfulfilledCards.length == 0) { currentPlayer.knock() }

			if (drawCard.value == "P") { 
				let randomIndex = getRandomInt(unfulfilledCards.length);
				selectedCard = unfulfilledCards[randomIndex].partnerCard();
			}	else {
				for (let daCard of unfulfilledCards) {
					if (daCard.value == drawCard.value) { selectedCard = daCard.partnerCard(); break }
				}
				if (selectedCard == null) { 
					drawCard = w.deckData.shift();
					deck.appendChild(drawCard.element);
					drawCard.draw();
					if (drawCard.value == "P") {
						let randomIndex = getRandomInt(unfulfilledCards.length);
						selectedCard = unfulfilledCards[randomIndex].partnerCard();
					}
					for (let daCard of unfulfilledCards) {
					if (daCard.value == drawCard.value) { selectedCard = daCard.partnerCard(); break }
					}
					if (selectedCard == null) { 
						let flippedList = currentPlayer.element.querySelector(".row").querySelectorAll("div.card.flipped");
						if (flippedList.length > 1) {
							let randomIndex = getRandomInt(flippedList.length);
							selectedCard = w.cards[flippedList[randomIndex].id];
						} else { selectedCard = discard }
					}
				}
			}
			let selectedSlot = selectedCard;
			if (selectedCard != discard) {
				selectedSlot = selectedCard.parentSlot();
				selectedCard.flipUp();
				selectedCard.moveTo(discard) 
			}
			drawCard.moveTo(selectedSlot);
			drawCard.element.addEventListener("animationend", event => { resolve(); }, { once: true });
		}
	},
	"Sharon": {
		"color": "#4545bb",
		"iconRef": "smileyface.svg",
		"strategy": (resolve) => {
			resolve();
			return "shrug for now";
		}
	}
}