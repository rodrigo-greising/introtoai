"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseActiveSectionOptions {
  /** IDs of sections to observe */
  sectionIds: string[];
  /** Offset from top of viewport to trigger section change (default: 100px) */
  offset?: number;
  /** Debounce delay in ms (default: 10ms) */
  debounceMs?: number;
}

/**
 * Hook to track which section is currently in view using IntersectionObserver.
 * Returns the ID of the currently active section.
 */
export function useActiveSection({
  sectionIds,
  offset = 100,
  debounceMs = 10,
}: UseActiveSectionOptions): string {
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds[0] || ""
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced section setter
  const debouncedSetActive = useCallback(
    (sectionId: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setActiveSection(sectionId);
      }, debounceMs);
    },
    [debounceMs]
  );

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Map to track visible sections and their positions
    const visibleSections = new Map<string, number>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        
        if (entry.isIntersecting) {
          // Store the top position of the visible section
          visibleSections.set(sectionId, entry.boundingClientRect.top);
        } else {
          visibleSections.delete(sectionId);
        }
      });

      // Find the section closest to the top of the viewport (but below offset)
      if (visibleSections.size > 0) {
        let closestSection = "";
        let closestDistance = Infinity;

        visibleSections.forEach((top, id) => {
          const distance = Math.abs(top - offset);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = id;
          }
        });

        if (closestSection) {
          debouncedSetActive(closestSection);
        }
      }
    };

    // Create observer with rootMargin to account for header offset
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.1, 0.5, 1],
    });

    // Observe all section elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sectionIds, offset, debouncedSetActive]);

  return activeSection;
}

/**
 * Smoothly scroll to a section by ID
 */
export function scrollToSection(sectionId: string, offset = 80): void {
  const element = document.getElementById(sectionId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }
}
