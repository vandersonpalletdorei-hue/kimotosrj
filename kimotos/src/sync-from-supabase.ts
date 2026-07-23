import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const supabaseKey = process.env.supabase || '';
  if (!supabaseKey) {
    console.error("No supabase key in env!");
    return;
  }

  let supabaseUrl = '';
  try {
    const parts = supabaseKey.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      if (payload.ref) {
        supabaseUrl = `https://${payload.ref}.supabase.co`;
      }
    }
  } catch (err: any) {
    console.error("JWT Decode error:", err.message);
  }

  if (!supabaseUrl) return;

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Syncing categories from Supabase 'categorias' table...");
  const { data: rawCategories, error: catErr } = await supabase.from('categorias').select('*');
  if (catErr) {
    console.error("Failed to fetch categories:", catErr.message);
    return;
  }

  const categories = rawCategories.map((c: any) => ({
    id: c.id,
    name: c.nome,
    icon: c.icone || 'Shield',
    description: c.descricao || ''
  }));

  fs.writeFileSync('src/categories_db.json', JSON.stringify(categories, null, 2), 'utf8');
  console.log(`Saved ${categories.length} categories to src/categories_db.json`);

  console.log("Syncing products from Supabase 'produtos' table...");
  const { data: rawProdutos, error: prodErr } = await supabase.from('produtos').select('*');
  if (prodErr) {
    console.error("Failed to fetch products:", prodErr.message);
    return;
  }

  // Filter to configured products with price, image, and description (the 77 products!)
  const configured = rawProdutos.filter((p: any) => p.preco !== null && p.preco !== undefined);
  console.log(`Found ${configured.length} configured products among ${rawProdutos.length} total rows.`);

  const products = configured.map((p: any) => ({
    id: p.id,
    name: p.nome,
    category: p.categoria,
    categoryLabel: p.categoria_label || p.categoria,
    brand: p.marca || '',
    price: parseFloat(p.preco) || 0,
    originalPrice: p.preco_original ? parseFloat(p.preco_original) : (p.originalPrice ? parseFloat(p.originalPrice) : null),
    image: p.imagem || '',
    images: Array.isArray(p.imagens) ? p.imagens : (p.images ? p.images : []),
    description: p.descricao || '',
    rating: p.avaliacao !== null && p.avaliacao !== undefined ? parseFloat(p.avaliacao) : 5,
    reviewsCount: p.num_avaliacoes !== null && p.num_avaliacoes !== undefined ? parseInt(p.num_avaliacoes) : 0,
    isPromo: !!p.em_promocao,
    isNew: !!p.novo,
    freeShipping: !!p.frete_gratis,
    sizes: Array.isArray(p.tamanhos) ? p.tamanhos : [],
    stock: p.estoque !== null && p.estoque !== undefined ? parseInt(p.estoque) : 0,
    subcategory: p.subcategoria || '',
    attributes: p.atributos || null
  }));

  fs.writeFileSync('src/products_db.json', JSON.stringify(products, null, 2), 'utf8');
  console.log(`Saved ${products.length} products to src/products_db.json`);
}

main();
