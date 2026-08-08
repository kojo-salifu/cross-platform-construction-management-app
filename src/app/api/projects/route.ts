import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await db
      .insert(projects)
      .values({
        name: body.name,
        location: body.location,
        clientName: body.clientName,
        overallBudget: body.overallBudget,
        status: body.status || "active",
        startDate: body.startDate,
        endDate: body.endDate,
        projectManager: body.projectManager,
        organizationId: body.organizationId || 1, // Default to org 1 for now
        createdBy: body.createdBy || null,
      })
      .returning();
    
    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
