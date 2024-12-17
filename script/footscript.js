// Deal
const myHand = document.querySelector("#myHand")
const discard = document.querySelector("#discard");
const deck = document.querySelector("#deck");
const drawContainer = document.querySelector("#drawContainer");
const draw = document.querySelector("#draw");
const tracker = document.querySelector("#score");

for (let slot of myHand.querySelectorAll("div.slot")) {
	newCard = deckData.shift();
	slot.appendChild(newCard.element);
}
for (let slot of myHand.firstElementChild.querySelectorAll("div.slot")) {
	slot.firstChild.dataset.flipped = "true";
}
document.querySelector("#discard").appendChild(deckData.shift().element);

window.listenerList = [];
function includeListener(element,event,daFunction) {
	element.addEventListener(event,daFunction);
	window.listenerList.push([element,event,daFunction]);
}
function purgeListeners() {
	for ([element,event,daFunction] of window.listenerList) {
		element.removeEventListener(event,daFunction);
	} window.listenerList = [];
}

function drawAction() {
	drawContainer.style.display = "none";
	includeListener(discard,"click", fromDiscard);
	includeListener(deck,"click", fromDeck);
	function fromDiscard(event) { 
		draw.appendChild(discard.firstElementChild);
		purgeListeners();	placeAction();
	}
	function fromDeck(event) {
		draw.appendChild(deckData.shift().element);
		purgeListeners();	placeAction(true);
	}
}
function placeAction(fromDeck=false) {
	drawContainer.style.display = "flex"; console.log("sup");
	for (let slot of myHand.querySelectorAll("div.slot")) { includeListener(slot,"click",swapCards) }
	if (fromDeck) { includeListener(discard,"click",trash) }
	function swapCards(event) {
		selected = event.target; while(selected.className != "slot") { selected = selected.parentElement }
		if (selected.firstElementChild.dataset.flipped = "true") { selected.firstElementChild.dataset.flipped = "false" }
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		discard.appendChild(selected.firstElementChild);
		selected.appendChild(draw.firstElementChild);
		purgeListeners();	drawAction(); calculateScore();
	}
	function trash(event) {
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		discard.appendChild(draw.firstElementChild);
		purgeListeners();	drawAction(); calculateScore();
	}
}

calculateScore(); drawAction();

function calculateScore() {
	tracker.innerText = 0;
	[topRow,bottomRow] = myHand.querySelectorAll("div.row");
	for (column=0;column<4;column++) {
		topCard = topRow.children[column].firstElementChild; bottomCard = bottomRow.children[column].firstElementChild;
		if (topCard.dataset.value != bottomCard.dataset.value && topCard.dataset.value != "P" && bottomCard.dataset.value != "P") {
			tracker.innerText = Number(tracker.innerText)-Number(topCard.dataset.value)-Number(bottomCard.dataset.value);
		} else if ((topCard.dataset.special == "Reinforcements" || bottomCard.dataset.special == "Reinforcements") && topCard.dataset.value == bottomCard.dataset.value) {
			tracker.innerText = Number(tracker.innerText)+Number(topCard.dataset.value);
		}
	}
	if (Number(tracker.innerText) > 0) { tracker.innerText = "+"+tracker.innerText }
}