import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, Lightbulb, Flame } from "lucide-react";

type CalloutVariant = "info" | "warning" | "success" | "tip" | "important";

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    styles: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    styles: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    styles: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-500",
  },
  success: {
    icon: CheckCircle,
    styles: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  tip: {
    icon: Lightbulb,
    styles: "bg-[var(--highlight-muted)] border-[var(--highlight)]/20",
    iconColor: "text-[var(--highlight)]",
  },
  important: {
    icon: Flame,
    styles: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-500",
  },
};

export function Callout({
  children,
  variant = "info",
  title,
  className,
}: CalloutProps) {
  const { icon: Icon, styles, iconColor } = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg border p-4",
        styles,
        className
      )}
      role="note"
    >
      <Icon className={cn("size-5 shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1 space-y-1">
        {title && (
          <p className="font-medium text-foreground">{title}</p>
        )}
        <div className="text-sm text-muted-foreground [&>p]:m-0">
          {children}
        </div>
      </div>
    </div>
  );
}
