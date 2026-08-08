import { db } from "@/db";
import { projects, progressPhotos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Camera } from "lucide-react";

export default async function PhotosPage() {
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

  const photos = await db
    .select()
    .from(progressPhotos)
    .where(eq(progressPhotos.projectId, currentProject.id))
    .orderBy(desc(progressPhotos.uploadedAt))
    .limit(50);

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
          <h1 className="text-3xl font-bold tracking-tight">Progress Photos</h1>
          <p className="text-muted-foreground mt-1">
            Geotagged site photography and visual documentation
          </p>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
            <CardDescription>
              {photos.length} photos uploaded • GPS-tagged and categorized by trade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No photos uploaded yet. Start documenting site progress.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-slate-100 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-slate-400" />
                    </div>
                    <div className="p-3">
                      {photo.tradeTag && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {photo.tradeTag}
                        </span>
                      )}
                      {photo.gridLocation && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {photo.gridLocation}
                        </p>
                      )}
                      {photo.caption && (
                        <p className="text-xs mt-2 line-clamp-2">{photo.caption}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(photo.uploadedAt), "MMM d, yyyy")}
                      </p>
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
