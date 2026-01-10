import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeading({
  id,
  title,
  subtitle,
  children,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("mb-8", className)}>
      <h2
        id={id}
        className="text-2xl lg:text-3xl font-bold tracking-tight scroll-mt-20"
      >
        <a
          href={`#${id}`}
          className="group inline-flex items-center gap-2 hover:text-[var(--highlight)] transition-colors"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
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
    </header>
  );
}
