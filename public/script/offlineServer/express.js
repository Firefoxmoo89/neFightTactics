class Response {
	constructor() {
		console.log("Making a response");
		this.httpCode = null;
	}
	status(code) {
		this.httpCode = code;
		return this
	}
	event(object) {
		if (this.httpCode != null) { object["status"] = this.httpCode }
		return new CustomEvent("response", {detail:object});
	}
	json(object) {
		document.dispatchEvent(this.event(object)); console.log("dispatched response");
	}
	redirect(location, replace=true) {
		if (replace) { window.location.replace = location }
		else { window.location.href = location }
	}
}

class expressServer {
	constructor() {
		console.log("offline server started");
		this.callbacks = { post: {} }
		document.addEventListener("request", event => {
			console.log("Received request");
			let daFunction = this.callbacks.post[event.detail.source];
			if (daFunction != null) { daFunction(event.detail, new Response) }
			else { 
				console.error("Offline request invalid", event);
				let daResponse = new Response();
				daResponse.status(400).json({ 
					message: "Invalid request: source / API endpoint could not be found" 
				});
			}
		});
	}
	post(path, callback) {
		this.callbacks.post[path] = callback;
	}
}

export var express = () => { return new expressServer() }