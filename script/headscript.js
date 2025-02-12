export class card {
	constructor(value,special=false) {
		this.value = value;
		this.special = special;
		this.element = document.createElement("div");
		this.element.className = "card"; this.element.dataset.value = value; this.element.dataset.special = special;
		this.element.innerHTML = `<h1>${value}</h1>`;
		if (special && special!="false") { this.element.innerHTML += `<h2>${special}</h2>` }
		this.element.innerHTML += "<div class=\"img\"></div>";
	}
}

export function shuffle(array, array2=false) {
	for (let i=array.length-1;i>0;i--) {
		let j = Math.floor(Math.random() * (i + 1));
		if (!array2) { [array[i],array[j]] = [array[j],array[i]] }
		else { [array[i],array[j]] = [array2[j],array2[i]] }
	}
}

export const deckData = [new card(0,"Assassin"),
	new card(1,"Extra Skill"),new card(2,"Extra Skill"),
	new card(3,"Reinforcements"),new card(4,"Reinforcements"),new card(5,"Reinforcements"),new card(6,"Reinforcements"),
	new card("P","Protection"),new card("","Protection")
];
for (let value=0;value<7;value++) {
	for (let count=0;count<9;count++) {	deckData.push(new card(value)) }
}

shuffle(deckData);

export function getStyle(element,value,psuedoclass=null) {	return window.getComputedStyle(element,psuedoclass).getPropertyValue(value) }