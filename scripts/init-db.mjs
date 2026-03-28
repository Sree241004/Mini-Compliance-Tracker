import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function init() {
  console.log("Initializing database...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Client (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      country TEXT NOT NULL,
      entity_type TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      priority TEXT NOT NULL DEFAULT 'Medium',
      client_id INTEGER NOT NULL,
      FOREIGN KEY (client_id) REFERENCES Client (id)
    );
  `);

  console.log("Tables created successfully.");

  // Insert some seed data if Client table is empty
  const res = await client.execute("SELECT COUNT(*) AS count FROM Client");
  if (res.rows[0].count === 0) {
    console.log("Seeding initial data...");
    await client.execute("INSERT INTO Client (company_name, country, entity_type) VALUES ('Acme Corp', 'USA', 'LLC')");
    await client.execute("INSERT INTO Client (company_name, country, entity_type) VALUES ('Globex', 'UK', 'Corporation')");
    
    await client.execute("INSERT INTO Task (title, description, category, due_date, status, priority, client_id) VALUES ('Annual Report', 'File annual financial report', 'Finance', '2026-12-31', 'Pending', 'High', 1)");
    await client.execute("INSERT INTO Task (title, description, category, due_date, status, priority, client_id) VALUES ('Tax Return', 'Submit corporate tax return', 'Legal', '2026-04-15', 'Pending', 'Medium', 2)");
    console.log("Seed data inserted.");
  } else {
    console.log("Database already contains data, skipping seed.");
  }

  process.exit(0);
}

init().catch((err) => {
  console.error("Failed to initialize database", err);
  process.exit(1);
});
