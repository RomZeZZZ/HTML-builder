const fs = require('fs'),
  path = require('path'),
  pathFiles = path.join(__dirname, 'secret-folder');

fs.readdir(pathFiles, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    console.log("\nsecret-folder directory files:");
    files.forEach(file => {
      if (file.isFile()) {
        let pathFile = path.join(pathFiles, file.name);
        fs.stat(pathFile, (err, stats) => {
          if (err) console.log(err);
          console.log(path.parse(pathFile).name + ' - ' + path.parse(pathFile).ext.slice(1) + ' - ' + Math.floor(stats.size/1024 * 1000) / 1000 + 'kb');
        });
      }
    });
  }
});

