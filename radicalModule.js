// This module is for all personal basic functions for nodejs
var fs = require("fs"); var formidable = require("formidable");

exports.servePage = (page,status,headers,response,direct=false) => {
  // Responds to request with an html document
  // "page" parameter is a string of the filename of a file in the html folder without the extension, ex. "apply"
  // "status" parameter is an integer of an http status, ex. 200 or 404
  // "headers" parameter is an object for http headers, ex. {"Content-type":"text/html"}
  // "response" parameter is the response object from the nodejs server
  // "direct" parameter is a boolean value to change "page" parameter from a filename to a string of html, allows for serverside rendering 
  headers["Content-type"] = "text/html";
  fileData = fs.readFileSync("html/"+page+".html");
  response.writeHead(status,headers);         
  response.end(fileData);
}

exports.serveFile = (file,status,headers,response,direct=false) => {
  // Responds to request with a file of any type
  // "file" parameter is a string of the path to the file
  // "status" parameter is an integer of an http status, ex. 200 or 404
  // "headers" parameter is an object for http headers, ex. {"Content-type":"text/html"}
  // "response" parameter is the response object from the nodejs server
  // "direct" parameter is a boolean value to change "page" parameter from a filename to a string of html, allows for serverside rendering 
  if (direct) { fileData = file } 
  else { 
    if (fs.existsSync(file)) { fileData = fs.readFileSync(file) } 
    else { console.error("File \""+file+"\" doesn't exist"); this.servePage("missing",404,{},response); return }
  }
  response.writeHead(status,headers); 
  response.end(fileData);
};

exports.processPOST = (request,callback) => {
  // Processes a post request uses object as the callback parameter with the data and a list of file names that were uploaded into the temp folder
  // "request" parameter is the request object from the nodejs server
  // "callback" parameter is a function that will be given the form data as a parameter. (formData,parseError)
  var filenameList = [];
  var form = new formidable.IncomingForm({
    multiples: true, uploadDir: "temp/", maxFileSize: 500 * 1024 * 1024, keepExtensions: true, 
    filename: (name, ext, part, form) => { 
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; newName = "";
      for (let i=0;i<16;i++) { newName += characters.charAt(Math.floor(Math.random()*characters.length)) }
      filenameList.push(newName+ext);
      return newName+ext
    }
  }); 

  form.parse(request, function (parseError, fields, files) {
    if (parseError) { console.error(parseError); callback(formData,parseError) } 
    else {
    formData = {};
    for (var key of Object.keys(fields)) { formData[key] = fields[key][0] }
    formData.filenameList = filenameList;
    callback(formData,false);
    }
  });
}

exports.fetchadids = (source, type, options, callback=false) => {
  // fetches data from other sources, uses the fetch api
  // "source" parameter is a string to the url address
  // "type" parameter is a string to define if the response will be "json" or "text" 
  // "options" parameter is an object that is synonomous with fetch api parameters, includes method:"POST"
  // "callback" parameter is an optional callback function, otherwise it is logged to the console
  async function fetchadids(source, type, options, callback=false) {
    if (type == "json") { function process(response){return response.json()} } 
    else if (type == "text") { function process(response){return response.text()} }
    else { function process(response){return response.text()} }
    await fetch(source,options).then(process)
    .then(data => { if (callback != false) { callback(data) } else { console.log("fetch at",source,":",data) } })
  } fetchadids(source,type,options,callback);
};
