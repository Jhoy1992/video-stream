const ThumbnailGenerator = require('video-thumbnail-generator').default;
const fs = require('fs');
const path = require('path');

async function generateThumbnail(filename) {
  const outDir = path.dirname(filename);

  const generator = new ThumbnailGenerator({
    sourcePath: filename,
    thumbnailPath: outDir,
    fileNameFormat: '%b',
  });

  console.log(`>>> Creating thumbnail ${path.basename(filename)}`);

  try {
    const response = await generator.generateOneByPercent(5);

    fs.renameSync(
      path.resolve(outDir, response),
      path.resolve(outDir, response.replace('-thumbnail-320x240-0001', ''))
    );

    console.log(`>>> Thumbnail created ${response}`);
  } catch (error) {
    console.log(`>>> Error creating thumbnail ${path.basename(filename)}`);
  }
}

module.exports = generateThumbnail;
