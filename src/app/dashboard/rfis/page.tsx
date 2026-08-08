import { db } from "@/db";
import { projects, rfis } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { RFIList } from "@/components/rfi-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RFIsPage() {
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

  const allRfis = await db
    .select()
    .from(rfis)
    .where(eq(rfis.projectId, currentProject.id))
    .orderBy(desc(rfis.createdAt));

  // Count by status
  const statusCounts = allRfis.reduce((acc, rfi) => {
    const status = rfi.status || "open";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          <h1 className="text-3xl font-bold tracking-tight">RFIs & Submittals</h1>
          <p className="text-muted-foreground mt-1">
            Requests for Information and design clarifications
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total RFIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRfis.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {statusCounts.open || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {statusCounts["in-review"] || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.closed || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RFI List */}
        <Card>
          <CardHeader>
            <CardTitle>All RFIs</CardTitle>
            <CardDescription>
              Track and manage information requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RFIList rfis={allRfis} projectId={currentProject.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
