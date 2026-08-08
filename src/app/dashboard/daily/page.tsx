import { db } from "@/db";
import { projects, dailySiteReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { DailyReportForm } from "@/components/daily-report-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default async function DailyReportsPage() {
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

  const recentReports = await db
    .select()
    .from(dailySiteReports)
    .where(eq(dailySiteReports.projectId, currentProject.id))
    .orderBy(desc(dailySiteReports.reportDate))
    .limit(10);

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
          <h1 className="text-3xl font-bold tracking-tight">Daily Site Reports</h1>
          <p className="text-muted-foreground mt-1">
            Record weather, workforce, activities, and site conditions
          </p>
        </div>

        {/* New Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Daily Report</CardTitle>
            <CardDescription>
              Document daily site execution and quality control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyReportForm projectId={currentProject.id} />
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Last 10 daily site reports</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No reports yet. Create your first daily report above.
              </p>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">
                          {report.reportDate ? format(new Date(report.reportDate), "EEEE, MMMM d, yyyy") : "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {report.weatherCondition && (
                            <span className="mr-4">
                              🌡️ {report.tempMin}°C - {report.tempMax}°C • {report.weatherCondition}
                            </span>
                          )}
                          <span>👷 {report.totalWorkers} workers</span>
                        </div>
                        {report.notes && (
                          <p className="text-sm mt-2 text-slate-700">{report.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.hseStatus === "compliant" 
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {report.hseStatus?.toUpperCase()}
                        </span>
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
