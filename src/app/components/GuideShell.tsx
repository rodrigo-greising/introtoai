"use client";

import { useState, useCallback } from "react";
import { Header, Sidebar, SidebarToggle, ContentWrapper } from "./layout";
import {
  IntroSection,
  HowLLMsWorkSection,
  MentalModelSection,
  EmbeddingsSection,
  CachingSection,
  ContextPrinciplesSection,
  LayeredContextSection,
  ContextTechniquesSection,
  // Capabilities
  StructuredOutputsSection,
  ToolsSection,
  AgenticLoopSection,
  WorkflowsVsAgentsSection,
  // Retrieval
  RAGFundamentalsSection,
  VectorDatabasesSection,
  ChunkingStrategiesSection,
  // Orchestration
  SkillsProgressiveDiscoverySection,
  ModelRoutingSection,
  TaskDecompositionSection,
  OrchestrationPatternsSection,
  ParallelizationSection,
  DelegationSection,
  PlaceholderSection,
  // Evaluation
  HarnessesSection,
  TestDrivenAISection,
  // Safety
  GuardrailsSection,
  HumanInLoopSection,
  ExternalControlSection,
  // Coding Agents
  CodingAgentsIntroSection,
  CursorIDESection,
  CursorRulesSection,
  CursorModesSection,
  CursorPatternsSection,
  BackgroundAgentsSection,
  // Workflow
  SpecDrivenDevSection,
  CICDIterationSection,
  GraphiteSection,
  LinearSection,
  E2EPipelineSection,
  // Production
  CostOptimizationSection,
  ReliabilitySection,
  // Capstone
  CapstoneSection,
} from "./sections";
import { sections } from "@/app/data/sections";
import { useActiveSection, scrollToSection } from "@/hooks/useActiveSection";

/**
 * Section Component Map
 * 
 * Maps section IDs from sections.ts to their React components.
 * Sections without a mapped component will render PlaceholderSection.
 * 
 * V3 Section Mapping:
 * - Part 1 (Foundations): intro, how-llms-work, mental-model, embeddings, llm-caching
 * - Part 2 (Context): context-principles, layered-context, context-lifecycle
 * - Part 3 (Capabilities): structured-outputs, tools, agentic-loop, workflows-vs-agents
 * - Part 4 (Retrieval): rag-fundamentals, vector-databases, chunking-strategies
 * - Part 5 (Orchestration): task-decomposition, orchestration-patterns, parallelization, delegation, skills, model-routing
 * - Part 6 (Safety): guardrails, human-in-loop, external-control
 * - Part 7 (Evaluation): harnesses, tdd-ai
 * - Part 8 (Coding Agents): coding-agents-intro, cursor-architecture, cursor-rules, cursor-modes, cursor-patterns, background-agents
 * - Part 9 (Workflow): spec-driven, cicd-iteration, graphite, linear, e2e-pipeline
 * - Part 10 (Production): cost-optimization, reliability
 */
const sectionComponents: Record<string, React.ComponentType> = {
  // Part 1: Foundations
  "intro": IntroSection,
  "how-llms-work": HowLLMsWorkSection,
  "mental-model": MentalModelSection,
  "embeddings": EmbeddingsSection,
  "llm-caching": CachingSection,

  // Part 2: Context Engineering
  "context-principles": ContextPrinciplesSection,
  "layered-context": LayeredContextSection,
  "context-lifecycle": ContextTechniquesSection, // Has lifecycle content

  // Part 3: Capabilities
  "structured-outputs": StructuredOutputsSection,
  "tools": ToolsSection,
  "agentic-loop": AgenticLoopSection,
  "workflows-vs-agents": WorkflowsVsAgentsSection,

  // Part 4: Knowledge & Retrieval
  "rag-fundamentals": RAGFundamentalsSection,
  "vector-databases": VectorDatabasesSection,
  "chunking-strategies": ChunkingStrategiesSection,

  // Part 5: Orchestration
  "task-decomposition": TaskDecompositionSection,
  "orchestration-patterns": OrchestrationPatternsSection,
  "parallelization": ParallelizationSection,
  "delegation": DelegationSection,
  "skills": SkillsProgressiveDiscoverySection,
  "model-routing": ModelRoutingSection,

  // Part 6: Safety & Control
  "guardrails": GuardrailsSection,
  "human-in-loop": HumanInLoopSection,
  "external-control": ExternalControlSection,

  // Part 7: Evaluation
  "harnesses": HarnessesSection,
  "tdd-ai": TestDrivenAISection,

  // Part 8: Coding Agents
  "coding-agents-intro": CodingAgentsIntroSection,
  "cursor-architecture": CursorIDESection,
  "cursor-rules": CursorRulesSection,
  "cursor-modes": CursorModesSection,
  "cursor-patterns": CursorPatternsSection,
  "background-agents": BackgroundAgentsSection,

  // Part 9: Development Workflow
  "spec-driven": SpecDrivenDevSection,
  "cicd-iteration": CICDIterationSection,
  "graphite": GraphiteSection,
  "linear": LinearSection,
  "e2e-pipeline": E2EPipelineSection,

  // Part 10: Production
  "cost-optimization": CostOptimizationSection,
  "reliability": ReliabilitySection,

  // Capstone
  "capstone": CapstoneSection,
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
