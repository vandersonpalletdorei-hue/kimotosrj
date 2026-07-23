import fs from 'fs';

function main() {
  const js = fs.readFileSync('src/downloaded_index.js', 'utf8');

  // Find where the products array starts
  const firstId = 'id:"cap-ls2-01"';
  const firstIdIdx = js.indexOf(firstId);
  if (firstIdIdx === -1) {
    console.error("Could not find first product ID");
    return;
  }

  // Go backwards to find the bracket [ that starts the product array
  let arrayStartIdx = -1;
  for (let i = firstIdIdx; i >= 0; i--) {
    if (js[i] === '[') {
      // Check if it's preceded by an assignment or comma, e.g. "products=[" or similar
      // Since it's minified, it might be `something=[{id:"cap-ls2-01"`
      arrayStartIdx = i;
      break;
    }
  }

  if (arrayStartIdx === -1) {
    console.error("Could not find start of products array");
    return;
  }

  console.log("Products array start index:", arrayStartIdx);
  
  // Go forward from arrayStartIdx to find the matching closing bracket ]
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
    console.error("Could not find matching closing bracket");
    return;
  }

  console.log("Products array end index:", arrayEndIdx);
  const arrayText = js.slice(arrayStartIdx, arrayEndIdx + 1);

  console.log("Array text length:", arrayText.length);
  console.log("Array text start snippet:", arrayText.slice(0, 300));
  console.log("Array text end snippet:", arrayText.slice(-300));

  // Let's parse/eval the array text by creating a safe script
  try {
    // In minified code, references like `!0` represent `true`, `!1` represent `false`.
    // Let's wrap it in a function and run it.
    // Also we can replace any references if they exist, but let's see if we can eval directly
    const evalScript = `
      const products = ${arrayText};
      console.log(JSON.stringify(products, null, 2));
    `;
    
    // Write eval script to temporary file and run it
    fs.writeFileSync('src/eval-products.ts', evalScript);
    console.log("Created evaluation script at src/eval-products.ts");
  } catch (err: any) {
    console.error("Error setting up eval:", err.message);
  }
}
main();
