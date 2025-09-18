Land on homepage
	choose options:
		Play online (2-6 Players)
			Only if we run a server!
			Go to lobby page with "online" parameter
		Play Local (2-6 Players)
			Use on same wifi
			Go to lobby page with "local" parameter
		Play offline (1 Player)
			Use only single device
			Go to lobby with "offline" parameter
	Settings and other fancy things
	Store information in local storage settings

lobby page
	If no info from homepage, redirect
	if "online"
		connect to big game server
		choose slots for players, bots, or empty
		Choose password or none
		get game code and wait for others
		when ready, go to play page with game details
	if "local"
		ask for ip of local server
		connect to server and make personal selections
		when ready, go to play page with game details
	if "offline"
		choose bots
		when ready, go to play page with game details
	

Play page
	if no info from lobby, redirect to homepage
	parse game info to know server source
	if server is "online" or "local"
		repeatedly fetch data, asking for card details and verifying game state
	if server is "offline"
		setup offlineServer.js
		have the normal js refer to the offlineServer.js file the same as it would a regular server, using events as fetch promises
	User's page asks the server for updates, then copies that to it's own view. The server keeps track of turns to update each device without interference. 