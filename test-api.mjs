async function run() {
  const res = await fetch("http://localhost:3000/api/tasks/1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Completed" })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.json());

  const getRes = await fetch("http://localhost:3000/api/tasks?clientId=1");
  console.log("Tasks:", await getRes.json());
}
run();
