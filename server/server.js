require('dotenv').config();

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');

const watch = require('./utils/fileWatcher');

watch();

const app = express();
const server = http.Server(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async (req, res) => {
  const folder = path.resolve(__dirname, process.env.VIDEOS_DIR);

  const allFiles = await fs.readdir(folder);

  const mp4Files = allFiles.filter(
    file => path.extname(file).toLocaleLowerCase() === '.mp4'
  );

  const files = mp4Files.map(mp4File => {
    const name = mp4File;
    const sub = mp4File.replace(path.extname(mp4File), '.vtt');
    const thumb = mp4File.replace(path.extname(mp4File), '.png');

    return {
      name,
      sub: fsSync.existsSync(path.join(folder, sub)) ? sub : '',
      thumb: fsSync.existsSync(path.join(folder, thumb)) ? thumb : '',
    };
  });

  files.sort((a, b) => (a.name > b.name ? 1 : -1));

  res.send(files);
});

app.get('/subs/:name', (req, res) => {
  res.sendFile(path.join(__dirname, `videos/${req.params.name}`));
});

app.get('/thumbs/:name', (req, res) => {
  res.sendFile(path.join(__dirname, `videos/${req.params.name}`));
});

app.get('/videos/:name', (req, res) => {
  const path = `videos/${req.params.name}`;

  const stat = fsSync.statSync(path);

  const fileSize = stat.size;

  const range = req.headers.range;

  const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);

  const end = fileSize - 1;

  const chunkSize = end - start + 1;

  const file = fsSync.createReadStream(path, { start, end });

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);
  file.pipe(res);
});

server.listen(3001, () => console.log('Listening on port 3001.'));
