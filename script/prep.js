import {discard, shuffle} from "./define.js";

// Create cards and deck
let cardCount = 0;

export const deckData = [new card(0,"Assassin"),
	new card(1,"Extra Skill"),new card(2,"Extra Skill"),
	new card(3,"Reinforcements"),new card(4,"Reinforcements"),new card(5,"Reinforcements"),new card(6,"Reinforcements"),
	new card("P","Protection"),new card("","Protection")
];
for (let value=0;value<7;value++) {	for (let count=0;count<9;count++) {	deckData.push(new card(value)) } }
shuffle(deckData);

// Seat your friends
var otherCount = 2;
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

// Deal the Deck
var allSlots = [].concat(Array.from(others.querySelectorAll("div.slot")),Array.from(myHand.querySelectorAll("div.slot")));
shuffle(allSlots);
for (let slot of allSlots) {
	let newCard = deckData.shift();
	slot.appendChild(newCard.element);
}
for (let slot of myHand.firstElementChild.querySelectorAll("div.slot")) {
	slot.firstChild.classList.add("flipped");
}
discard.appendChild(deckData.shift().element);

window.currentPlayer = -1;
window.listenerList = [];

export {card,deckData};