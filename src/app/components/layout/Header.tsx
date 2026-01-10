"use client";

import { Menu, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Menu toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onMenuClick}
          className="mr-3 lg:hidden"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="size-5" />
        </Button>

        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg glow-sm">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-none tracking-tight">
              AI Engineering
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Guide for Engineers
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                  >
                    <Github className="size-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Bottom border with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
