const fs = require('fs');
const path = require('path');

function findFiles(dir, match) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      let stat;
      try { stat = fs.statSync(fullPath); } catch (e) { continue; }
      if (stat.isDirectory()) {
        if (item !== 'node_modules' && item !== '.npm' && item !== '.cache') {
          findFiles(fullPath, match);
        }
      } else {
        if (item.includes(match)) {
          console.log("Found file match:", fullPath);
        }
      }
    }
  } catch(e) {}
}

console.log("Scanning /tmp for files...");
findFiles('/tmp', '');
console.log("Scanning /opt for files...");
findFiles('/opt', '');
