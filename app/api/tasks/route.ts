import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    let rs;
    if (clientId) {
      rs = await db.execute({
        sql: "SELECT * FROM Task WHERE client_id = ? ORDER BY due_date ASC",
        args: [parseInt(clientId)]
      });
    } else {
      rs = await db.execute("SELECT * FROM Task ORDER BY due_date ASC");
    }

    return NextResponse.json(rs.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rs = await db.execute({
      sql: `INSERT INTO Task (title, description, category, due_date, status, priority, client_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        body.title, 
        body.description || null, 
        body.category, 
        body.due_date, 
        "Pending", 
        body.priority || "Medium", 
        body.client_id
      ]
    });
    return NextResponse.json(rs.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create task", error)
    return NextResponse.json({ error: "Failed to create task", details: String(error) }, { status: 500 });
  }
}
