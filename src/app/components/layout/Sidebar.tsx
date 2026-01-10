"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  BookOpen,
  Brain,
  Layers,
  Workflow,
  Shield,
  Rocket,
} from "lucide-react";
import type { Section } from "@/app/data/sections";

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  sections: Section[];
  onSectionClick: (sectionId: string) => void;
  onClose: () => void;
}

// Icon mapping for section parts
const partIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  foundations: BookOpen,
  retrieval: Brain,
  architecture: Layers,
  workflow: Workflow,
  production: Shield,
};

export function Sidebar({
  isOpen,
  activeSection,
  sections,
  onSectionClick,
  onClose,
}: SidebarProps) {
  // Group sections by part
  const groupedSections = sections.reduce(
    (acc, section) => {
      const part = section.part || "other";
      if (!acc[part]) {
        acc[part] = [];
      }
      acc[part].push(section);
      return acc;
    },
    {} as Record<string, Section[]>
  );

  const partLabels: Record<string, string> = {
    foundations: "Foundations",
    retrieval: "Retrieval & Knowledge",
    architecture: "Task Architecture",
    workflow: "Development Workflow",
    production: "Production Concerns",
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar sidebar-transition",
          "lg:sticky lg:top-14 lg:z-30 lg:h-[calc(100vh-3.5rem)]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ScrollArea className="h-full py-4">
          <nav className="px-3 space-y-6">
            {Object.entries(groupedSections).map(([part, partSections]) => {
              const Icon = partIcons[part] || Rocket;
              return (
                <div key={part} className="space-y-1">
                  {/* Part header */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {partLabels[part] || part}
                    </span>
                  </div>

                  {/* Section links */}
                  {partSections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive && "nav-active font-medium"
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "size-3 transition-transform",
                            isActive && "text-[var(--highlight)]",
                            "group-hover:translate-x-0.5"
                          )}
                        />
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-8 px-6">
            <Separator className="mb-4" />
            <p className="text-xs text-muted-foreground">
              A practical guide for software engineers on effectively using AI.
            </p>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
