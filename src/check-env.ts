console.log("Environment keys:");
console.log(Object.keys(process.argv));
console.log("process.env keys:", Object.keys(process.env).filter(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('key') || k.toLowerCase().includes('db') || k.toLowerCase().includes('url')));
console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("supabase exists in env:", !!process.env.supabase);
