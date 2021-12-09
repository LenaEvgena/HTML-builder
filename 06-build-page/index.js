const fs = require('fs').promises;
const path = require('path');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToBundle = path.join(__dirname, 'project-dist');

async function createBundle() {
  try {
    await createFolder();
    await createStyles();
    await createHtml();
    await copyDir(pathToAssets, path.join(pathToBundle, 'assets'));
  } catch (err) {
    console.log(err);
  }
}

async function createFolder() {
  try {
    await fs.rm(pathToBundle, { recursive: true, force: true });
    await fs.mkdir(pathToBundle, { recursive: true }, err => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function createStyles() {
  try {
    const files = await fs.readdir(pathToStyles, { withFileTypes: true });

    files.forEach(async file => {
      try {
        if (file.isFile() && path.extname(file.name) === '.css') {
          const contents = await fs.readFile(
            path.join(pathToStyles, file.name),
            {
              encoding: 'utf-8',
            }
          );

          if (contents.length) {
            await appendFile(path.join(pathToBundle, 'style.css'), contents);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function appendFile(pathToFile, input) {
  try {
    await fs.appendFile(pathToFile, input, function (err) {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function createHtml() {
  try {
    let template = await fs.readFile(pathToTemplate, {
      encoding: 'utf-8',
    });
    const files = await fs.readdir(pathToComponents, {
      withFileTypes: true,
    });
    const components = files.filter(
      file => file.isFile() && path.extname(file.name) === '.html'
    );
    components.forEach(async component => {
      try {
        const currentPath = path.join(pathToComponents, component.name);
        const componentText = await fs.readFile(currentPath, {
          encoding: 'utf-8',
        });
        const componentName = new RegExp(
          `{{${getName(component.name)}}}`,
          'gm'
        );
        template = template.replace(componentName, componentText);
        await fs.rm(path.join(pathToBundle, 'index.html'), {
          force: true,
          recursive: true,
        });
        await fs.appendFile(path.join(pathToBundle, 'index.html'), template, {
          flag: 'w',
        });
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function getName(name) {
  const regex = /^.*(?=\..+$)/;
  const fullName = regex.exec(name);

  if (fullName) {
    return fullName[0];
  }
}

async function copyDir(copyFrom, copyTo) {
  try {
    const allFiles = await fs.readdir(copyFrom, { withFileTypes: true });
    const files = allFiles.filter(file => file.isFile());
    const folders = allFiles.filter(file => file.isDirectory());
    if (files.length) {
      copyFiles(files, copyFrom, copyTo);
    }

    if (folders.length) {
      copyFolder(folders, copyFrom, copyTo);
    }
  } catch (err) {
    console.log(err);
  }
}

function copyFiles(files, copyFrom, copyTo) {
  files.forEach(async file => {
    try {
      await fs.mkdir(copyTo, { recursive: true });
      await fs.copyFile(
        path.resolve(copyFrom, file.name),
        path.resolve(copyTo, file.name)
      );
    } catch (err) {
      console.log(err);
    }
  });
}

function copyFolder(folders, copyFrom, copyTo) {
  folders.forEach(async folder => {
    try {
      await copyDir(
        path.resolve(copyFrom, folder.name),
        path.resolve(copyTo, folder.name)
      );
    } catch (err) {
      console.log(err);
    }
  });
}

createBundle();
