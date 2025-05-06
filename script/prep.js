import {shuffle,getStyle,myHand,discard,discardData,deck,others,cardMoved,card, moveCards, slowDown, Player} from "./define.js";
const w = window;

// Create cards and deck
w.deckData = [new card(0,"Assassin"),
	new card(1,"Extra Skill"),new card(2,"Extra Skill"),
	new card(3,"Reinforcements"),new card(4,"Reinforcements"),new card(5,"Reinforcements"),new card(6,"Reinforcements"),
	new card("P","Protection"),new card("P","Protection")
];
for (let value=0;value<7;value++) {	for (let count=0;count<9;count++) {	w.deckData.push(new card(value)) } }
shuffle(w.deckData);

// Seat your friends
new Player("Pizza Boi","#4545bb", "smileyface.svg", true)
new Player("Donut Man","#99aa12", "smileyface.svg", true)

// Deal the Deck
var allSlots = [discard].concat(Array.from(others.querySelectorAll("div.slot")),Array.from(myHand.querySelectorAll("div.slot")));
shuffle(allSlots);

w.recentlyMoved = 0;
function flipStart() {
	w.recentlyMoved++;
	if (w.recentlyMoved == allSlots.length) {
		for (let slot of myHand.querySelectorAll(".row")[1].querySelectorAll("div.slot")) {	slot.firstElementChild.classList.remove("flipped") }
		discard.firstElementChild.classList.remove("flipped");
		document.removeEventListener("cardMoved",flipStart);
	}
}
document.addEventListener("cardMoved",flipStart);

let cardsMade = new CustomEvent("cardsMade");

document.addEventListener("cardsMade",event=>{
	let currentSlot = 0;
	var intervalID = setInterval(()=>{
		let daCard = w.cards[deck.firstElementChild.id];
		daCard.move(allSlots[currentSlot]);
		currentSlot++;
		if (currentSlot == allSlots.length) { clearInterval(intervalID) }
	},100);
},{once:true});

for (cardCount in allSlots) {
	let newCard = w.deckData.shift();
	newCard.flipDown();
	deck.appendChild(newCard.element);
	let dim = newCard.element.getBoundingClientRect();
	if (cardCount == allSlots.length-1) { setTimeout(()=>{document.dispatchEvent(cardsMade)},50) }
}

w.currentPlayer = -1;