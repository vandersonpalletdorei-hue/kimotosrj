import fs from 'fs';
import path from 'path';

function findFiles(dir: string, match: string) {
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
           console.log("Found file match:", fullPath, "size:", stat.size);
         }
      }
    }
  } catch(e) {}
}

console.log("Scanning /tmp for files...");
findFiles('/tmp', 'kimotos');
findFiles('/tmp', '.zip');
console.log("Scanning /opt for files...");
findFiles('/opt', 'kimotos');
console.log("Scanning workspace root parent for projects:");
try {
  const parent = path.dirname(process.cwd());
  const files = fs.readdirSync(parent);
  console.log("Parent contents:", files);
  for (const file of files) {
    const full = path.join(parent, file);
    try {
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        console.log(`Directory: ${file}`);
        if (file !== 'applet') {
          console.log(`Contents of ${file}:`, fs.readdirSync(full));
        }
      }
    } catch {}
  }
} catch (e) {}
