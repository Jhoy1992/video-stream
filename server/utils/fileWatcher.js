const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const downloadSubtitle = require('./subtitleDownloader');
const convertSubtitle = require('./subtitleConvert');
const convertVideo = require('./videoConverter');
const thumbnailGenerator = require('./thumbnailGenerator');

const SUBTITLES_EXTENSIONS = ['srt', 'ass'];
const VIDEO_EXTENSIONS = ['mkv', 'avi', 'mov'];

function findSubtitle(fileName) {
  if (fs.existsSync(`${fileName}.vtt`)) {
    return true;
  }

  if (fs.existsSync(`${fileName}_0_eng.vtt`)) {
    return true;
  }

  if (fs.existsSync(`${fileName}_0_pob.vtt`)) {
    return true;
  }

  for (let counter = 0; counter < SUBTITLES_EXTENSIONS.length; counter++) {
    if (fs.existsSync(`${fileName}.${SUBTITLES_EXTENSIONS[counter]}`)) {
      return true;
    }
  }

  return false;
}

function isVideoFile(extension) {
  return [...VIDEO_EXTENSIONS, 'mp4'].includes(extension.toLowerCase());
}

function getExtension(fileFullName) {
  return fileFullName.split('.').pop();
}

function getName(fileFullName) {
  const file = fileFullName.split('.');
  file.pop();
  return file.join('.');
}

function watch() {
  const folder = path.resolve(__dirname, '..', process.env.VIDEOS_DIR);
  const whatcher = chokidar.watch(folder, {
    persistent: true,
  });

  whatcher.on('add', async file => {
    const extension = getExtension(file);
    const fileName = getName(file);

    if (VIDEO_EXTENSIONS.includes(extension.toLowerCase())) {
      convertVideo(file);
    }

    if (SUBTITLES_EXTENSIONS.includes(extension.toLowerCase())) {
      convertSubtitle(file);
    }

    if (
      extension.toLowerCase() === 'mp4' &&
      !fs.existsSync(`${fileName}.png`)
    ) {
      await thumbnailGenerator(file);
    }

    if (isVideoFile(extension) && !findSubtitle(fileName)) {
      await downloadSubtitle(file);
    }
  });
}

module.exports = watch;
