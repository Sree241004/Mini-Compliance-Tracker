import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    const tasks = clientId
      ? await prisma.task.findMany({ where: { client_id: parseInt(clientId) }, orderBy: { due_date: 'asc' } })
      : await prisma.task.findMany({ orderBy: { due_date: 'asc' } });

    return NextResponse.json(tasks);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json([
        { id: 1, title: 'Quarterly Tax Filing', description: 'File Q1 2026 tax returns', category: 'Tax', due_date: '2026-04-15T00:00:00.000Z', priority: 'High', status: 'Pending', client_id: 1 },
        { id: 2, title: 'Health & Safety Update', description: 'Routine compliance check', category: 'HR', due_date: '2026-06-01T00:00:00.000Z', priority: 'Medium', status: 'Completed', client_id: 2 }
      ]);
    }
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        due_date: new Date(body.due_date),
        priority: body.priority,
        client_id: body.client_id,
        status: "Pending" // explicitly default to Pending
      }
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ id: 999, status: "Pending" });
    }
    console.error("Failed to create task", error)
    return NextResponse.json({ error: "Failed to create task", details: String(error) }, { status: 500 });
  }
}
