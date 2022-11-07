const fs = require('fs'),
      path = require('path');

fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    let filesCopyStatus = false;
    files.forEach(file => {
      if (!file.isFile() && file.name == 'files-copy') {
        filesCopyStatus = true;
        clearDir();
        createAndCopyFiles();
      }
    });
    if (!filesCopyStatus) {
      fs.mkdir(path.join(__dirname, 'files-copy'), err => {
        if(err) throw err;
      });
      createAndCopyFiles();
    }
  }
});

function createAndCopyFiles() {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
          if(err) console.log(err);
        });
      });
    }
  });
}

function clearDir() {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
      fs.unlink(path.join(path.join(__dirname, 'files-copy'), file), err => {
        if (err) throw err;
      });
    }
  });
}
