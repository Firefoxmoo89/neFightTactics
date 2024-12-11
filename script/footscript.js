// Deal
const myHand = document.querySelector("#myHand")
const discard = document.querySelector("#discard");
const deck = document.querySelector("#deck");
const draw = document.querySelector("#draw");

for (let slot of myHand.querySelectorAll("div.slot")) {
	newCard = deckData.shift();
	slot.appendChild(newCard.element);
}
for (let slot of myHand.firstElementChild.querySelectorAll("div.slot")) {
	slot.firstChild.dataset.flipped = "true";
}
document.querySelector("#discard").appendChild(deckData.shift().element);

function drawAction() {
	function fromDiscard(event) { 
		draw.appendChild(discard.firstChild);
		discard.removeEventListener("click",fromDiscard);
		deck.removeEventListener("click",fromDeck);
		placeAction();
	}
	function fromDeck(event) {
		draw.appendChild(deckData.shift().element);
		discard.removeEventListener("click",fromDiscard);
		deck.removeEventListener("click",fromDeck);
		placeAction();
	}
	discard.addEventListener("click", fromDiscard);
	deck.addEventListener("click", fromDeck);
}
function placeAction() {
	function swapCards(event) {
		selected = event.target; while(selected.className != "slot") { selected = selected.parentElement }
		if (selected.firstElementChild.dataset.flipped = "true") { selected.firstElementChild.dataset.flipped = "false" }
		discard.firstElementChild.remove();
		discard.appendChild(selected.firstElementChild);
		selected.appendChild(draw.firstElementChild);
		for (let slot of myHand.querySelectorAll("div.slot")) {	slot.removeEventListener("click",swapCards) }
		drawAction();
	}
	for (let slot of myHand.querySelectorAll("div.slot")) { slot.addEventListener("click",swapCards) }
}

drawAction();