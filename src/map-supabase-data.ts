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

  console.log("Fetching 'produtos'...");
  const { data: produtos } = await supabase.from('produtos').select('*');
  if (produtos) {
    console.log("Total products fetched from 'produtos':", produtos.length);
    const active = produtos.filter(p => p.ativo !== false);
    console.log("Active products (ativo !== false):", active.length);
    
    // Check fields populated
    let withPrice = 0;
    let withImage = 0;
    let withDescription = 0;
    produtos.forEach((p: any) => {
      if (p.preco !== null && p.preco !== undefined) withPrice++;
      if (p.imagem !== null && p.imagem !== undefined) withImage++;
      if (p.descricao !== null && p.descricao !== undefined) withDescription++;
    });

    console.log(`Stats - with price: ${withPrice}, with image: ${withImage}, with description: ${withDescription}`);
    // Print a few items that are different
    console.log("First 5 products in detail:\n", JSON.stringify(produtos.slice(0, 5), null, 2));
  }
}

main();
