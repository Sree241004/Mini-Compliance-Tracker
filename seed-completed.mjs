import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local.db",
});

async function main() {
  await db.execute({
    sql: `INSERT INTO Task (title, description, category, due_date, status, priority, client_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["Completed Fake Task", "This task is completed", "Legal", "2026-01-01", "Completed", "Medium", 1]
  });
  console.log("Added completed task!");
}

main();
