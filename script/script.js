
class card {
	constructor(value) {
		this.value = value;
		this.element = document.createElement("div");
		this.element.className = "card"; this.element.dataset.value = value;
		this.element.innerHTML = "<h2>${value}</h2>";
	}

}

document.addEventListener("onload",event => {
	

});