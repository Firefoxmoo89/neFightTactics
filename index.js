//var http = require('http'); var url = require("url"); var fs = require("fs"); 
//var rad = require("./radicalModule.js"); 
import express from "express";
const app = express();
const port = 80;

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.response.sendTemplate = function(filename) {
  return this.sendFile(path.join(__dirname, "public", "html", filename+".html"));
}

app.use(express.json({limit:"100kb"}));

app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/home", (req,res) => {
  res.sendTemplate("home");
});
app.get("/lobby", (req,res) => {
  res.sendTemplate("lobby");
});
app.get("/play", (req,res) => {
  res.sendTemplate("play");
});
app.post("/debug", (req,res) => {
  daJson = req.body;
  console.log(daJson.log);
});
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

