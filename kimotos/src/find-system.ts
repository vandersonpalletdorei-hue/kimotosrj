import fs from 'fs';
import path from 'path';

console.log("process.cwd():", process.cwd());
// Let's check listing of process.cwd() parent
try {
  const parent = path.dirname(process.cwd());
  console.log("Parent path:", parent);
  console.log("Parent contents:", fs.readdirSync(parent));
  // check if there are other directories in parent
  const parentItems = fs.readdirSync(parent);
  for (const item of parentItems) {
    const full = path.join(parent, item);
    const st = fs.statSync(full);
    if (st.isDirectory() && item !== 'applet') {
      console.log(`Directory ${item} contents:`, fs.readdirSync(full));
    }
  }
} catch (e: any) {
  console.log("Error walking parent:", e.message);
}

// Let's search the filesystem for any json files with 'products' in their name
function searchDir(currentDir: string, depth = 0) {
  if (depth > 5) return;
  try {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      if (item === 'node_modules' || item === '.npm' || item === '.cache' || item === '.git' || item === 'dist') continue;
      const full = path.join(currentDir, item);
      let stat;
      try { stat = fs.statSync(full); } catch { continue; }
      if (stat.isDirectory()) {
        searchDir(full, depth + 1);
      } else {
        if (item.endsWith('.json') && (item.includes('product') || item.includes('db') || item.includes('backup') || item.includes('temp'))) {
          console.log(`FOUND JSON MATCH: ${full} (size: ${stat.size} bytes, mtime: ${stat.mtime})`);
        }
      }
    }
  } catch {}
}

console.log("\nSearching for files starting from /app or /...");
searchDir('/app');
searchDir('/opt');
searchDir('/tmp');
searchDir(process.cwd());
