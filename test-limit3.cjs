const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.supabase);
supabase.from('produtos').select('id', { count: 'exact' }).then(({data, count, error}) => console.log("count:", count, "data:", data ? data.length : error));
