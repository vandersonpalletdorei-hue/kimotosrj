import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const supabaseKey = process.env.supabase || '';
  if (!supabaseKey) return;

  let supabaseUrl = '';
  try {
    const parts = supabaseKey.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      if (payload.ref) {
        supabaseUrl = `https://${payload.ref}.supabase.co`;
      }
    }
  } catch {}

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching from table 'produtos'...");
  const { data: produtos, error: prodErr } = await supabase.from('produtos').select('*');
  if (prodErr) {
    console.error("error fetching 'produtos':", prodErr);
  } else {
    console.log("Count of 'produtos':", produtos?.length);
    if (produtos && produtos.length > 0) {
      console.log("Sample product:", JSON.stringify(produtos[0], null, 2));
    }
  }

  console.log("Fetching from table 'categorias'...");
  const { data: categorias, error: catErr } = await supabase.from('categorias').select('*');
  if (catErr) {
    console.error("error fetching 'categorias':", catErr);
  } else {
    console.log("Count of 'categorias':", categorias?.length);
    if (categorias && categorias.length > 0) {
      console.log("Sample category:", JSON.stringify(categorias[0], null, 2));
    }
  }
}

main();
