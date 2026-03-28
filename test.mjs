import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local.db",
});

async function main() {
  // Check tasks
  const res = await db.execute("SELECT * FROM Task");
  console.log("Tasks:", res.rows);
}

main().catch(console.error);
