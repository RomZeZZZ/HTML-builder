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
        console.log('файл есть');
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
  fs.promises.readdir(path.join(__dirname, 'styles'))
  .then(filenames => {
    for (let filename of filenames) {
      fs.promises.readFile(path.join(__dirname, 'styles', filename))
      .then(file => {
        console.log(file.withFileTypes)
        dataArr.push(file.toString());
      })
      .then(() => {
        (async function main() {
          try {
            await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), dataArr.join('\n'));
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
  .catch(err => {
    console.log(err)
  });

  // fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  //   if (err) console.log(err);
  //   else {
  //     files.forEach((file, index) => {
  //       // fs.copyFile(path.join(__dirname, 'styles', file), bundlePath, (err) => {
  //       //   if(err) console.log(err);
  //       // });
  //       fs.readFile(path.join(__dirname, 'styles', file), 'utf8', function(err, contents) {
  //         // console.log(contents);
  //         dataArr.push(contents);
  //         });
  //     });
  //   }
  // });

}
