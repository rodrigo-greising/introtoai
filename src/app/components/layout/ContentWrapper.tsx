"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
  isSidebarOpen: boolean;
}

export function ContentWrapper({ children, isSidebarOpen }: ContentWrapperProps) {
  return (
    <main
      className={cn(
        "flex-1 sidebar-transition",
        "lg:pl-0" // Sidebar is fixed position, so no margin needed
      )}
    >
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
        {children}
      </div>
    </main>
  );
}
