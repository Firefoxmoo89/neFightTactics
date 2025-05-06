const w = window;

function shuffle(array, array2=false) {
	for (let i=array.length-1;i>0;i--) {
		let j = Math.floor(Math.random() * (i + 1));
		if (!array2) { [array[i],array[j]] = [array[j],array[i]] }
		else { [array[i],array[j]] = [array2[j],array2[i]] }
	}
}
function getStyle(element,value,psuedoclass=null) {	return w.getComputedStyle(element,psuedoclass).getPropertyValue(value) }

const myHand = document.querySelector("#myHand").firstElementChild;
const discard = document.querySelector("#discard");
const discardData = [];
const deck = document.querySelector("#deck");
const others = document.querySelector("#others");
w.score = 0;
w.cardCount = 0;
w.cards = {};

var cardMoved = new CustomEvent("cardMoved", { detail: { id: 1234 } });

class card {
	constructor(value,special=false) {
		this.value = value;
		this.special = special;
		this.id = w.cardCount; w.cardCount++;
		this.faceup = true; this.facedown = false;
		this.element = document.createElement("div");	
		this.element.id = "card"+this.id; this.element.className = "card"; this.element.dataset.value = value; this.element.dataset.special = special;
		this.element.innerHTML = `<h1>${value}</h1>`;
		if (special && special!="false") { this.element.innerHTML += `<h2>${special}</h2>` }
		this.element.innerHTML += "<div class=\"img\"></div>";
		w.cards[this.element.id] = this;
	}
	draw() { this.element.classList.add("draw") }
	flipUp() { 
		if (this.element.classList.contains("flipped")) { this.element.classList.remove("flipped") } 
		this.faceup = true; this.facedown = false;
	} isUp() { return this.faceup }
	flipDown() { 
		if (!this.element.classList.contains("flipped")) { this.element.classList.add("flipped") } 
		this.faceup = false; this.facedown = true;
	} isDown() { return this.facedown }
	move(destination) {
		`"Destination" parameter must be the slot that the card is moving to`
		let start = this.element.getBoundingClientRect();
		this.element.style.setProperty("--x1",start["x"]+"px");	
		this.element.style.setProperty("--y1",start["y"]+"px");
		this.element.style.setProperty("--w1",start["width"]+"px");
		this.element.style.setProperty("--h1",start["height"]+"px");
		let end = destination.getBoundingClientRect();
		this.element.style.setProperty("--x2",end["x"]+"px");	
		this.element.style.setProperty("--y2",end["y"]+"px");
		this.element.style.setProperty("--w2",end["width"]+"px");
		this.element.style.setProperty("--h2",end["height"]+"px");
		this.element.classList.remove("draw");
		this.element.classList.add("move");
		document.querySelector("#root").appendChild(this.element);
		this.element.addEventListener("animationend",()=>{  
			cardMoved = new CustomEvent("cardMoved", { detail: { id: this.id } });
			document.dispatchEvent(cardMoved);
			destination.prepend(this.element);
			this.element.classList.remove("move");
		});
	}
}
function moveCards(...objectPairs) {
	`Enter cards and their destinations in pairs. ex: {card1,discard},{card2,slot1},...etc`
	for ([daCard,destination] of objectPairs) {	daCard.move(destination) }
}

w.idList = 1;
myHand.dataset.player = 0;
w.players = {"player0":{ai:false}};
class Player {
	constructor(name, color, iconRef="smileyface.svg", ai=false) {
		this.name = name;
		this.id = w.idList; w.idList++;
		this.color = color+"9e";
		this.ai = ai;
		this.iconRef = "../image/"+iconRef;
		this.element = document.createElement("div"); this.element.id = "player"+this.id;
		this.element.innerHTML = "<div> \
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
			</div>";
		others.appendChild(this.element);
		w.players[this.element.id] = this;
		this.element.style.backgroundColor = this.color;
		this.element.querySelector("div.playerIcon").style.backgroundImage = "url(\""+this.iconRef+"\")";
		this.element.querySelector("div.playerIcon").innerText = this.name;
	}
}




function slowDown(time,...lines) {
	let count = 0;
	var slowTime = setInterval(()=>{ 
		eval(lines[count]); 
		count ++; 
		if (count >= lines.length) { clearInterval(slowTime) }
	},time);
}

export {shuffle,getStyle,myHand,discard,discardData,deck,others,cardMoved,card, moveCards, slowDown, Player};