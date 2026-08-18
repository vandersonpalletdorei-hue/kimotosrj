const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.supabase);
async function run() {
  const products = [];
  for(let i=0; i<101; i++) {
    products.push(`prod-test-${i}`);
  }
  const { data, error } = await supabase.from('produtos').delete().in('id', products);
  console.log("Cleanup result:", error || "success");
}
run();
