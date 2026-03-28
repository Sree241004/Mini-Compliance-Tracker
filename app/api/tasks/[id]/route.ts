import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | any }
) {
  try {
    const { id } = await (params as Promise<{ id: string }> | { id: string });
    const body = await request.json();
    
    const rs = await db.execute({
      sql: "UPDATE Task SET status = ? WHERE id = ? RETURNING *",
      args: [body.status, parseInt(id)]
    });
    
    return NextResponse.json(rs.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
