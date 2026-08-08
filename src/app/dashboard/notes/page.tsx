import { db } from "@/db";
import { projects, siteFieldNotes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { StickyNote } from "lucide-react";

export default async function NotesPage() {
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

  const notes = await db
    .select()
    .from(siteFieldNotes)
    .where(eq(siteFieldNotes.projectId, currentProject.id))
    .orderBy(desc(siteFieldNotes.createdAt))
    .limit(30);

  const typeColors: Record<string, string> = {
    general: "bg-blue-100 text-blue-700",
    defect: "bg-red-100 text-red-700",
    observation: "bg-green-100 text-green-700",
    instruction: "bg-purple-100 text-purple-700",
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
          <h1 className="text-3xl font-bold tracking-tight">Field Notes</h1>
          <p className="text-muted-foreground mt-1">
            Site observations, instructions, and voice memos
          </p>
        </div>

        {/* Notes List */}
        <Card>
          <CardHeader>
            <CardTitle>All Field Notes</CardTitle>
            <CardDescription>
              {notes.length} notes recorded • Text and voice memo support
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <StickyNote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No field notes yet. Start recording site observations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            typeColors[note.noteType || "general"]
                          }`}
                        >
                          {note.noteType?.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold">{note.authorName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{note.content}</p>
                    {note.voiceMemoUrl && (
                      <div className="mt-2 text-xs text-blue-600">
                        🎤 Voice memo attached
                      </div>
                    )}
                    {(note.pinX !== null && note.pinY !== null) && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        📍 Pinned to blueprint at ({note.pinX?.toFixed(3)}, {note.pinY?.toFixed(3)})
                      </div>
                    )}
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
