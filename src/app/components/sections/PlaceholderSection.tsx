import { SectionHeading } from "@/app/components/ui";
import type { Section } from "@/app/data/sections";

interface PlaceholderSectionProps {
  section: Section;
}

export function PlaceholderSection({ section }: PlaceholderSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <SectionHeading
        id={`${section.id}-heading`}
        title={section.title}
        subtitle={section.description}
      />
      
      <div className="prose space-y-4">
        <p className="text-muted-foreground">
          Content for the <strong className="text-foreground">{section.title}</strong> section 
          is coming soon. This section will cover {section.description?.toLowerCase()}.
        </p>
        
        <div className="h-48 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Section content placeholder
          </span>
        </div>
      </div>
    </section>
  );
}
