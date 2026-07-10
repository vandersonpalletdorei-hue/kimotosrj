import fs from 'fs';
import path from 'path';

async function main() {
  try {
    const jsUrl = 'https://kimotos.netlify.app/assets/index-DeoYIFVG.js';
    const cssUrl = 'https://kimotos.netlify.app/assets/index-CtsGf9R1.css';
    
    console.log("Fetching JS bundle...");
    const jsRes = await fetch(jsUrl);
    const jsText = await jsRes.text();
    fs.writeFileSync('src/downloaded_index.js', jsText);
    console.log("JS bundle size:", jsText.length, "bytes. Saved to src/downloaded_index.js");

    console.log("Fetching CSS bundle...");
    const cssRes = await fetch(cssUrl);
    const cssText = await cssRes.text();
    fs.writeFileSync('src/downloaded_index.css', cssText);
    console.log("CSS bundle size:", cssText.length, "bytes. Saved to src/downloaded_index.css");

    // Let's do some basic analysis:
    // 1. Search for category names
    console.log("\nSearching JS for some terms...");
    const terms = [
      'capacete', 'jaqueta', 'luva', 'pneu', 'lubrificante', 'escapamento', 'peças',
      'whatsapp', 'pix', 'cartão', 'entrega', 'frete', 'contato', 'admin', 'institucional'
    ];
    for (const term of terms) {
      const regex = new RegExp(term, 'gi');
      const matches = jsText.match(regex);
      console.log(`Term "${term}" matches:`, matches ? matches.length : 0);
    }

    // Attempt to extract string constants or JSON-like structures of initial categories or products
    // Localized strings might be in portuguese
    console.log("\nSample of strings around 'whatsapp' or 'pix':");
    const idx = jsText.indexOf('whatsapp');
    if (idx !== -1) {
      console.log(jsText.slice(Math.max(0, idx - 200), Math.min(jsText.length, idx + 200)));
    }

  } catch (err: any) {
    console.error("Analysis error:", err.message);
  }
}
main();
