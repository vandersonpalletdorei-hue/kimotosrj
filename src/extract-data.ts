import fs from 'fs';
import path from 'path';

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');

  // Let's find patterns like: id: "something" or name: "something" or price: 123.45 etc.
  // In minified JS, keys could be unquoted, like {id:"...",name:"...",category:"...",price:589.9}
  // Let's search for objects starting with id: or having price:.
  // We can write a searcher that walks the file and extracts arrays or structures.
  
  // Let's locate the word "INITIAL_PRODUCTS" or similar.
  // Let's print out what is around "Rapid Matte" or "Norisk Razor" or "Diablo" if it exists.
  const terms = ['Rapid Single', 'Norisk Razor', 'Diablo Rosso', 'Motul 5100', 'Fit X', 'Tomok'];
  for (const term of terms) {
    const idx = js.indexOf(term);
    if (idx !== -1) {
      console.log(`\nFound term "${term}" at index ${idx}:`);
      console.log(js.slice(Math.max(0, idx - 400), Math.min(js.length, idx + 400)));
    } else {
      console.log(`\nTerm "${term}" NOT found.`);
    }
  }

  // Let's search for categories in the bundle
  const catTerms = ['capacetes', 'pneus', 'lubrificantes', 'acessorios', 'jaquetas', 'luvas'];
  for (const cat of catTerms) {
    const idx = js.indexOf(`"${cat}"`);
    const idx2 = js.indexOf(`'${cat}'`);
    if (idx !== -1) {
      console.log(`Found category "${cat}" (double-quoted) around index ${idx}:`);
      console.log(js.slice(Math.max(0, idx - 150), Math.min(js.length, idx + 150)));
    }
    if (idx2 !== -1) {
      console.log(`Found category '${cat}' (single-quoted) around index ${idx2}:`);
      console.log(js.slice(Math.max(0, idx2 - 150), Math.min(js.length, idx2 + 150)));
    }
  }
}
main();
