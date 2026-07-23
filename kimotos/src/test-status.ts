async function testStatus() {
  const res1 = await fetch('http://localhost:3000/api/supabase/status');
  const data1 = await res1.json();
  console.log("Status:", JSON.stringify(data1, null, 2));
}
testStatus();
