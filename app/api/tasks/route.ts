import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (clientId) {
      const result = await db.execute({
        sql: "SELECT * FROM tasks WHERE client_id = ?",
        args: [parseInt(clientId, 10)],
      });
      return NextResponse.json(result.rows);
    } else {
      const result = await db.execute("SELECT * FROM tasks");
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, due_date, status, priority, client_id } = body;

    // Basic validation
    if (!title || !category || !due_date || !client_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const defaultStatus = status || "Pending";
    const defaultPriority = priority || "Medium";

    const result = await db.execute({
      sql: `INSERT INTO tasks (title, description, category, due_date, status, priority, client_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [title, description || "", category, due_date, defaultStatus, defaultPriority, client_id],
    });

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
