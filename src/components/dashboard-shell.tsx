"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  Truck,
  Camera,
  StickyNote,
  FolderOpen,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardShellProps {
  children: React.ReactNode;
  currentProject?: {
    id: number;
    name: string;
  };
  projects?: Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/daily", icon: Calendar, label: "Daily Reports" },
  { href: "/dashboard/boq", icon: DollarSign, label: "BOQ & Financials" },
  { href: "/dashboard/concrete", icon: FileText, label: "Concrete Pours" },
  { href: "/dashboard/rfis", icon: MessageSquare, label: "RFIs" },
  { href: "/dashboard/deliveries", icon: Truck, label: "Deliveries" },
  { href: "/dashboard/photos", icon: Camera, label: "Progress Photos" },
  { href: "/dashboard/notes", icon: StickyNote, label: "Field Notes" },
  { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
];

export function DashboardShell({
  children,
  currentProject,
  projects = [],
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">ConMgt</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        {currentProject && (
          <div className="mt-2 text-sm text-slate-600">
            Project: <span className="font-semibold">{currentProject.name}</span>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop & Mobile */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-slate-200">
            <Building2 className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-xl">Construction Hub</span>
          </div>

          {/* Project Selector */}
          {currentProject && (
            <div className="px-4 py-4 border-b border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Current Project
              </div>
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold text-sm text-slate-900">
                  {currentProject.name}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">Active</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
