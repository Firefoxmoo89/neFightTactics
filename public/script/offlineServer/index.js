import {express} from "./express.js"
import * as Moderator from "./manage.js"
const app = express();


app.post("/lobby", (req,res) => {
	if (req.botData) { 

		res.status(200).json({botData:Bots.botData}) 
	}
	else if (req.register) { 
		let newProfile = {};
		newProfile.token = Player.generateToken(); console.log({req});
		for (let key of ["name","icon","color"]) {
			if (req.profile[key]) { newProfile[key] = req.profile[key] }
			else { newProfile[key] = Player.defaultProfile[key] }
		}
		storage.gameData.players[newProfile.token] = newProfile;
		//emitter.emit("register");
		res.status(200).json({ profile: newProfile });
	}
	//else if (req.update) {
		//if (req.update.players) { updateClients.register.push([req,res]) }		
	//}	
	else if (req.startGame) { 
		Moderator.startGame();
		//emitter.emit("startGame");
		res.status(200).json({ success: true });
	}
});
app.post("/play", (req,res) => { res.resolved = false;
	console.log({req,res});
	if (storage.gameData.currentPlayer == req.player) {
		if (req.draw) {
			Moderator.draw();
			res.status(200).json({ card: daCard });
		}
		if (req.place) {
			if (req.slot >= 0 && req.slot <= 7) { 
				Moderator.place();
				res.status(200).json( { card: daCard } );
				req.resolved = true;
			} else {
				res.status(400).json({
					message: "Your slot option was invalid. Game was either corrupted or tampered with (It's never the developers fault). The request key 'slot' was set to"+req.slot+", when it should be in the range 0-7"
				});
			}
		}
		if (req.discard) {
			Moderator.discard();
			res.status(200).json({ message: "success"	});
			req.resolved = true;
		}
	}
	if (req.update) {	updateList.push([req,res]) }
	if (req.resolved) { updateList = updateClients() }
});