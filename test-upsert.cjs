const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.supabase);
async function run() {
  const products = [];
  for(let i=0; i<101; i++) {
    products.push({
      id: `prod-test-${i}`,
      codigo: `prod-test-${i}`,
      nome: `Product ${i}`,
      preco: 10
    });
  }
  const { data, error } = await supabase.from('produtos').upsert(products, { onConflict: 'id' });
  console.log("Upsert result:", error || "success");
}
run();
