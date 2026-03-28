import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local.db",
});

async function main() {
  try {
    console.log("Updating task 1 to Completed...");
    const rs = await db.execute({
      sql: "UPDATE Task SET status = ? WHERE id = ? RETURNING *",
      args: ["Completed", 1]
    });
    console.log("Update success:", rs.rows);
  } catch (err) {
    console.error("Update failed:", err.message);
  }
}

main();
