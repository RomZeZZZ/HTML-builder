const fs = require('fs'),
      path = require('path');
let newPathCss;
let indexHtmlPath;
let dataArr = [];
// Create directory
fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    let filesCopyStatus = false;
    files.forEach(file => {
      if (!file.isFile() && file.name == 'project-dist') {
        filesCopyStatus = true;
        clearDir(path.join(__dirname, 'project-dist'));
        buildDist();
      }
    });
    if (!filesCopyStatus) {
      buildDist();
    }
  }
});

function buildDist() {
  fs.mkdir(path.join(__dirname, 'project-dist'), err => {
    if(err) throw err;
  });
  indexHtmlPath = createFile(path.join(__dirname, 'project-dist', 'index.html'));
  newPathCss = createFile(path.join(__dirname, 'project-dist', 'style.css'));
  collectStyles(path.join(__dirname, 'styles'), newPathCss);
  createDir(path.join(__dirname, 'project-dist', 'assets'));
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

function collectStyles(pathCss, newCss) {
  fs.readdir(pathCss, { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
      if (file.isFile() && path.parse(path.join(pathCss, file.name)).ext == '.css') {
        fs.promises.readFile(path.join(pathCss, file.name))
        .then(file => {
          dataArr.push(file.toString());
        })
        .then(() => {
          (async function main() {
            try {
              await fs.promises.writeFile(newCss, dataArr.join('\n'));
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

function createFile (path) {
  fs.writeFile (path, '', (err) => {
    if(err) console.log(err);
  });


  return path;
}

function createDir(pathDir) {
  fs.mkdir(pathDir, err => {
    if(err) throw err;
  });
}

function clearDir(pathDir) {
  fs.rm(pathDir, { recursive:true, retryDelay:0 }, (err) => {
    if(err) {
      console.error(err.message);
      return;
    }
  });
}

function copyDir(pathDir, pathNewDir) {
  fs.readdir(pathDir, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(pathDir, file.name), path.join(pathNewDir, file.name), (err) => {
            if(err) console.log(err);
          });
        } else {
          createDir(path.join(pathNewDir, file.name));
          copyDir(path.join(pathDir, file.name), path.join(pathNewDir, file.name));
        }
      });
    }
  });
}
