import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } | any
) {
  try {
    const { id } = await (params as Promise<{ id: string }> | { id: string });
    const body = await request.json();
    
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status: body.status }
    });
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
