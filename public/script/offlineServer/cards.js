const w = window;
w.cardCount = 0;
w.cards = {};

function shuffle(array, array2=false) {
	for (let i=array.length-1;i>0;i--) {
		let j = Math.floor(Math.random() * (i + 1));
		if (!array2) { [array[i],array[j]] = [array[j],array[i]] }
		else { [array[i],array[j]] = [array2[j],array2[i]] }
	}
}

var cardMoved = new CustomEvent("cardMoved", { detail: { id: 1234 } });

class Card {
	constructor(value,special=false) {
		this.value = value;
		this.special = special;
		this.id = w.cardCount; w.cardCount++;
		this.faceup = true; this.facedown = false;
		w.cards[this.id] = this;
	}
	draw() { this.element.classList.add("draw") }
	flipUp() { 
		if (this.element.classList.contains("flipped")) { this.element.classList.remove("flipped") } 
		this.faceup = true; this.facedown = false;
	} isUp() { return this.faceup }
	flipDown() { 
		if (!this.element.classList.contains("flipped")) { this.element.classList.add("flipped") } 
		this.faceup = false; this.facedown = true;
	} isDown() { return this.facedown }
	moveTo(destination) {
		`"Destination" parameter must be the slot that the card is moving to`
		let start = this.element.getBoundingClientRect();
		this.element.style.setProperty("--x1",start["x"]+"px");	
		this.element.style.setProperty("--y1",start["y"]+"px");
		this.element.style.setProperty("--w1",start["width"]+"px");
		this.element.style.setProperty("--h1",start["height"]+"px");
		let end = destination.getBoundingClientRect();
		this.element.style.setProperty("--x2",end["x"]+"px");	
		this.element.style.setProperty("--y2",end["y"]+"px");
		this.element.style.setProperty("--w2",end["width"]+"px");
		this.element.style.setProperty("--h2",end["height"]+"px");
		this.element.classList.remove("draw");
		this.element.classList.add("move");
		document.querySelector("#root").appendChild(this.element);
		this.element.addEventListener("animationend",()=>{  
			cardMoved = new CustomEvent("cardMoved", { detail: { id: this.id } });
			document.dispatchEvent(cardMoved);
			destination.appendChild(this.element);
			this.element.classList.remove("move");
		});
	}
	partnerCard() { 
		let currentOwner = this.owner(); 
		if (currentOwner != null) {
			let index = currentOwner.cardIndex(this);
			if (index < 4) { index += 4 } else { index -= 4 }
			return currentOwner.cardInIndex(index);
		} return null
	}
	owner() { 
		for (let player of Object.values(w.players).slice(1)) { 
			if (player.cardIndex(this) != null) { return player }
		} return null
	}
	parentSlot() { return this.element.parentElement }
}
function moveCards(...objectPairs) {
	`Enter cards and their destinations in pairs. ex: {card1,discard},{card2,slot1},...etc`
	for ([daCard,destination] of objectPairs) {	daCard.move(destination) }
}
function cardInSlot(slot) {
	`Pass in a slot in element form to return the card object within`
	return w.cards[slot.lastElementChild.id]
}