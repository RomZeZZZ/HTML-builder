const fs = require('fs'),
  path = require('path'),
  readLine = require('readline'),
  outputPath = path.join(__dirname, 'output.txt'),
  writeStream = fs.createWriteStream(outputPath),
  stdIn = process.stdin,
  rl = readLine.createInterface({ input: stdIn, output: writeStream });

console.log('Please enter text');

rl.on('line', (input) => {
  if (input.toLowerCase() == 'exit') {
    writeStream.end();
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('close', () => {
  console.log("Goodbye!");
});

process.on('SIGINT', () => {
  writeStream.end();
  rl.close();
  process.exit();
});


