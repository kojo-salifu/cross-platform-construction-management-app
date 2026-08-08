import { db } from "@/db";
import { projects, projectDocuments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, FolderOpen } from "lucide-react";

export default async function DocumentsPage() {
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

  const documents = await db
    .select()
    .from(projectDocuments)
    .where(eq(projectDocuments.projectId, currentProject.id))
    .orderBy(desc(projectDocuments.uploadedAt))
    .limit(50);

  const categories = documents.reduce((acc, doc) => {
    const cat = doc.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fileTypeIcons: Record<string, string> = {
    pdf: "📄",
    dwg: "📐",
    xlsx: "📊",
    docx: "📝",
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Document Vault</h1>
          <p className="text-muted-foreground mt-1">
            Blueprints, permits, certificates, and project documents
          </p>
        </div>

        {/* Category Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(categories).map(([category, count]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">documents</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>
              {documents.length} documents • Version controlled and categorized
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No documents uploaded yet. Start building your document library.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors flex items-center gap-4"
                  >
                    <div className="text-3xl">
                      {fileTypeIcons[doc.fileType || ""] || <FileText className="h-8 w-8 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{doc.title}</h3>
                        {doc.versionTag && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {doc.versionTag}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            doc.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : doc.status === "superseded"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {doc.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {doc.category && <span>📁 {doc.category}</span>}
                        {doc.fileType && <span>Type: {doc.fileType.toUpperCase()}</span>}
                        {doc.fileSize && (
                          <span>
                            Size: {(doc.fileSize / 1024).toFixed(1)} KB
                          </span>
                        )}
                        <span>
                          Uploaded {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                        </span>
                        {doc.uploadedBy && <span>by {doc.uploadedBy}</span>}
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
