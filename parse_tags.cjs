const fs = require('fs');
const content = fs.readFileSync('temp_return.tsx', 'utf8');

let depth = 0;
let inString = false;
let stringChar = '';

let lines = content.split('\n');
let tags = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let m1 = line.match(/<([A-Za-z0-9_]+)(?![^>]*\/>)[^>]*>/g);
  let m2 = line.match(/<\/[A-Za-z0-9_]+>/g);
  let m3 = line.match(/<>/g);
  let m4 = line.match(/<\/>/g);

  if (m1) {
    m1.forEach(t => {
      let tagName = t.match(/<([A-Za-z0-9_]+)/)[1];
      if (tagName !== 'input' && tagName !== 'img' && !t.endsWith('/>')) {
         tags.push({line: i+1, type: 'open', tag: tagName});
      }
    });
  }
  if (m2) {
    m2.forEach(t => {
      let tagName = t.match(/<\/([A-Za-z0-9_]+)>/)[1];
      tags.push({line: i+1, type: 'close', tag: tagName});
    });
  }
  if (m3) tags.push({line: i+1, type: 'open', tag: 'Fragment'});
  if (m4) tags.push({line: i+1, type: 'close', tag: 'Fragment'});
}

let stack = [];
for (let i = 0; i < tags.length; i++) {
  let t = tags[i];
  if (t.type === 'open') {
    stack.push(t);
  } else {
    if (stack.length > 0 && stack[stack.length - 1].tag === t.tag) {
      stack.pop();
    } else {
      console.log('Mismatched close at line ' + t.line + ' (expected ' + (stack.length > 0 ? stack[stack.length - 1].tag : 'nothing') + ' but got ' + t.tag + ')');
    }
  }
}

if (stack.length > 0) {
  console.log('Unclosed tags:', stack);
}
