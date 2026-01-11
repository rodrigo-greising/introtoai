"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layers,
  Workflow,
  Shield,
  Rocket,
  Blocks,
  Database,
  GitBranch,
  Code,
  TestTube,
  Settings,
  Search,
  X,
} from "lucide-react";
import type { Section } from "@/app/data/sections";

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  sections: Section[];
  onSectionClick: (sectionId: string) => void;
  onSubSectionClick?: (sectionId: string, subSectionId: string) => void;
  onClose: () => void;
}

// Icon mapping for section parts
const partIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  foundations: BookOpen,
  context: Layers,
  capabilities: Blocks,
  retrieval: Database,
  orchestration: GitBranch,
  safety: Shield,
  evaluation: TestTube,
  "coding-agents": Code,
  workflow: Workflow,
  production: Settings,
};

// Highlight matching text in a string
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-[var(--highlight-muted)] text-[var(--highlight)] rounded-sm px-0.5">
        {part}
      </mark>
    ) : part
  );
}

// Filter sections based on search query
function filterSections(sections: Section[], query: string): Section[] {
  if (!query.trim()) return sections;
  
  const lowerQuery = query.toLowerCase();
  
  return sections.reduce<Section[]>((acc, section) => {
    const titleMatch = section.title.toLowerCase().includes(lowerQuery);
    const descMatch = section.description?.toLowerCase().includes(lowerQuery);
    
    // Filter matching sub-sections
    const matchingSubSections = section.subSections?.filter(sub =>
      sub.title.toLowerCase().includes(lowerQuery)
    );
    
    // Include section if title/description matches or has matching sub-sections
    if (titleMatch || descMatch || (matchingSubSections && matchingSubSections.length > 0)) {
      acc.push({
        ...section,
        // If section title matches, show all sub-sections; otherwise show only matching ones
        subSections: titleMatch || descMatch 
          ? section.subSections 
          : matchingSubSections,
      });
    }
    
    return acc;
  }, []);
}

// Count total results
function countResults(sections: Section[]): number {
  return sections.reduce((count, section) => {
    return count + 1 + (section.subSections?.length || 0);
  }, 0);
}

export function Sidebar({
  isOpen,
  activeSection,
  sections,
  onSectionClick,
  onSubSectionClick,
  onClose,
}: SidebarProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Track which sections the user has manually expanded
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<string>>(new Set());
  
  // Filter sections based on search query
  const filteredSections = useMemo(() => 
    filterSections(sections, searchQuery),
    [sections, searchQuery]
  );
  
  const resultCount = useMemo(() => 
    searchQuery.trim() ? countResults(filteredSections) : 0,
    [filteredSections, searchQuery]
  );
  
  // Compute expanded sections: active section + manually expanded ones + search matches
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    sections.forEach((section) => {
      if (section.subSections?.some((sub) => activeSection === sub.id) ||
          (activeSection === section.id && section.subSections)) {
        expanded.add(section.id);
      }
    });
    return expanded;
  });
  
  // Clear search handler
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);
  
  // Handle keyboard shortcuts
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearSearch();
    } else if (e.key === "Enter" && filteredSections.length === 1) {
      // Navigate to the single result
      const section = filteredSections[0];
      if (section.subSections?.length === 1) {
        onSectionClick(section.subSections[0].id);
      } else {
        onSectionClick(section.id);
      }
      clearSearch();
      if (window.innerWidth < 1024) {
        onClose();
      }
    }
  }, [filteredSections, onSectionClick, onClose, clearSearch]);

  // When activeSection changes or search query changes, update expanded sections
  useEffect(() => {
    const newExpanded = new Set<string>(manuallyExpanded);
    
    sections.forEach((section) => {
      // Auto-expand the section containing the active item
      if (activeSection === section.id || 
          section.subSections?.some((sub) => activeSection === sub.id)) {
        newExpanded.add(section.id);
      }
    });
    
    // Auto-expand all sections when searching
    if (searchQuery.trim()) {
      filteredSections.forEach((section) => {
        if (section.subSections && section.subSections.length > 0) {
          newExpanded.add(section.id);
        }
      });
    }
    
    setExpandedSections(newExpanded);
  }, [activeSection, sections, manuallyExpanded, searchQuery, filteredSections]);

  // Group filtered sections by part
  const groupedSections = filteredSections.reduce(
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
    context: "Context Engineering",
    capabilities: "Capabilities",
    retrieval: "Knowledge & Retrieval",
    orchestration: "Orchestration",
    safety: "Safety & Control",
    evaluation: "Evaluation",
    "coding-agents": "Coding Agents",
    workflow: "Development Workflow",
    production: "Production",
  };

  const toggleSectionExpansion = (sectionId: string) => {
    // Check if this section contains the active item
    const section = sections.find(s => s.id === sectionId);
    const isActiveSection = activeSection === sectionId || 
      section?.subSections?.some((sub) => activeSection === sub.id);
    
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
    
    // Track manual expansion/collapse (only if not the active section)
    if (!isActiveSection) {
      setManuallyExpanded((prev) => {
        const next = new Set(prev);
        if (prev.has(sectionId)) {
          // User is collapsing a manually expanded section
          next.delete(sectionId);
        } else {
          // User is manually expanding a section
          next.add(sectionId);
        }
        return next;
      });
    } else {
      // If collapsing the active section, remove it from manually expanded
      setManuallyExpanded((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSubSectionClick = (sectionId: string, subSectionId: string) => {
    if (onSubSectionClick) {
      onSubSectionClick(sectionId, subSectionId);
    } else {
      // Fallback: scroll to sub-section
      onSectionClick(subSectionId);
    }
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
          "fixed inset-y-0 left-0 z-50 border-r border-sidebar-border bg-sidebar transition-all duration-300",
          "lg:sticky lg:top-14 lg:z-30 lg:h-[calc(100vh-3.5rem)]",
          isOpen 
            ? "translate-x-0 w-72" 
            : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0 lg:overflow-hidden"
        )}
      >
        <ScrollArea className="h-full py-4">
          {/* Search Input */}
          <div className="px-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-9 pr-8 h-8 bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-[var(--highlight)] focus-visible:border-[var(--highlight)]"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-sidebar-accent transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            {/* Result count */}
            {searchQuery.trim() && (
              <p className="text-xs text-muted-foreground mt-2 px-1">
                {resultCount === 0 
                  ? "No results found" 
                  : `${resultCount} result${resultCount === 1 ? '' : 's'} found`}
              </p>
            )}
          </div>

          <nav className="px-3 space-y-6">
            {/* No results message */}
            {searchQuery.trim() && filteredSections.length === 0 && (
              <div className="text-center py-8 px-4">
                <Search className="size-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No sections match &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-2 text-xs text-[var(--highlight)] hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
            
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
                    const isActive = activeSection === section.id || 
                      (section.subSections && section.subSections.some(sub => activeSection === sub.id));
                    const hasSubSections = section.subSections && section.subSections.length > 0;
                    const isExpanded = hasSubSections && expandedSections.has(section.id);
                    
                    return (
                      <div key={section.id} className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          {hasSubSections && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSectionExpansion(section.id);
                              }}
                              className={cn(
                                "flex items-center justify-center p-1 rounded hover:bg-sidebar-accent transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] focus:ring-offset-1"
                              )}
                              aria-label={isExpanded ? "Collapse section" : "Expand section"}
                            >
                              <ChevronDown
                                className={cn(
                                  "size-3 transition-transform",
                                  isActive && "text-[var(--highlight)]",
                                  !isExpanded && "-rotate-90"
                                )}
                              />
                            </button>
                          )}
                          {!hasSubSections && (
                            <ChevronRight
                              className={cn(
                                "size-3 transition-transform ml-1",
                                isActive && "text-[var(--highlight)]"
                              )}
                            />
                          )}
                          <button
                            onClick={() => handleSectionClick(section.id)}
                            className={cn(
                              "group flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive && "nav-active font-medium"
                            )}
                          >
                            <span className="truncate">
                              {searchQuery ? highlightMatch(section.title, searchQuery) : section.title}
                            </span>
                          </button>
                        </div>
                        
                        {/* Sub-sections */}
                        {hasSubSections && isExpanded && (
                          <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-2">
                            {(section.subSections ?? []).map((subSection) => {
                              const isSubActive = activeSection === subSection.id;
                              return (
                                <button
                                  key={subSection.id}
                                  onClick={() => handleSubSectionClick(section.id, subSection.id)}
                                  className={cn(
                                    "group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isSubActive && "nav-active font-medium text-[var(--highlight)]"
                                  )}
                                >
                                  <span 
                                    className={cn(
                                      "size-1.5 rounded-full transition-colors",
                                      isSubActive 
                                        ? "bg-[var(--highlight)] shadow-[0_0_6px_var(--highlight)]" 
                                        : "bg-muted-foreground/40 group-hover:bg-muted-foreground/60"
                                    )} 
                                  />
                                  <span className="truncate">
                                    {searchQuery ? highlightMatch(subSection.title, searchQuery) : subSection.title}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
