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
    console.error("Failed to create task", error)
    return NextResponse.json({ error: "Failed to create task", details: String(error) }, { status: 500 });
  }
}
