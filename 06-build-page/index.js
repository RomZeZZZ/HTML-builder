const fs = require('fs'),
      path = require('path');
let newPathCss,
    indexHtmlPath,
    dataArr = [],
    templateData = {},
    indexHtmlString = '';

fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    let filesCopyStatus = false;
    files.forEach(file => {
      if (!file.isFile() && file.name == 'project-dist') {
        filesCopyStatus = true;
        fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive:true, retryDelay:0 })
        .then(() => {
          buildDist();
        })
        .catch(err => {
          console.log(err);
        });
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
  copyTemplateData(path.join(__dirname, 'components'));
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

function copyTemplateData(componentsPath) {
  fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
      let fileName = file.name;
      if (file.isFile() && path.parse(path.join(componentsPath, file.name)).ext == '.html') {
        fs.promises.readFile(path.join(componentsPath, file.name))
        .then(file => {
          templateData[(path.parse(path.join(componentsPath, fileName)).name)] = file.toString();
        })
        .then(() => {
          fs.readFile(path.join(__dirname, 'template.html'), (err, data) => {
            indexHtmlString = data.toString();
            for (let key in templateData) {
              if (indexHtmlString.includes(`{{${key}}}`)) {
                indexHtmlString = indexHtmlString.replace(`{{${key}}}`, templateData[key]);
              }
            }
            fs.promises.writeFile(indexHtmlPath, indexHtmlString)
            .catch(err => {
              console.log(err);
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
      }
    })
  });
}



