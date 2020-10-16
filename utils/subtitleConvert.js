const subsrt = require('subsrt');
const fs = require('fs');

function renameFile(path) {
  const [fileName] = path.split('.');

  return `${fileName}.vtt`;
}

function convertSubtitle(path) {
  const name = path.split('/').pop();

  console.log(`>>> Converting subtitle ${name}`);

  const newFile = renameFile(path);

  const sub = fs.readFileSync(path, 'latin1');

  const vtt = subsrt.convert(sub, { format: 'vtt' });

  fs.writeFileSync(newFile, vtt);

  console.log(`>>> Subtitle converted ${name}`);

  fs.unlinkSync(path);

  console.log(`>>> Deleted old subtitle ${name}`);
}

module.exports = convertSubtitle;
