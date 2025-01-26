const myHand = document.querySelector("#myHand").firstElementChild;
const discard = document.querySelector("#discard");
const deck = document.querySelector("#deck");
const drawContainer = document.querySelector("#drawContainer");
const draw = document.querySelector("#draw");
const others = document.querySelector("#others");
window.score = 0;

// Setup other players
otherCount = 2;
for (let i=0;i<otherCount;i++) {
	others.innerHTML += "<div data-playindex=\""+i+"\" data-ai=\"true\"> \
		<div> \
		<div class=\"playerIcon\"></div> \
			<div class=\"row\"> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
			</div><div class=\"row\"> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
				<div class=\"slot\"></div> \
			</div> \
		</div></div>";
	myHand.parentElement.dataset.playindex = otherCount;
}

// Deal deck into players hands
allSlots = [].concat(Array.from(others.querySelectorAll("div.slot")),Array.from(myHand.querySelectorAll("div.slot")));
shuffle(allSlots);
for (let slot of allSlots) {
	newCard = deckData.shift();
	slot.appendChild(newCard.element);
}
for (let slot of myHand.firstElementChild.querySelectorAll("div.slot")) {
	slot.firstChild.dataset.flipped = "true";
}
document.querySelector("#discard").appendChild(deckData.shift().element);

// Play actions
window.currentPlayer = -1;
window.listenerList = [];
function nextPlayer() {
	window.currentPlayer++; 
	console.log("nextisizing",window.currentPlayer);
	if (window.currentPlayer > otherCount) { window.currentPlayer = 0 }
}

startTurn();
function startTurn() {
	nextPlayer();
	console.log("div[data-playindex=\""+window.currentPlayer+"\"]");
	player = document.querySelector("div[data-playindex=\""+window.currentPlayer+"\"]");
	if (player.dataset.ai == "true") {
		let randomSlot = player.querySelectorAll("div.slot")[Math.floor(Math.random()*8)];
		console.log("randomSlot",randomSlot,randomSlot.firstElementChild);
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		discard.appendChild(randomSlot.firstElementChild);
		randomSlot.appendChild(deckData.shift().element);
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
	drawContainer.style.display = "flex";
	for (let slot of myHand.querySelectorAll("div.slot")) { includeListener(slot,"click",swapCards) }
	if (fromDeck) { includeListener(discard,"click",trash) }
	function swapCards(event) {
		selected = event.target; while(selected.className != "slot") { selected = selected.parentElement }
		if (selected.firstElementChild.dataset.flipped = "true") { selected.firstElementChild.dataset.flipped = "false" }
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		discard.appendChild(selected.firstElementChild);
		selected.appendChild(draw.firstElementChild);
		purgeListeners(); startTurn();
	}
	function trash(event) {
		if (discard.firstElementChild != null) { discard.firstElementChild.remove() }
		discard.appendChild(draw.firstElementChild);
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