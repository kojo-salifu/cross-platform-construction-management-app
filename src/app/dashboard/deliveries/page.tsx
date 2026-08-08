import { db } from "@/db";
import { projects, materialDeliveries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function DeliveriesPage() {
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

  const deliveries = await db
    .select()
    .from(materialDeliveries)
    .where(eq(materialDeliveries.projectId, currentProject.id))
    .orderBy(desc(materialDeliveries.deliveryDate))
    .limit(30);

  const statusCounts = deliveries.reduce((acc, delivery) => {
    const status = delivery.qcStatus || "pending";
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
          <h1 className="text-3xl font-bold tracking-tight">Material Deliveries</h1>
          <p className="text-muted-foreground mt-1">
            Track incoming materials and inspection status
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.approved || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending QC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {statusCounts.pending || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statusCounts.rejected || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries List */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Records</CardTitle>
            <CardDescription>Recent material deliveries and QC inspection results</CardDescription>
          </CardHeader>
          <CardContent>
            {deliveries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No deliveries recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {deliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{delivery.materialDescription}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              delivery.qcStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : delivery.qcStatus === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {delivery.qcStatus?.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Supplier:</span>
                            <span className="ml-2 font-semibold">{delivery.supplier}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="ml-2 font-semibold">
                              {parseFloat(delivery.qtyReceived).toFixed(2)} {delivery.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ticket #:</span>
                            <span className="ml-2 font-semibold">{delivery.ticketNumber}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <span className="ml-2 font-semibold">
                              {format(new Date(delivery.deliveryDate), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        {delivery.storageLocation && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Storage: {delivery.storageLocation}
                            {delivery.receivedBy && ` • Received by: ${delivery.receivedBy}`}
                          </div>
                        )}
                        {delivery.inspectionNotes && (
                          <p className="mt-2 text-sm text-slate-700">{delivery.inspectionNotes}</p>
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
