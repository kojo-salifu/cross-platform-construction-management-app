"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";

interface DailyReportFormProps {
  projectId: number;
}

export function DailyReportForm({ projectId }: DailyReportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Parse workforce breakdown
    const workforceBreakdown = {
      steel_fixers: parseInt(formData.get("steel_fixers") as string) || 0,
      carpenters: parseInt(formData.get("carpenters") as string) || 0,
      electricians: parseInt(formData.get("electricians") as string) || 0,
      solar_installers: parseInt(formData.get("solar_installers") as string) || 0,
      general_labor: parseInt(formData.get("general_labor") as string) || 0,
    };

    const totalWorkers = Object.values(workforceBreakdown).reduce((sum, count) => sum + count, 0);

    try {
      const response = await fetch("/api/daily-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          reportDate: formData.get("reportDate"),
          tempMin: parseFloat(formData.get("tempMin") as string) || null,
          tempMax: parseFloat(formData.get("tempMax") as string) || null,
          humidity: parseFloat(formData.get("humidity") as string) || null,
          windSpeed: parseFloat(formData.get("windSpeed") as string) || null,
          weatherCondition: formData.get("weatherCondition"),
          totalWorkers,
          workforceBreakdown,
          hseStatus: formData.get("hseStatus"),
          zeroDaysIncident: parseInt(formData.get("zeroDaysIncident") as string) || 0,
          safetyNotes: formData.get("safetyNotes"),
          notes: formData.get("notes"),
          createdBy: formData.get("createdBy"),
        }),
      });

      if (response.ok) {
        toast.success("Daily report created successfully");
        router.refresh();
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Failed to create daily report");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date and Weather */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="reportDate">Report Date</Label>
          <Input
            id="reportDate"
            name="reportDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div>
          <Label htmlFor="weatherCondition">Weather</Label>
          <Select name="weatherCondition" required>
            <SelectTrigger>
              <SelectValue placeholder="Select weather" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunny">☀️ Sunny</SelectItem>
              <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
              <SelectItem value="rainy">🌧️ Rainy</SelectItem>
              <SelectItem value="windy">💨 Windy</SelectItem>
              <SelectItem value="hot">🔥 Hot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hseStatus">HSE Status</Label>
          <Select name="hseStatus" defaultValue="compliant" required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliant">✅ Compliant</SelectItem>
              <SelectItem value="near-miss">⚠️ Near Miss</SelectItem>
              <SelectItem value="incident">🚨 Incident</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Temperature and Conditions */}
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="tempMin">Temp Min (°C)</Label>
          <Input id="tempMin" name="tempMin" type="number" step="0.1" placeholder="20" />
        </div>
        <div>
          <Label htmlFor="tempMax">Temp Max (°C)</Label>
          <Input id="tempMax" name="tempMax" type="number" step="0.1" placeholder="30" />
        </div>
        <div>
          <Label htmlFor="humidity">Humidity (%)</Label>
          <Input id="humidity" name="humidity" type="number" step="0.1" placeholder="65" />
        </div>
        <div>
          <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
          <Input id="windSpeed" name="windSpeed" type="number" step="0.1" placeholder="15" />
        </div>
      </div>

      {/* Workforce Breakdown */}
      <div>
        <h3 className="font-semibold mb-3">Workforce Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-5">
          <div>
            <Label htmlFor="steel_fixers">Steel Fixers</Label>
            <Input id="steel_fixers" name="steel_fixers" type="number" defaultValue="0" min="0" />
          </div>
          <div>
            <Label htmlFor="carpenters">Carpenters</Label>
            <Input id="carpenters" name="carpenters" type="number" defaultValue="0" min="0" />
          </div>
          <div>
            <Label htmlFor="electricians">Electricians</Label>
            <Input id="electricians" name="electricians" type="number" defaultValue="0" min="0" />
          </div>
          <div>
            <Label htmlFor="solar_installers">Solar Installers</Label>
            <Input id="solar_installers" name="solar_installers" type="number" defaultValue="0" min="0" />
          </div>
          <div>
            <Label htmlFor="general_labor">General Labor</Label>
            <Input id="general_labor" name="general_labor" type="number" defaultValue="0" min="0" />
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="zeroDaysIncident">Zero Incident Days Count</Label>
          <Input id="zeroDaysIncident" name="zeroDaysIncident" type="number" defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="safetyNotes">Safety Notes</Label>
          <Input id="safetyNotes" name="safetyNotes" placeholder="Any safety observations..." />
        </div>
      </div>

      {/* General Notes */}
      <div>
        <Label htmlFor="notes">Daily Notes</Label>
        <textarea
          id="notes"
          name="notes"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Describe major activities, progress, issues, etc."
        />
      </div>

      {/* Author */}
      <div>
        <Label htmlFor="createdBy">Report Author</Label>
        <Input id="createdBy" name="createdBy" placeholder="Engineer name" required />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Creating..." : "Create Daily Report"}
      </Button>
    </form>
  );
}
