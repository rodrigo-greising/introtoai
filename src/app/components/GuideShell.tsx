"use client";

import { useState, useCallback } from "react";
import { Header, Sidebar, SidebarToggle, ContentWrapper } from "./layout";
import {
  IntroSection,
  MentalModelSection,
  CachingSection,
  ContextEngineeringSection,
  ContextTechniquesSection,
  RAGFundamentalsSection,
  SkillsProgressiveDiscoverySection,
  ModelRoutingSection,
  PlaceholderSection,
  // Agentic Methodology Sections
  SpecDrivenDevSection,
  TestDrivenAISection,
  HarnessesSection,
  CICDIterationSection,
  ExternalControlSection,
  // Tooling Deep-Dive Sections
  CursorIDESection,
  GraphiteSection,
  LinearSection,
  BackgroundAgentsSection,
  E2EPipelineSection,
} from "./sections";
import { sections } from "@/app/data/sections";
import { useActiveSection, scrollToSection } from "@/hooks/useActiveSection";

// Map section IDs to their components
const sectionComponents: Record<string, React.ComponentType> = {
  // Foundations
  intro: IntroSection,
  "mental-model": MentalModelSection,
  "llm-caching": CachingSection,
  "context-engineering": ContextEngineeringSection,
  "context-techniques": ContextTechniquesSection,
  // Retrieval
  "rag-fundamentals": RAGFundamentalsSection,
  // Architecture
  "skills-progressive-discovery": SkillsProgressiveDiscoverySection,
  "model-routing": ModelRoutingSection,
  // Workflow - Agentic Methodologies
  "spec-driven-dev": SpecDrivenDevSection,
  "test-driven-ai": TestDrivenAISection,
  "harnesses-evaluation": HarnessesSection,
  "cicd-iteration": CICDIterationSection,
  "external-control": ExternalControlSection,
  // Workflow - Tooling Deep-Dives
  "cursor-ide": CursorIDESection,
  "graphite-stacked-prs": GraphiteSection,
  "linear-task-management": LinearSection,
  "background-agents": BackgroundAgentsSection,
  "e2e-agentic-pipeline": E2EPipelineSection,
};

export function GuideShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Collect all section and sub-section IDs for tracking
  const allSectionIds = sections.flatMap((s) => {
    const ids = [s.id];
    if (s.subSections) {
      ids.push(...s.subSections.map((sub) => sub.id));
    }
    return ids;
  });
  
  const activeSection = useActiveSection({ sectionIds: allSectionIds, offset: 100 });

  const handleSectionClick = useCallback((sectionId: string) => {
    scrollToSection(sectionId, 80);
  }, []);

  const handleSubSectionClick = useCallback((sectionId: string, subSectionId: string) => {
    scrollToSection(subSectionId, 80);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={toggleSidebar} isSidebarOpen={sidebarOpen} />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          activeSection={activeSection}
          sections={sections}
          onSectionClick={handleSectionClick}
          onSubSectionClick={handleSubSectionClick}
          onClose={() => setSidebarOpen(false)}
        />
        
        <ContentWrapper isSidebarOpen={sidebarOpen}>
          <div className="space-y-24">
            {sections.map((section) => {
              const Component = sectionComponents[section.id];
              if (Component) {
                return <Component key={section.id} />;
              }
              return (
                <PlaceholderSection key={section.id} section={section} />
              );
            })}
          </div>
          
          {/* Footer spacer */}
          <div className="h-32" />
        </ContentWrapper>
      </div>

      <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
    </div>
  );
}
