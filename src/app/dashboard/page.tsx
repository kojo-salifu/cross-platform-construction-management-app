import { db } from "@/db";
import { projects, boqItems, rfis } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { KPICards } from "@/components/kpi-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Fetch the first active project (in production, use user selection)
  const allProjects = await db.select().from(projects).limit(1);
  const currentProject = allProjects[0];

  if (!currentProject) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
          <p className="text-muted-foreground mb-6">Create your first construction project to get started.</p>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  // Fetch BOQ summary
  const boqSummary = await db
    .select({
      totalBudget: sql<number>`COALESCE(SUM(CAST(${boqItems.contractBudget} AS NUMERIC)), 0)`,
      actualSpent: sql<number>`COALESCE(SUM(CAST(${boqItems.actualSpent} AS NUMERIC)), 0)`,
    })
    .from(boqItems)
    .where(eq(boqItems.projectId, currentProject.id));

  const totalBudget = boqSummary[0]?.totalBudget || parseFloat(currentProject.overallBudget);
  const actualSpent = boqSummary[0]?.actualSpent || 0;
  const remaining = totalBudget - actualSpent;

  // Calculate EV for CPI/SPI (simplified: using claimed qty as EV proxy)
  const earnedValue = actualSpent * 0.95; // Placeholder calculation
  const plannedValue = totalBudget * 0.5; // Assuming 50% should be complete
  const cpi = actualSpent > 0 ? earnedValue / actualSpent : 1;
  const spi = plannedValue > 0 ? earnedValue / plannedValue : 1;

  // Fetch open RFIs
  const openRfisCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(rfis)
    .where(eq(rfis.projectId, currentProject.id));

  const kpis = {
    totalBudget,
    actualSpent,
    remaining,
    cpi,
    spi,
    openRfis: Number(openRfisCount[0]?.count || 0),
    hseIncidents: 0, // Would fetch from HSE logs
  };

  return (
    <DashboardShell
      currentProject={{
        id: currentProject.id,
        name: currentProject.name,
      }}
      projects={allProjects}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {currentProject.location} • {currentProject.clientName}
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/daily">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Daily Report
                </CardTitle>
                <CardDescription>
                  Record site conditions, workforce, and activities
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/concrete">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Log Concrete Pour
                </CardTitle>
                <CardDescription>
                  Track structural pours and QC testing
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/boq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Update BOQ Progress
                </CardTitle>
                <CardDescription>
                  Manage financial claims and variances
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground py-8 text-center">
              Recent activities will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
