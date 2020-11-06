const hbjs = require('handbrake-js');
const fs = require('fs');
const path = require('path');
const thumbnailGenerator = require('./thumbnailGenerator');

function renameFile(path) {
  const paths = path.split('.');

  paths.pop();

  const fileName = paths.join('.');

  return `${fileName}.mp4`;
}

function convertVideo(filePath) {
  const newFile = renameFile(filePath);
  const name = filePath.split('/').pop();

  hbjs
    .spawn({
      input: filePath,
      output: newFile,
    })
    .on('error', err => console.log(err))
    .on('progress', ({ percentComplete }) => {
      if (Number.isInteger(percentComplete)) {
        console.log(`Percent complete of ${name}: ${percentComplete}`);
      }
    })
    .on('begin', () => console.log(`>>> Converting video ${name}`))
    .on('end', () => {
      console.log(`>>> Sucessufull converted video ${name}`);

      fs.unlinkSync(filePath);
      console.log(`>>> Deleted old video ${name}`);

      thumbnailGenerator(newFile);
    });
}

module.exports = convertVideo;
