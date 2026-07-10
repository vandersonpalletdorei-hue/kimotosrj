import fs from 'fs';

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');

  // Let's locate the index of categories
  const catIdx = js.indexOf('ds=[');
  if (catIdx !== -1) {
    console.log("Categories array position:", catIdx);
    const catSection = js.slice(catIdx, catIdx + 2000);
    console.log("Categories section:");
    console.log(catSection);
  }

  // Let's also print out products: where the array starting with [{id:"cap-ls2-01" or other products starts.
  // We can search for 'id:"cap-norisk-02"' inside js.
  const prodIdx = js.indexOf('id:"cap-norisk-02"');
  if (prodIdx !== -1) {
    console.log("\nProducts list location:", prodIdx);
    // Let's go backwards to find the start of the products array
    const startOfList = js.lastIndexOf('[', prodIdx);
    console.log("Products list starts around:", startOfList);
    // Let's print out the content from startOfList to 25000 characters later (where the products array usually sits)
    const productsSection = js.slice(startOfList, startOfList + 30000);
    console.log("A snippet of products list (first 2000 chars):");
    console.log(productsSection.slice(0, 2000));
    
    // Write full products block to a temporary text file for easy inspection or parsing!
    fs.writeFileSync('src/products_block.txt', productsSection);
    console.log("\nSaved products block to src/products_block.txt for inspection.");
  }
}
main();
