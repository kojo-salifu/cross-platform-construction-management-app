import { db } from "@/db";
import { projects, boqItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { BOQTable } from "@/components/boq-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculateProgressPercentage } from "@/lib/utils";

export default async function BOQPage() {
  const allProjects = await db.select().from(projects).limit(1);
  const currentProject = allProjects[0];

  if (!currentProject) {
    return (
      <DashboardShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No project selected</p>
        </div>
      </DashboardShell>
    );
  }

  const items = await db
    .select()
    .from(boqItems)
    .where(eq(boqItems.projectId, currentProject.id));

  // Calculate category summaries
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        contractBudget: 0,
        actualSpent: 0,
        variance: 0,
      };
    }
    acc[item.category].contractBudget += parseFloat(item.contractBudget);
    acc[item.category].actualSpent += parseFloat(item.actualSpent || "0");
    acc[item.category].variance += parseFloat(item.variance || "0");
    return acc;
  }, {} as Record<string, { contractBudget: number; actualSpent: number; variance: number }>);

  return (
    <DashboardShell
      currentProject={{
        id: currentProject.id,
        name: currentProject.name,
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master BOQ & Financial Control</h1>
          <p className="text-muted-foreground mt-1">
            Work Breakdown Structure and Earned Value Management
          </p>
        </div>

        {/* Category Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories).map(([category, data]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-semibold">{formatCurrency(data.contractBudget)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Spent:</span>
                    <span className="font-semibold">{formatCurrency(data.actualSpent)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Variance:</span>
                    <span className={`font-semibold ${data.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(data.variance)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BOQ Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bill of Quantities</CardTitle>
            <CardDescription>
              Detailed line items with financial tracking and variance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BOQTable items={items} projectId={currentProject.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
