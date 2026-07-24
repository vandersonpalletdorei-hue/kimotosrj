import AdmZip from 'adm-zip';
console.log(typeof AdmZip);
try {
  const zip = new AdmZip();
  console.log("Success");
} catch (e) {
  console.error("Error:", e.message);
}
