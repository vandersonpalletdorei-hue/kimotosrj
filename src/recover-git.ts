import fs from 'fs';
import path from 'path';

function main() {
  const gitDir = path.join(process.cwd(), '.git');
  console.log(".git directory exists:", fs.existsSync(gitDir));
  if (fs.existsSync(gitDir)) {
    try {
      const gitFiles = fs.readdirSync(gitDir);
      console.log("Contents of .git:", gitFiles);
      
      const refsPath = path.join(gitDir, 'refs', 'heads');
      if (fs.existsSync(refsPath)) {
        console.log("Branches:", fs.readdirSync(refsPath));
      }
      
      // Let's read the git logs to see commits
      const logsPath = path.join(gitDir, 'logs', 'HEAD');
      if (fs.existsSync(logsPath)) {
        console.log("HEAD LOGS (last 5 lines):");
        const logs = fs.readFileSync(logsPath, 'utf8').trim().split('\n');
        console.log(logs.slice(-5).join('\n'));
      }
    } catch (err: any) {
      console.error("Error reading .git directory:", err.message);
    }
  }
}
main();
