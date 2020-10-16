const hbjs = require('handbrake-js');
const fs = require('fs');

function renameFile(path) {
  const [fileName] = path.split('.');

  return `${fileName}.mp4`;
}

function convertVideo(path) {
  const newFile = renameFile(path);
  const name = path.split('/').pop();

  hbjs
    .spawn({
      input: path,
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

      fs.unlinkSync(path);
      console.log(`>>> Deleted old video ${name}`);
    });
}

module.exports = convertVideo;
