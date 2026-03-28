import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
