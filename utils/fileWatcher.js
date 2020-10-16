const chokidar = require('chokidar');
const path = require('path');
const convertSubtitle = require('./subtitleConvert');
const convertVideo = require('./videoConverter');

const IGNORED_EXTENSIONS = ['mp4', 'srt', 'vtt'];

function getExtension(fileFullName) {
  return fileFullName.split('.').pop();
}

function watch() {
  const folder = path.resolve(__dirname, '..', process.env.VIDEOS_DIR);
  const whatcher = chokidar.watch(folder, {
    persistent: true,
  });

  whatcher.on('add', file => {
    const extension = getExtension(file);

    if (!IGNORED_EXTENSIONS.includes(extension.toLowerCase())) {
      convertVideo(file);
    }

    if (extension.toLowerCase() === 'srt') {
      convertSubtitle(file);
    }
  });
}

module.exports = watch;
