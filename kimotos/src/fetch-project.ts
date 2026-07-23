async function main() {
  try {
    const res = await fetch('https://kimotos.netlify.app/');
    const text = await res.text();
    console.log("HTML CONTENT:");
    console.log(text);
  } catch (err: any) {
    console.error("Fetch error:", err.message);
  }
}
main();
