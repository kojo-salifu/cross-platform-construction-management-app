import { NextResponse } from "next/server";
import { db } from "@/db";
import { concretePours } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const pours = await db
      .select()
      .from(concretePours)
      .where(eq(concretePours.projectId, parseInt(projectId)))
      .orderBy(desc(concretePours.pourDate));

    return NextResponse.json(pours);
  } catch (error) {
    console.error("Error fetching concrete pours:", error);
    return NextResponse.json({ error: "Failed to fetch concrete pours" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newPour = await db
      .insert(concretePours)
      .values({
        reportId: body.reportId,
        projectId: body.projectId,
        elementLocation: body.elementLocation,
        mixDesign: body.mixDesign,
        supplier: body.supplier,
        volumeM3: body.volumeM3,
        slumpMm: body.slumpMm,
        deliveryTicketNumber: body.deliveryTicketNumber,
        cylinderBatchId: body.cylinderBatchId,
        qcResult: body.qcResult || "pending",
        qcNotes: body.qcNotes,
        pourDate: body.pourDate,
      })
      .returning();

    return NextResponse.json(newPour[0], { status: 201 });
  } catch (error) {
    console.error("Error creating concrete pour:", error);
    return NextResponse.json({ error: "Failed to create concrete pour" }, { status: 500 });
  }
}
