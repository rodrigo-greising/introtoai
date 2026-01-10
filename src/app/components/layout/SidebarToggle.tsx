"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            className={cn(
              "fixed left-4 bottom-4 z-50 hidden lg:flex",
              "bg-card/80 backdrop-blur-sm border border-border shadow-lg",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-all duration-200"
            )}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isOpen ? "Collapse sidebar" : "Expand sidebar"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
