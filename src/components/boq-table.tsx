"use client";

import { useState } from "react";
import { formatCurrency, formatPercentage, calculateProgressPercentage } from "@/lib/utils";
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
import { Plus, Filter } from "lucide-react";
import { toast } from "sonner";

interface BOQItem {
  id: number;
  wbsCode: string;
  category: string;
  description: string;
  unit: string;
  contractQty: string;
  claimedQty: string | null;
  unitRate: string;
  contractBudget: string;
  actualSpent: string | null;
  variance: string | null;
}

interface BOQTableProps {
  items: BOQItem[];
  projectId: number;
}

export function BOQTable({ items, projectId }: BOQTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = categoryFilter === "all" 
    ? items 
    : items.filter(item => item.category === categoryFilter);

  const categories = Array.from(new Set(items.map(item => item.category)));

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("/api/boq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          wbsCode: formData.get("wbsCode"),
          category: formData.get("category"),
          description: formData.get("description"),
          unit: formData.get("unit"),
          contractQty: formData.get("contractQty"),
          claimedQty: formData.get("claimedQty") || "0",
          unitRate: formData.get("unitRate"),
        }),
      });

      if (response.ok) {
        toast.success("BOQ item added successfully");
        setShowAddForm(false);
        window.location.reload(); // In production, use proper state management
      } else {
        toast.error("Failed to add BOQ item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add BOQ Item
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-slate-50 p-4 rounded-lg border space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="wbsCode">WBS Code</Label>
              <Input id="wbsCode" name="wbsCode" placeholder="1.2.3" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Substructure">Substructure</SelectItem>
                  <SelectItem value="Superstructure">Superstructure</SelectItem>
                  <SelectItem value="MEP Services">MEP Services</SelectItem>
                  <SelectItem value="Solar/BIPV">Solar/BIPV</SelectItem>
                  <SelectItem value="Finishes">Finishes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" name="unit" placeholder="m³, m², pcs" required />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Item description" required />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="contractQty">Contract Qty</Label>
              <Input id="contractQty" name="contractQty" type="number" step="0.01" required />
            </div>
            <div>
              <Label htmlFor="claimedQty">Claimed Qty</Label>
              <Input id="claimedQty" name="claimedQty" type="number" step="0.01" defaultValue="0" />
            </div>
            <div>
              <Label htmlFor="unitRate">Unit Rate ($)</Label>
              <Input id="unitRate" name="unitRate" type="number" step="0.01" required />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Item</Button>
            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-3 text-left font-medium">WBS</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">Contract Qty</th>
              <th className="px-4 py-3 text-right font-medium">Claimed Qty</th>
              <th className="px-4 py-3 text-right font-medium">Unit Rate</th>
              <th className="px-4 py-3 text-right font-medium">Budget</th>
              <th className="px-4 py-3 text-right font-medium">Spent</th>
              <th className="px-4 py-3 text-right font-medium">Variance</th>
              <th className="px-4 py-3 text-right font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                  No BOQ items found. Add your first item to get started.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const progress = calculateProgressPercentage(
                  parseFloat(item.claimedQty || "0"),
                  parseFloat(item.contractQty)
                );
                const varianceValue = parseFloat(item.variance || "0");
                
                return (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs">{item.wbsCode}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">{item.description}</td>
                    <td className="px-4 py-3 text-right">
                      {parseFloat(item.contractQty).toFixed(2)} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {parseFloat(item.claimedQty || "0").toFixed(2)} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(parseFloat(item.unitRate))}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(parseFloat(item.contractBudget))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(parseFloat(item.actualSpent || "0"))}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      varianceValue < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(Math.abs(varianceValue))}
                      {varianceValue < 0 ? ' ↓' : ' ↑'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-12">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
