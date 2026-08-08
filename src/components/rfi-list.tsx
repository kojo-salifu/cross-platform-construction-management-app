"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface RFI {
  id: number;
  rfiNumber: string;
  subject: string;
  description: string | null;
  priority: string;
  assignedTo: string | null;
  status: string;
  targetDate: string | null;
  closedDate: string | null;
  response: string | null;
  createdBy: string | null;
  createdAt: Date;
}

interface RFIListProps {
  rfis: RFI[];
  projectId: number;
}

export function RFIList({ rfis, projectId }: RFIListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRfis = statusFilter === "all"
    ? rfis
    : rfis.filter(rfi => rfi.status === statusFilter);

  const handleAddRFI = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/rfis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          rfiNumber: formData.get("rfiNumber"),
          subject: formData.get("subject"),
          description: formData.get("description"),
          priority: formData.get("priority"),
          assignedTo: formData.get("assignedTo"),
          status: formData.get("status") || "open",
          targetDate: formData.get("targetDate"),
          createdBy: formData.get("createdBy"),
        }),
      });

      if (response.ok) {
        toast.success("RFI created successfully");
        setShowAddForm(false);
        window.location.reload();
      } else {
        toast.error("Failed to create RFI");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-orange-100 text-orange-700";
      case "in-review": return "bg-blue-100 text-blue-700";
      case "closed": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add RFI
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddRFI} className="bg-slate-50 p-4 rounded-lg border space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="rfiNumber">RFI Number</Label>
              <Input id="rfiNumber" name="rfiNumber" placeholder="RFI-2024-001" required />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="Brief subject line" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Detailed description of the information request"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" name="assignedTo" placeholder="Engineer/Consultant" />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input id="targetDate" name="targetDate" type="date" />
            </div>
            <div>
              <Label htmlFor="createdBy">Created By</Label>
              <Input id="createdBy" name="createdBy" placeholder="Your name" required />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Create RFI</Button>
            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* RFI Cards */}
      <div className="space-y-3">
        {filteredRfis.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No RFIs found. Create your first RFI above.
          </p>
        ) : (
          filteredRfis.map((rfi) => (
            <div
              key={rfi.id}
              className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold">{rfi.rfiNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(rfi.priority)}`}>
                      {rfi.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(rfi.status)}`}>
                      {rfi.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base">{rfi.subject}</h3>
                  {rfi.description && (
                    <p className="text-sm text-muted-foreground mt-1">{rfi.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    {rfi.assignedTo && <span>👤 {rfi.assignedTo}</span>}
                    {rfi.targetDate && (
                      <span>📅 Target: {format(new Date(rfi.targetDate), "MMM d, yyyy")}</span>
                    )}
                    {rfi.createdBy && <span>✍️ {rfi.createdBy}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
