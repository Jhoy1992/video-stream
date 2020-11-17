const subsrt = require('subsrt');
const ass2vtt = require('ass-to-vtt');
const fs = require('fs');
const path = require('path');

function renameFile(file) {
  const parts = file.split('.');

  parts.pop();

  const fileName = parts.join('.');

  return `${fileName}.vtt`;
}

function convertSubtitle(file) {
  const name = file.split('/').pop();
  const extension = path.extname(name).toLowerCase();

  console.log(`>>> Converting subtitle ${name}`);

  const newFile = renameFile(file);

  if (extension === '.ass') {
    fs.createReadStream(file)
      .pipe(ass2vtt())
      .pipe(fs.createWriteStream(newFile));
  }

  if (extension !== '.ass') {
    const sub = fs.readFileSync(file, 'utf8');

    const vtt = subsrt.convert(sub, { format: 'vtt' });

    fs.writeFileSync(newFile, vtt);
  }

  console.log(`>>> Subtitle converted ${name}`);

  fs.unlinkSync(file);

  console.log(`>>> Deleted old subtitle ${name}`);
}

module.exports = convertSubtitle;
