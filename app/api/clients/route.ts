import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const rs = await db.execute("SELECT * FROM Client");
    return NextResponse.json(rs.rows);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
