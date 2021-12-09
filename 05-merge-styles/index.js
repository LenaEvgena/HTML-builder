const fs = require('fs').promises;
const path = require('path');
const pathToStyles = path.join(__dirname, 'styles');
const pathToBundleFolder = path.join(__dirname, 'project-dist');
const pathToBundle = path.join(pathToBundleFolder, 'bundle.css');

async function readFiles() {
  try {
    const files = await fs.readdir(pathToStyles, { withFileTypes: true });
    await fs.rm(pathToBundle, { force: true });

    files.forEach(async file => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const contents = await fs.readFile(path.join(pathToStyles, file.name), {
          encoding: 'utf-8',
        });

        if (contents.length) {
          await appendFile(contents);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function appendFile(input) {
  try {
    await fs.appendFile(pathToBundle, input, function (err) {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
}

readFiles();
