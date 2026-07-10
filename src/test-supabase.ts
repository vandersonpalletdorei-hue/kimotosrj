import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const supabaseKey = process.env.supabase || '';
  if (!supabaseKey) {
    console.error("No supabase key found in environment!");
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
    console.error("Error decoding:", err.message);
  }

  if (!supabaseUrl) {
    console.error("Could not decode supabase URL!");
    return;
  }

  console.log("Supabase URL decoded:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching categories from Supabase...");
  const { data: categories, error: catErr } = await supabase.from('categories').select('*');
  if (catErr) {
    console.error("Categories error:", catErr.message);
  } else {
    console.log("Found categories count:", categories?.length);
  }

  console.log("Fetching products from Supabase...");
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  if (prodErr) {
    console.error("Products error:", prodErr.message);
  } else {
    console.log("Found products count:", products?.length);
    if (products && products.length > 0) {
      console.log("Sample product IDs:", products.slice(0, 5).map(p => p.id));
      console.log("Sample product details (first):", JSON.stringify(products[0], null, 2));
    }
  }
}

main();
