var http = require('http'); var url = require("url"); var fs = require("fs"); 
var rad = require("./radicalModule.js"); 

function daServer(request, response) {
  deets = url.parse(request.url, true);
 
  if (deets.pathname == "/") { //homepage
    rad.servePage("index",200,{},response); 
  }
  else if (deets.pathname.includes("/style")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/css"},response) }
  else if (deets.pathname.includes("/script")) { rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"text/javascript"},response) }
  else if (deets.pathname.includes("/image")) { 
    extension = deets.pathname.slice(deets.pathname.indexOf(".")+1);
    if (extension == "svg") { extension = "svg+xml" }
    rad.serveFile(deets.pathname.slice(1),200,{"Content-type":"image/"+extension},response) 
  }
}

http.createServer(daServer).listen(80);

