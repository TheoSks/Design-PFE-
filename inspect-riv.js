const fs = require('fs');
const data = fs.readFileSync('public/character-animation-sm-mobile.riv');
const strings = [];
let current = '';
for (let i = 0; i < data.length; i++) {
  const b = data[i];
  if (b >= 32 && b < 127) {
    current += String.fromCharCode(b);
  } else {
    if (current.length >= 3) strings.push(current);
    current = '';
  }
}
if (current.length >= 3) strings.push(current);
const unique = [...new Set(strings)].filter(s => s.length > 3);
console.log(unique.join('\n'));
