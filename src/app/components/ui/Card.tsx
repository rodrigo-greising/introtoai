import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered" | "highlight";
}

export function Card({
  children,
  className,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        {
          "bg-card border border-border": variant === "default",
          "bg-card border border-border shadow-lg": variant === "elevated",
          "bg-transparent border-2 border-border": variant === "bordered",
          "bg-[var(--highlight-muted)] border border-[var(--highlight)]/20": variant === "highlight",
        },
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({ children, className, as: Tag = "h3" }: CardTitleProps) {
  return (
    <Tag className={cn("font-semibold tracking-tight", className)}>
      {children}
    </Tag>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("prose", className)}>
      {children}
    </div>
  );
}
