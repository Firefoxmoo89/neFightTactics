let cardList = document.querySelectorAll("div.card");

for (let card of cardList) {
	card.addEventListener("click", event => {
		let daCard = event.target;
		while (daCard.class != "card") { daCard = daCard.parentElement }
		
	});
}