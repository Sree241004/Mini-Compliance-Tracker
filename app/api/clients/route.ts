import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
    return NextResponse.json(clients);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json([
        { id: 1, company_name: 'Acme Corp (Local Mock)', country: 'USA', entity_type: 'C-Corp' },
        { id: 2, company_name: 'Globex Inc (Local Mock)', country: 'UK', entity_type: 'LTD' }
      ]);
    }
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
