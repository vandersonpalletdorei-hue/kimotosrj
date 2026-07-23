import fs from 'fs';

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');

  // Let's find some product IDs
  const matches = js.match(/id:"[^"]+"/g);
  console.log("Found matches for IDs:", matches ? matches.length : 0);
  if (matches) {
    console.log("First 15 IDs found in bundle:", matches.slice(0, 15));
  }

  // Find the exact location of the first product ID
  if (matches && matches.length > 0) {
    const firstId = matches[0];
    const firstIdIdx = js.indexOf(firstId);
    console.log(`First ID "${firstId}" is at index ${firstIdIdx}`);
    // Let's print 1000 characters before and after to locate the array start
    console.log("Snippet around first ID:");
    console.log(js.slice(firstIdIdx - 100, firstIdIdx + 1100));
  }
}
main();
