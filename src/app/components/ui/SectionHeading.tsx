"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSectionMarkdown } from "@/lib/markdown-utils";

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  sectionId?: string; // The section ID for copying (e.g., "intro", "how-llms-work")
}

export function SectionHeading({
  id,
  title,
  subtitle,
  children,
  className,
  sectionId,
}: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);

  // Extract section ID from the heading ID if not provided
  // Heading IDs are like "intro-heading", section IDs are like "intro"
  const actualSectionId = sectionId || id.replace("-heading", "");

  const handleCopySection = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const markdown = getSectionMarkdown(actualSectionId);
      if (markdown) {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy section:", err);
    }
  };

  return (
    <header className={cn("mb-8 relative group", className)}>
      <h2
        id={id}
        className="text-2xl lg:text-3xl font-bold tracking-tight scroll-mt-20"
      >
        <a
          href={`#${id}`}
          className="group/link inline-flex items-center gap-2 hover:text-[var(--highlight)] transition-colors"
        >
          {title}
          <span className="opacity-0 group-hover/link:opacity-100 text-muted-foreground transition-opacity">
            #
          </span>
        </a>
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
      {children}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-0 right-0 copy-button text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopySection}
              aria-label={copied ? "Copied!" : `Copy ${title} section as markdown`}
              data-copy-ignore
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied to clipboard!" : `Copy ${title} section as markdown`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
