import {shuffle,getStyle,myHand,discard,discardData,deck,others,cardMoved,card, moveCards, cardInSlot} from "./define.js";
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
		async function aiTurn() { return new Promise(resolve => {
			let selectedSlot = currentPlayer.element.querySelectorAll("div.slot")[Math.floor(Math.random()*8)];
			let selectedCard = cardInSlot(selectedSlot);
			let newCard = w.deckData.shift();
			deck.appendChild(newCard.element);
			selectedCard.flipUp();
			selectedCard.moveTo(discard);
			newCard.moveTo(selectedSlot);
			newCard.element.addEventListener("animationend",event => { resolve() } );
		})}; await aiTurn();
	}
	else {
		await drawAction().then(placeAction)
	}

	w.playerIndex++;
	if (w.playerIndex == Object.keys(w.players).length) { w.playerIndex = 0 }
}

async function drawAction() { return new Promise(resolve => {
	
	includeListener(discard,"click", fromDiscard); function fromDiscard(event) { 
		cardInSlot(discard).draw();
		purgeListeners();	resolve(cardInSlot(discard));
	}
	
	includeListener(deck,"click", fromDeck); function fromDeck(event) {
		let newCard = w.deckData.shift();
		deck.appendChild(newCard.element);
		cardInSlot(deck).draw();
		purgeListeners();	resolve(cardInSlot(deck));
	}
})};

async function placeAction(newCard) { return new Promise (resolve => {

	if (newCard.element == deck.firstElementChild) { includeListener(discard,"click",trash) } function trash() {
		newCard.moveTo(discard);
		purgeListeners(); resolve();
	}
	
	for (let slot of myHand.querySelectorAll("div.slot")) { includeListener(slot,"click",placeCard) } function placeCard(event) {
		let selectedSlot = event.target; while(selectedSlot.className != "slot") { selectedSlot = selectedSlot.parentElement }
		let selectedCard = cardInSlot(selectedSlot);
		selectedCard.flipUp();
		selectedCard.moveTo(discard);
		newCard.element.addEventListener("animationend",event => { resolve() },{once:true});
		newCard.moveTo(selectedSlot);
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