import { db } from "@/db";
import { projects, concretePours } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function ConcretePage() {
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

  const pours = await db
    .select()
    .from(concretePours)
    .where(eq(concretePours.projectId, currentProject.id))
    .orderBy(desc(concretePours.pourDate))
    .limit(20);

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
          <h1 className="text-3xl font-bold tracking-tight">Concrete Pour Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Structural concrete QC logs and testing records
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Pours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pours.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pours.reduce((sum, p) => sum + parseFloat(p.volumeM3), 0).toFixed(2)} m³
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Passed QC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pours.filter(p => p.qcResult === "pass").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pours.filter(p => p.qcResult === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Concrete Pour Records */}
        <Card>
          <CardHeader>
            <CardTitle>Pour Records</CardTitle>
            <CardDescription>Recent structural concrete pours and QC results</CardDescription>
          </CardHeader>
          <CardContent>
            {pours.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No concrete pours recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {pours.map((pour) => (
                  <div
                    key={pour.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{pour.elementLocation}</h3>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {pour.mixDesign}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              pour.qcResult === "pass"
                                ? "bg-green-100 text-green-700"
                                : pour.qcResult === "fail"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {pour.qcResult?.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Volume:</span>
                            <span className="ml-2 font-semibold">
                              {parseFloat(pour.volumeM3).toFixed(2)} m³
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Supplier:</span>
                            <span className="ml-2 font-semibold">{pour.supplier}</span>
                          </div>
                          {pour.slumpMm && (
                            <div>
                              <span className="text-muted-foreground">Slump:</span>
                              <span className="ml-2 font-semibold">{pour.slumpMm} mm</span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <span className="ml-2 font-semibold">
                              {format(new Date(pour.pourDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        {pour.deliveryTicketNumber && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Ticket: {pour.deliveryTicketNumber}
                            {pour.cylinderBatchId && ` • Cylinder Batch: ${pour.cylinderBatchId}`}
                          </div>
                        )}
                        {pour.qcNotes && (
                          <p className="mt-2 text-sm text-slate-700">{pour.qcNotes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
