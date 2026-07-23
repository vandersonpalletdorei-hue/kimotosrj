import fs from 'fs';

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');
  
  // Find all matches for id:"..." where ... is not a category
  // Let's inspect all strings matching id:"[a-z]{3}-[a-z0-9\-]+"
  const regex = /id:"([a-z]{3}-[a-z0-9\-]+)"/gi;
  let match;
  const ids: string[] = [];
  while ((match = regex.exec(js)) !== null) {
    ids.push(match[1]);
  }
  
  console.log("Total product-formatted IDs found in bundle:", ids.length);
  console.log("Found IDs:", ids);

  // Let's see if there are other occurrences of id:
  const generalRegex = /id:"([^"]+)"/g;
  const allIds: string[] = [];
  while ((match = generalRegex.exec(js)) !== null) {
    allIds.push(match[1]);
  }
  console.log("Total general IDs found in bundle:", allIds.length);
  // filter unique ones
  const uniqIds = Array.from(new Set(allIds));
  console.log("Unique IDs list:", uniqIds);
  console.log("Unique count:", uniqIds.length);
}
main();
