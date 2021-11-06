const folder = 'files';
const folderCopy = 'files-copy';
const path = require('path');
const fs = require('fs/promises');
const dirPath = path.join(__dirname, folder);
const newDirPath = path.join(__dirname, folderCopy);

async function copyFolder() {
  try {
    await fs.rm(newDirPath, { recursive: true });
    await fs.mkdir(newDirPath, { recursive: true });

    let files = await fs.readdir(dirPath, {withFileTypes: true});
    // console.log(files);

    files.forEach(file => {
      let currFile = path.join(dirPath, file.name);
      let newFile = path.join(newDirPath, file.name);
      fs.copyFile(currFile, newFile);
    });

  } catch (err) {
    console.error(err);
  }
}

copyFolder();
