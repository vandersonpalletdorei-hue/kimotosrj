async function test() {
  try {
    console.log("Testing /api/supabase/status...");
    const res1 = await fetch('http://localhost:3000/api/supabase/status');
    const data1 = await res1.json();
    console.log("Status:", JSON.stringify(data1, null, 2));

    console.log("\nTesting /api/products...");
    const res2 = await fetch('http://localhost:3000/api/products');
    const data2 = await res2.json();
    console.log("Products count:", data2.products?.length, "Source:", data2.source);
    if (data2.products?.[0]) {
      console.log("First product sample:", JSON.stringify(data2.products[0], null, 2));
    }

    console.log("\nTesting /api/categories...");
    const res3 = await fetch('http://localhost:3000/api/categories');
    const data3 = await res3.json();
    console.log("Categories count:", data3.categories?.length, "Source:", data3.source);
    if (data3.categories?.[0]) {
      console.log("First category sample:", JSON.stringify(data3.categories[0], null, 2));
    }
  } catch(e: any) {
    console.error("Fetch failed:", e.message);
  }
}
test();
