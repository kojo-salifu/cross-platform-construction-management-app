import { NextResponse } from "next/server";
import { db } from "@/db";
import { dailySiteReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const reports = await db
      .select()
      .from(dailySiteReports)
      .where(eq(dailySiteReports.projectId, parseInt(projectId)))
      .orderBy(desc(dailySiteReports.reportDate));

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    return NextResponse.json({ error: "Failed to fetch daily reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReport = await db
      .insert(dailySiteReports)
      .values({
        projectId: body.projectId,
        reportDate: body.reportDate,
        tempMin: body.tempMin,
        tempMax: body.tempMax,
        humidity: body.humidity,
        windSpeed: body.windSpeed,
        weatherCondition: body.weatherCondition,
        totalWorkers: body.totalWorkers,
        workforceBreakdown: body.workforceBreakdown,
        hseStatus: body.hseStatus,
        zeroDaysIncident: body.zeroDaysIncident,
        safetyNotes: body.safetyNotes,
        notes: body.notes,
        createdBy: body.createdBy,
      })
      .returning();

    return NextResponse.json(newReport[0], { status: 201 });
  } catch (error) {
    console.error("Error creating daily report:", error);
    return NextResponse.json({ error: "Failed to create daily report" }, { status: 500 });
  }
}
