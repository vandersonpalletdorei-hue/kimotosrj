import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const supabaseKey = process.env.supabase || '';
  if (!supabaseKey) {
    console.error("No supabase key found!");
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

  if (!supabaseUrl) return;

  console.log("Fetching OpenAPI spec from:", supabaseUrl);
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    if (!res.ok) {
      console.error("HTTP error:", res.status, res.statusText);
      const text = await res.text();
      console.error("Response:", text);
      return;
    }
    const data = await res.json();
    console.log("Definitions (tables) found in Supabase schema:");
    if (data.definitions) {
      console.log(Object.keys(data.definitions));
    } else {
      console.log("No definitions found in OpenAPI spec:", Object.keys(data));
    }
  } catch (err: any) {
    console.error("Exception fetching spec:", err.message);
  }
}

main();
