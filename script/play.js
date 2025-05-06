import {shuffle,getStyle,myHand,discard,discardData,deck,others,cardMoved,card, moveCards} from "./define.js";
import {} from "./prep.js";
const w = window;

w.listenerList = [];

w.playerIndex = 0;
while(true) {

	currentPlayer = w.players["player"+w.playerIndex];
	if (w.playerIndex == 0) { document.documentElement.style.pointerEvents = "auto" }
	else { document.documentElement.style.pointerEvents = "none"} 

	if (w.deckData.length < 1) { shuffle(w.deckData,discardData); discardData = {} }

	if (currentPlayer.ai) {
		let randomSlot = currentPlayer.element.querySelectorAll("div.slot")[Math.floor(Math.random()*8)];
		let newCard = w.deckData.shift();
		deck.appendChild(newCard.element);
		w.cards[randomSlot.firstElementChild.id].flipUp();
		w.cards[randomSlot.firstElementChild.id].move(discard);
		newCard.move(randomSlot);
	}
	else {
		await drawAction().then(placeAction)
	}

	w.playerIndex++; console.log(w.playerIndex == Object.keys(w.players).length);
	if (w.playerIndex == Object.keys(w.players).length) { w.playerIndex = 0 }
}

async function drawAction() { return new Promise(resolve => {
	
	includeListener(discard,"click", fromDiscard); function fromDiscard(event) { 
		w.cards[discard.firstElementChild.id].draw();
		purgeListeners();	resolve(discard);
	}
	
	includeListener(deck,"click", fromDeck); function fromDeck(event) {
		let newCard = w.deckData.shift();
		deck.appendChild(newCard.element);
		w.cards[deck.firstElementChild.id].draw();
		purgeListeners();	resolve(deck);
	}
})};

async function placeAction(start) { return new Promise (resolve => {

	if (start == deck) { includeListener(discard,"click",trash) } function trash() {
		w.cards[deck.firstElementChild.id].move(discard);
		purgeListeners(); resolve();
	}
	
	for (let slot of myHand.querySelectorAll("div.slot")) { includeListener(slot,"click",placeCard) } function placeCard(event) {
		let selected = event.target; while(selected.className != "slot") { selected = selected.parentElement }
		w.cards[selected.firstElementChild.id].flipUp();
		w.cards[selected.firstElementChild.id].move(discard);
		w.cards[start.firstElementChild.id].move(selected);
		resolve();
	}
})};

function includeListener(element,event,daFunction) {
	element.addEventListener(event,daFunction);
	w.listenerList.push([element,event,daFunction]);
}
function purgeListeners() {
	let element,event,daFunction = [];
	for ([element,event,daFunction] of w.listenerList) {
		element.removeEventListener(event,daFunction);
	} w.listenerList = [];
}

function calculateScore() {
	w.score = 0;
	[topRow,bottomRow] = myHand.querySelectorAll("div.row");
	for (column=0;column<4;column++) {
		topCard = topRow.children[column].firstElementChild; bottomCard = bottomRow.children[column].firstElementChild;
		if (topCard.dataset.value != bottomCard.dataset.value && topCard.dataset.special != "Protection" && bottomCard.dataset.special != "Protection") {
			w.score = w.score-Number(topCard.dataset.value)-Number(bottomCard.dataset.value);
		} else if ((topCard.dataset.special == "Reinforcements" || bottomCard.dataset.special == "Reinforcements") && topCard.dataset.value == bottomCard.dataset.value) {
			w.score = w.score+Number(topCard.dataset.value);
		}
	}
}