require('dotenv').config()

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const watch = require('./utils/fileWatcher');

watch()


const app = express();
const server = http.Server(app);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  const { name: video, sub: subtitle } = req.query;

  console.log({ video, subtitle });

  res.render("video", { video, subtitle });
});

app.get("/subs/:name", (req, res) => {
  console.log(path.join(__dirname, `videos/${req.params.name}`));
  res.sendFile(path.join(__dirname, `videos/${req.params.name}`));
});

app.get("/videos/:name", (req, res) => {
  const path = `videos/${req.params.name}`;
  console.log(path);

  const stat = fs.statSync(path);

  const fileSize = stat.size;

  const range = req.headers.range;

  const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);

  const end = fileSize - 1;

  const chunkSize = end - start + 1;

  const file = fs.createReadStream(path, { start, end });

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  file.pipe(res);
});

server.listen(3000, () => console.log("Listening on port 3000."));
