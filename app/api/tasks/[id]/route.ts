import { NextResponse } from "next/server";
import { db } from "@/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields: id and status" }, { status: 400 });
    }

    const result = await db.execute({
      sql: "UPDATE tasks SET status = ? WHERE id = ? RETURNING *",
      args: [status, parseInt(id, 10)],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
