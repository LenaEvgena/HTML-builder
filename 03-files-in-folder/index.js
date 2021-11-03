const quote = 'secret-folder';
const path = require('path');
const fs = require('fs/promises');
const dirPath = path.join(__dirname, quote);
// console.log(dirPath);

async function readFolder() {
  try {
    let files = await fs.readdir(dirPath, {withFileTypes: true});
    for (let file of files) {
      // console.log(file);
      if (file.isFile()) {
        let fileNameArray = file.name.split('.');
        // console.log(fileNameArray);
        let filePath = path.join(dirPath, file.name);
        // console.log(filePath);
        let stats = await fs.stat(filePath);
        console.log(`${fileNameArray[0]} - ${fileNameArray[1]} - ${stats.size / 1000}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readFolder();
