function shuffle(array, array2=false) {
	for (let i=array.length-1;i>0;i--) {
		let j = Math.floor(Math.random() * (i + 1));
		if (!array2) { [array[i],array[j]] = [array[j],array[i]] }
		else { [array[i],array[j]] = [array2[j],array2[i]] }
	}
}
function getStyle(element,value,psuedoclass=null) {	return window.getComputedStyle(element,psuedoclass).getPropertyValue(value) }

const myHand = document.querySelector("#myHand").firstElementChild;
const discard = document.querySelector("#discard");
const discardData = [];
const deck = document.querySelector("#deck");
const others = document.querySelector("#others");
window.score = 0;

export class card {
	constructor(value,special=false) {
		this.value = value;
		this.special = special;
		this.id = cardCount; cardCount++;
		this.element = document.createElement("div");	
		this.element.id = this.id; this.element.className = "card"; this.element.dataset.value = value; this.element.dataset.special = special;
		this.element.innerHTML = `<h1>${value}</h1>`;
		if (special && special!="false") { this.element.innerHTML += `<h2>${special}</h2>` }
		this.element.innerHTML += "<div class=\"img\"></div>";
	}
	draw() {
		this.element.classList.add("draw");
	}
	flip() {
		if (this.element.classList.contains("flipped")) { this.element.classList.remove("flipped") }
		else { this.element.classList.add("flipped") }
	}
	move(destination) {
		`"Destination" parameter must be the slot that the card is moving to`
		start = this.element.getBoundingClientRect();
		this.element.style.setProperty("--x1",start["x"]+"px");	
		this.element.style.setProperty("--y1",start["y"]+"px");
		this.element.style.setProperty("--w1",start["width"]+"px");
		this.element.style.setProperty("--h1",start["height"]+"px");
		end = destination.getBoundingClientRect();
		this.element.style.setProperty("--x2",end["x"]+"px");	
		this.element.style.setProperty("--y2",end["y"]+"px");
		this.element.style.setProperty("--w2",end["width"]+"px");
		this.element.style.setProperty("--h2",end["height"]+"px");
		this.element.classList.remove("draw");
		this.element.classList.add("move");
		document.querySelector("#root").appendChild(this.element);
		this.element.addEventListener("animationend",()=>{ destination.appendChild(this.element) });
	}
}
export {shuffle,getStyle,myHand,discard,discardData,deck,others,card};