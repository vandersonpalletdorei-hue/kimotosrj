import fs from 'fs';

function extractArray(js: string, startSearchStr: string, backBracket = false) {
  const startIdx = js.indexOf(startSearchStr);
  if (startIdx === -1) {
    throw new Error("Could not find start search string: " + startSearchStr);
  }

  let arrayStartIdx = startIdx;
  if (backBracket) {
    arrayStartIdx = -1;
    for (let i = startIdx; i >= 0; i--) {
      if (js[i] === '[') {
        arrayStartIdx = i;
        break;
      }
    }
  } else {
    // If we're searching for "ds=[" we want the bracket right after the identifier
    arrayStartIdx = js.indexOf('[', startIdx);
  }

  if (arrayStartIdx === -1) {
    throw new Error("Could not find start bracket near: " + startSearchStr);
  }

  let bracketCount = 0;
  let arrayEndIdx = -1;
  let inString: string | null = null;
  let escaped = false;

  for (let i = arrayStartIdx; i < js.length; i++) {
    const char = js[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '[') {
      bracketCount++;
    } else if (char === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        arrayEndIdx = i;
        break;
      }
    }
  }

  if (arrayEndIdx === -1) {
    throw new Error("Could not find matching closing bracket or array empty");
  }

  return js.slice(arrayStartIdx, arrayEndIdx + 1);
}

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');

  try {
    // 1. Extract products
    const productsText = extractArray(js, 'id:"cap-ls2-01"', true);
    console.log("Successfully extracted products text. Length:", productsText.length);

    // 2. Extract categories (it is 'ds=[{id:"todos",...')
    const categoriesText = extractArray(js, 'ds=[', false);
    console.log("Successfully extracted categories text. Length:", categoriesText.length);

    // 3. Extract FAQ cards (it is 'Cx=[{question:"...')
    const faqText = extractArray(js, 'Cx=[', false);
    console.log("Successfully extracted FAQs text. Length:", faqText.length);

    // 4. Extract Brands (it is 'j0=["LS2",...')
    const brandsText = extractArray(js, 'j0=[', false);
    console.log("Successfully extracted brands text. Length:", brandsText.length);

    // Create execution environments to evaluate js snippets into JSON
    const evalCode = `
      const products = ${productsText};
      const categories = ${categoriesText};
      const faqs = ${faqText};
      const brands = ${brandsText};

      const fs = require('fs');
      fs.writeFileSync('src/products_db.json', JSON.stringify(products, null, 2));
      fs.writeFileSync('src/categories_db.json', JSON.stringify(categories, null, 2));
      fs.writeFileSync('src/faqs_db.json', JSON.stringify(faqs, null, 2));
      fs.writeFileSync('src/brands_db.json', JSON.stringify(brands, null, 2));
      console.log("Successfully evaluated and synchronized database JSON files!");
    `;

    fs.writeFileSync('src/sync-runner.cjs', evalCode);
    console.log("Sync runner created at src/sync-runner.cjs");

  } catch (err: any) {
    console.error("Extraction error:", err.message);
  }
}
main();
