import { NextResponse } from "next/server";
import { db } from "@/db";
import { boqItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const items = await db
      .select()
      .from(boqItems)
      .where(eq(boqItems.projectId, parseInt(projectId)));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching BOQ items:", error);
    return NextResponse.json({ error: "Failed to fetch BOQ items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contractBudget = parseFloat(body.contractQty) * parseFloat(body.unitRate);
    const actualSpent = parseFloat(body.claimedQty || 0) * parseFloat(body.unitRate);
    const variance = contractBudget - actualSpent;

    const newItem = await db
      .insert(boqItems)
      .values({
        projectId: body.projectId,
        wbsCode: body.wbsCode,
        category: body.category,
        description: body.description,
        unit: body.unit,
        contractQty: body.contractQty,
        claimedQty: body.claimedQty || "0",
        unitRate: body.unitRate,
        contractBudget: contractBudget.toString(),
        actualSpent: actualSpent.toString(),
        variance: variance.toString(),
      })
      .returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating BOQ item:", error);
    return NextResponse.json({ error: "Failed to create BOQ item" }, { status: 500 });
  }
}
