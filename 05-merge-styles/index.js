const fs = require('fs'),
      path = require('path');
let bundlePath;
let dataArr = [];

fs.readdir(path.join(__dirname, 'project-dist'), { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    let fileIsHere = false;
    files.forEach(file => {
      if (file.isFile() && file.name == 'bundle.css') {
        filesCopyStatus = true;
        copyFiles();
      }
    });
    if (!fileIsHere) {
      bundlePath = createFile();
      copyFiles();
    }
  }
});

function createFile () {
  fs.writeFile (path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
    if(err) console.log(err);
  });
  return path.join(__dirname, 'project-dist', 'bundle.css');
}

function copyFiles() {
  fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
      if (file.isFile() && path.parse(path.join(__dirname, 'styles', file.name)).ext == '.css') {
        fs.promises.readFile(path.join(__dirname, 'styles', file.name))
        .then(file => {
          dataArr.push(file.toString());
        })
        .then(() => {
          (async function main() {
            try {
              await fs.promises.writeFile(bundlePath, dataArr.join('\n'));
            } catch (err) {
              console.error(err);
            }
          })();
        })
        .catch(err => {
          console.log(err);
        });
      }
    })
  });
}


