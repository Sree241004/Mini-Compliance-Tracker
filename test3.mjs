async function run() {
  const getRes = await fetch("http://localhost:3000/api/clients");
  console.log("Status:", getRes.status);
  const text = await getRes.text();
  console.log("Response length:", text.length, "Preview:", text.slice(0, 500));
}
run();
