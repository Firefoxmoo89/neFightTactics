import {shuffle} from "./cards.js"
import {storage} from "./storage.js"

var cardIndex = 0;
class Card {
	constructor(value,special=false) {
		this.value = value;
		this.special = special;
		this.id = cardIndex; cardIndex++;
	}
}

export async function startGame() {
	cardIndex = 0;
	storage.game.deck = [new Card(0,"Assassin")]; 
	for (let value of [1,2]) { storage.game.deck.push(new Card(value,"Extra Skill")) }
	for (let value of [3,4,5,6]) { storage.game.deck.push(new Card(value,"Reinforcements")) }
	for (let i=0;i<2;i++) { storage.game.deck.push(new Card("P","Protection")) }
	for (let value=0;value<=6;value++) {	
		for (let count=0;count<9;count++) {	storage.game.deck.push(new Card(value)) } 
	}
	shuffle(storage.game.deck); console.log(storage.game.deck);
	for (let player of Object.values(storage.game.players)) {
		for (let i=0;i<8;i++) { player.cardList.push(storage.game.deck.pop()) }
	}
	console.log(storage.game.players);
	storage.game.status = "Play";
}