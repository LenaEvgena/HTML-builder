const quote = './yourText.txt';
const path = require('path');
const fs = require('fs');
const stdout = process.stdout;
const stdin = process.stdin;
const filePath = path.join(__dirname, quote);

let textFile = fs.createWriteStream(filePath);

stdout.write('What is your name?\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  textFile.write(data);
});

process.on('exit', () => stdout.write('Good luck!'));
process.on('SIGINT', () => process.exit());
