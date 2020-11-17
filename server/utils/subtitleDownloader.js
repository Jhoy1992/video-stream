const subtitler = require('subtitler');
const fs = require('fs');
const path = require('path');
const request = require('request');
const { gunzip } = require('zlib');

let brIndex = 0;
let enIndex = 0;

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};

const decompressFile = (filepath, name) => {
  const fileData = fs.readFileSync(filepath);

  gunzip(fileData, (err, bin) => {
    const newPath = path.resolve(__dirname, '..', 'videos', name);

    fs.writeFileSync(newPath, bin);
    fs.unlinkSync(filepath);
  });
};

const dowloadFile = (subtitle, name) => {
  const { SubDownloadLink, SubFileName } = subtitle;
  const newFileName = `${name}${path.extname(SubFileName)}`;
  const zipPath = path.join(__dirname, `${name}.gz`);

  download(SubDownloadLink, zipPath, async () => {
    decompressFile(zipPath, newFileName);
  });
};

async function downloadSubtitleByHash(file, token) {
  const resultsBr = await subtitler.api.searchForFile(token, 'pob', file);

  if (resultsBr.length) {
    resultsBr.forEach(sub => dowloadFile(sub, `${name}_${brIndex}_pob`));
    brIndex++;
  }

  const resultsEng = await subtitler.api.searchForFile(token, 'eng', file);

  if (resultsEng.length) {
    resultsEng.forEach(sub => dowloadFile(sub, `${name}_${enIndex}_eng`));
    enIndex++;
  }

  // return resultsBr.length || resultsEng.length ? true : false;
  return false;
}

async function downloadSubtitleByTitle(file, token) {
  const name = path.basename(file, path.extname(file));

  const resultsBr = await subtitler.api.searchForTitle(token, 'pob', name);

  if (resultsBr.length) {
    resultsBr.forEach(sub => dowloadFile(sub, `${name}_${brIndex}_pob`));
    brIndex++;
  }

  const resultsEng = await subtitler.api.searchForTitle(token, 'eng', name);

  if (resultsEng.length) {
    resultsEng.forEach(sub => dowloadFile(sub, `${name}_${enIndex}_eng`));
    enIndex++;
  }

  // return resultsBr.length || resultsEng.length ? true : false;
  return false;
}

async function downloadSubtitle(file) {
  const name = path.basename(file, path.extname(file));

  console.log(`>>> Download subtitle ${name}`);

  const token = await subtitler.api.login();

  if (await downloadSubtitleByHash(file, token)) {
    console.log(`>>> Subtitle downloaded ${name}`);

    await subtitler.api.logout();
    return;
  }

  if (await downloadSubtitleByTitle(file, token)) {
    console.log(`>>> Subtitle downloaded ${name}`);

    await subtitler.api.logout();
    return;
  }

  await subtitler.api.logout();
}

module.exports = downloadSubtitle;
