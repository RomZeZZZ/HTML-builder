const fs = require('fs');
const path = require('path');

let fileName = 'text.txt';
let filePath = path.join(__dirname, fileName);

const stream = fs.createReadStream(filePath, "UTF-8");
stream.on('data', (data) => {
  console.log(data);
});