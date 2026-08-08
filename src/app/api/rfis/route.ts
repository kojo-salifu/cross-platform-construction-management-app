import { NextResponse } from "next/server";
import { db } from "@/db";
import { rfis } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const allRfis = await db
      .select()
      .from(rfis)
      .where(eq(rfis.projectId, parseInt(projectId)))
      .orderBy(desc(rfis.createdAt));

    return NextResponse.json(allRfis);
  } catch (error) {
    console.error("Error fetching RFIs:", error);
    return NextResponse.json({ error: "Failed to fetch RFIs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newRfi = await db
      .insert(rfis)
      .values({
        projectId: body.projectId,
        rfiNumber: body.rfiNumber,
        subject: body.subject,
        description: body.description,
        priority: body.priority,
        assignedTo: body.assignedTo,
        status: body.status || "open",
        targetDate: body.targetDate,
        createdBy: body.createdBy,
      })
      .returning();

    return NextResponse.json(newRfi[0], { status: 201 });
  } catch (error) {
    console.error("Error creating RFI:", error);
    return NextResponse.json({ error: "Failed to create RFI" }, { status: 500 });
  }
}
