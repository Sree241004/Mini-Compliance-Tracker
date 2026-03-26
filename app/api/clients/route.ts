import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM clients");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}
