import {shuffle,getStyle,myHand,discard,discardData,deck} from "./define.js";
import {card,deckData} from "./prep.js";





function nextPlayer() {
	window.currentPlayer++; 
	if (window.currentPlayer > otherCount) { window.currentPlayer = 0 }
}

startTurn();
function startTurn() {
	nextPlayer();
	let player = document.querySelector("div[data-playindex=\""+window.currentPlayer+"\"]");
	if (player.dataset.ai == "true") {
		let randomSlot = player.querySelectorAll("div.slot")[Math.floor(Math.random()*8)];
		deck.click();
		drawAnimate(deck.firstElementChild);
		placeAnimate(randomSlot,discard);
		placeAnimate(deck,randomSlot);
		startTurn();
	} else if (player.id = "myHand") {
		drawAction();
	}
}

function includeListener(element,event,daFunction) {
	element.addEventListener(event,daFunction);
	window.listenerList.push([element,event,daFunction]);
}
function purgeListeners() {
	let element,event,daFunction = [];
	for ([element,event,daFunction] of window.listenerList) {
		element.removeEventListener(event,daFunction);
	} window.listenerList = [];
}
function drawAnimate(card) {
	card.classList.add("draw");
}
function placeAnimate(location1, location2, location3=false) { 
	return new Promise(resolve => {
		document.documentElement.style.pointerEvents = "none";
		let card = location1.firstElementChild; 
		let cardCoord = card.getBoundingClientRect(); 
		card.style.setProperty("--cardTop",cardCoord["top"]+"px"); card.style.setProperty("--cardLeft",cardCoord["left"]+"px");
		card.style.setProperty("--cardW",cardCoord["width"]+"px"); card.style.setProperty("--cardH",cardCoord["height"]+"px"); 
		let destCoord = location2.getBoundingClientRect(); console.log({card,cardCoord,destCoord});
		card.style.setProperty("--destTop",destCoord["top"]+"px"); card.style.setProperty("--destLeft",destCoord["left"]+"px"); 
		card.style.setProperty("--destW",destCoord["width"]+"px"); card.style.setProperty("--destH",destCoord["height"]+"px");
		card.classList.remove("draw"); card.classList.add("place");
		card.addEventListener("animationend", event => { 
			location2.appendChild(card); 
			card.classList.remove("place"); 
			card.style.position = "relative";
			document.documentElement.style.pointerEvents = "auto";
			resolve();
		},{once:true});
	});
}

function drawAction() {
	includeListener(discard,"click", fromDiscard);
	includeListener(deck,"click", fromDeck);
	async function fromDiscard(event) { 
		drawAnimate(discard.firstElementChild);
		purgeListeners();	placeAction(discard);
	}
	async function fromDeck(event) {
		if (deckData.length < 1) { shuffle(deckData,discardData); discardData = [] }
		deck.appendChild(deckData.shift().element);
		drawAnimate(deck.firstElementChild);
		purgeListeners();	placeAction(deck);
	}
}
function placeAction(startPosition) {
	for (let slot of myHand.querySelectorAll("div.slot")) { includeListener(slot,"click",swapCards) }
	if (startPosition === deck) { includeListener(discard,"click",trash) }
	async function swapCards(event) {
		let selected = event.target; while(selected.className != "slot") { selected = selected.parentElement }
		if (selected.firstElementChild.dataset.flipped = "true") { selected.firstElementChild.dataset.flipped = "false" }
		if (discard.firstElementChild != null) { 
			discardData.push(new card(discard.firstElementChild.dataset.value,discard.firstElementChild.dataset.special));
			discard.firstElementChild.remove(); console.log(discardData);
		}
		await placeAnimate(selected,discard);
		await placeAnimate(startPosition,selected);
		if (discard.children.length > 1) { discard.firstElementChild.remove() }
		purgeListeners(); startTurn();
	}
	async function trash(event) {
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		await placeAnimate(startPosition,discard);
		purgeListeners(); startTurn();
	}
}

function calculateScore() {
	window.score = 0;
	[topRow,bottomRow] = myHand.querySelectorAll("div.row");
	for (column=0;column<4;column++) {
		topCard = topRow.children[column].firstElementChild; bottomCard = bottomRow.children[column].firstElementChild;
		if (topCard.dataset.value != bottomCard.dataset.value && topCard.dataset.value != "P" && bottomCard.dataset.value != "P") {
			window.score = window.score-Number(topCard.dataset.value)-Number(bottomCard.dataset.value);
		} else if ((topCard.dataset.special == "Reinforcements" || bottomCard.dataset.special == "Reinforcements") && topCard.dataset.value == bottomCard.dataset.value) {
			window.score = window.score+Number(topCard.dataset.value);
		}
	}
}