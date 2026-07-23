import fs from 'fs';

try {
  const p = JSON.parse(fs.readFileSync('src/products_db.json', 'utf8'));
  const c = JSON.parse(fs.readFileSync('src/categories_db.json', 'utf8'));
  console.log("Count of products in products_db.json:", p.length);
  console.log("Count of categories in categories_db.json:", c.length);
  // print a few ids
  console.log("Product ids:", p.map((item: any) => item.id));
} catch(e: any) {
  console.error(e.message);
}
