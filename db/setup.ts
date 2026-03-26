import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

async function setup() {
  console.log("Setting up the database...");

  // Drop tables if they exist to start fresh
  await db.execute("DROP TABLE IF EXISTS tasks;");
  await db.execute("DROP TABLE IF EXISTS clients;");

  // Create clients table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      country TEXT NOT NULL,
      entity_type TEXT NOT NULL
    );
  `);

  // Create tasks table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      client_id INTEGER NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
  `);

  // Insert seed clients
  console.log("Seeding clients...");
  await db.execute(`
    INSERT INTO clients (company_name, country, entity_type) VALUES 
    ('ABC Pvt Ltd', 'India', 'Private'),
    ('XYZ Corp', 'USA', 'Corporation'),
    ('Global Tech', 'UK', 'LLP');
  `);

  const { rows: clients } = await db.execute("SELECT id FROM clients;");

  // Insert seed tasks
  console.log("Seeding tasks...");
  await db.execute({
    sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["GST Filing", "Monthly GST filing", "Tax", "2026-03-01", "Pending", "High", clients[0].id]
  });

  await db.execute({
    sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["Annual Report", "Yearly report", "Compliance", "2026-02-01", "Pending", "High", clients[0].id]
  });

  await db.execute({
    sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["Income Tax Filing", "File income tax", "Tax", "2026-04-01", "Completed", "Medium", clients[1].id]
  });

  await db.execute({
    sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["Audit", "Internal audit", "Audit", "2026-01-15", "Pending", "High", clients[1].id]
  });

  await db.execute({
    sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["Payroll Filing", "Monthly payroll", "HR", "2026-03-20", "Pending", "Low", clients[2].id]
  });

  console.log("Seed data added ✅");
}

setup().catch(console.error);
