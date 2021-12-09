const fs = require('fs');
const path = require('path');

const filePathBundle = path.join(__dirname, 'project-dist/bundle.css');
const filePathStyle = path.join(__dirname, 'styles');

function mergeBundleCssFile() {
  fs.promises.readdir(filePathStyle, { withFileTypes: true })
    // If promise resolved and
    // datas are fetched
    .then(elements => {
      for (let file of elements) {
        if (file.isFile()) {
          const extension = path.extname(file.name);
          if (extension === '.css') {
            // const pathFile = path.join(__dirname, `styles/${file.name}`)
            fs.readFile(path.join(filePathStyle, file.name), 'utf-8', (err, content) => {
              if (err) {
                throw err;
              }
              fs.appendFile(filePathBundle, content, (err) => {
                if (err) {
                  throw  err;
                }
                console.log(`Styles ${file.name} merged to ${path.basename(filePathBundle)}!`);
              });
            });
          }
        }
      }
    })
    // If promise is rejected
    .catch(err => {
      console.log(err);
    });
}

// Clearing the contents of the bundle.css
function clearBundleFile() {
  if (filePathBundle) {
    fs.promises.rm(filePathBundle, { recursive: true, force: true });
  }
}

function createBundle() {
  clearBundleFile();
  mergeBundleCssFile();
}

createBundle();
