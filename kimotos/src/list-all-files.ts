import fs from 'fs';
import path from 'path';

function listAll(dir: string) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules' || file === '.npm' || file === '.cache' || file === '.git' || file === 'dist') continue;
      const full = path.join(dir, file);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        listAll(full);
      } else {
        console.log(`${full} (${st.size} bytes, mtime: ${st.mtime})`);
      }
    }
  } catch {}
}

listAll(process.cwd());
