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

function convertOthersToVtt(file, newFile) {
  try {
    const sub = fs.readFileSync(file, 'latin1');
    const vtt = subsrt.convert(sub, { format: 'vtt' });

    fs.writeFileSync(newFile, vtt);

    console.log(`>>> Subtitle converted ${path.basename(newFile)}`);
  } catch (err) {
    console.log('Error: ', err.message);
  }
}

function convertAssToVtt(file, newFile) {
  try {
    fs.createReadStream(file)
      .pipe(ass2vtt())
      .pipe(fs.createWriteStream(newFile));

    console.log(`>>> Subtitle converted ${path.basename(newFile)}}`);
  } catch (error) {
    convertOthersToVtt(file, newFile);
  }
}

function convertSubtitle(file) {
  const name = file.split('/').pop();
  const extension = path.extname(name).toLowerCase();

  console.log(`>>> Converting subtitle ${name}`);

  const newFile = renameFile(file);

  if (extension === '.ass') {
    convertAssToVtt(file, newFile);
  }

  if (extension !== '.ass') {
    convertOthersToVtt(file, newFile);
  }

  fs.unlinkSync(file);
  console.log(`>>> Deleted old subtitle ${name}`);
}

module.exports = convertSubtitle;
