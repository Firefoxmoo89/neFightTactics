class res {
	constructor() {
		console.log("Making a response");
		this.httpCode = null;
	}
	status(code) {
		this.httpCode = code;
	}
	event(object) {
		if (this.httpCode != null) { object["status"] = this.httpCode }
		return new CustomEvent("response", object);
	}
	json(object) {
		document.dispatchEvent(this.event(object));
	}
}

class express {
	constructor() {
		console.log("offline server started");
		this.callbacks = { post: {} }
		document.addEventListener("request", event => {
			console.log("Received request");
			let daFunction = this.callback.post[event.detail.source];
			if (daFunction != null) { daFunction(event.detail, new res) }
			else { 
		});
	}
	post(path, callback) {
		this.callbacks.post[path] = callback;
	}
}

app = express();

app.post("/lobby", (req,res) => {
	console.log({req,res});
});
app.post("/play", (req,res) => {
	console.log({req,res});
});
















import * as Cards from "./cards.js";
import * as Player from "./player.js";

// Create cards and deck
w.deckData = [new Cards.Card(0,"Assassin"),
	new Cards.Card(1,"Extra Skill"),new Cards.Card(2,"Extra Skill"),
	new Cards.Card(3,"Reinforcements"),new Cards.Card(4,"Reinforcements"),new Cards.Card(5,"Reinforcements"),new Cards.Card(6,"Reinforcements"),
	new Cards.Card("P","Protection"),new Cards.Card("P","Protection")
];
for (let value=0;value<=6;value++) {	for (let count=0;count<9;count++) {	w.deckData.push(new Cards.Card(value)) } }
Cards.shuffle(w.deckData);

// Seat your friends
new Player.Player("User","#aa1212","smileyface.svg",false,true);
new Player.Player("Pizza Boi","#4545bb", "smileyface.svg", true);
new Player.Player("Donut Man","#99aa12", "smileyface.svg", true);


// Deal the Deck
var allSlots = [discard].concat(Array.from(others.querySelectorAll("div.slot")),Array.from(myHand.querySelectorAll("div.slot")));
shuffle(allSlots);

w.recentlyMoved = 0;
function flipStart(event) {
	w.recentlyMoved++;
	if (w.recentlyMoved == allSlots.length) { 
		setTimeout(()=>{
			for (let player of Object.values(w.players)) {
				if (player.user) { 
					for (let index of [4,5,6,7]) { player.cardInIndex(index).flipUp()	}
					player.cardInIndex(getRandomInt(3)).flipUp();
				} else {
					let randomInt = getRandomInt(3);
					player.cardInIndex(randomInt).flipUp();
					player.cardInIndex(randomInt+4).flipUp();
				}
			}
			cardInSlot(discard).flipUp();
			document.removeEventListener("cardMoved",flipStart);
		},50);
	}
}
document.addEventListener("cardMoved",flipStart);

let cardsMade = new CustomEvent("cardsMade");

document.addEventListener("cardsMade",event=>{
	let currentSlot = 0;
	var intervalID = setInterval(()=>{
		let daCard = cardInSlot(deck);
		daCard.moveTo(allSlots[currentSlot]);
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