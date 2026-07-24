const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

try {
    const rootPath = process.cwd();
    const zip = new AdmZip();

    const addFilesRecursively = (dirPath, zipPath) => {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.env') continue;

        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          addFilesRecursively(fullPath, path.join(zipPath, file));
        } else {
          zip.addLocalFile(fullPath, zipPath);
        }
      }
    };

    addFilesRecursively(rootPath, '');
    const buffer = zip.toBuffer();
    console.log("Zip generated, size:", buffer.length);
} catch (e) {
    console.error(e);
}
