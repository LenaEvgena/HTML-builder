const quote = './text.txt';
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, quote);
// console.log(filePath);

let text = fs.createReadStream(filePath, 'utf8');
// console.log(text);

text.on('data', (data) => console.log(data));
