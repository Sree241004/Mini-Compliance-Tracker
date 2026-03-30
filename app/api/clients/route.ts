import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let clients = await prisma.client.findMany();

    // Auto-seed in production or Vercel if DB is empty
    if (clients.length === 0) {
      console.log('Database empty, automatically seeding...');
      
      const acmeCorp = await prisma.client.create({
        data: { company_name: 'Acme Corp', country: 'USA', entity_type: 'C-Corp' },
      });
      const globex = await prisma.client.create({
        data: { company_name: 'Globex Inc', country: 'UK', entity_type: 'LTD' },
      });
      
      await prisma.task.createMany({
        data: [
          {
            title: 'Quarterly Tax Filing',
            description: 'File Q1 2026 tax returns accurately.',
            category: 'Tax',
            due_date: new Date('2026-04-15'),
            priority: 'High',
            status: 'Pending',
            client_id: acmeCorp.id,
          },
          {
            title: 'Annual Audit Report',
            description: 'Complete the end-of-year compliance audit.',
            category: 'Audit',
            due_date: new Date('2025-12-31'),
            priority: 'High',
            status: 'Pending',
            client_id: acmeCorp.id,
          },
          {
            title: 'Health & Safety Update',
            description: 'Routine compliance check. Update manual.',
            category: 'HR',
            due_date: new Date('2026-06-01'),
            priority: 'Medium',
            status: 'Completed',
            client_id: globex.id,
          },
          {
            title: 'Data Privacy Review',
            description: 'Review GDPR and CCPA updates.',
            category: 'Legal',
            due_date: new Date('2026-05-20'),
            priority: 'Low',
            status: 'Pending',
            client_id: globex.id,
          },
        ]
      });

      // Refetch clients after seeding
      clients = await prisma.client.findMany();
    }

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
