"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)] overflow-hidden",
        className
      )}
    >
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between border-b border-[var(--code-border)] bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="size-3.5" />
          <span>{filename || language}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">
          {showLineNumbers ? (
            lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="select-none pr-4 text-muted-foreground/50 text-right w-8">
                  {index + 1}
                </span>
                <span>{line || " "}</span>
              </div>
            ))
          ) : (
            <span>{code}</span>
          )}
        </code>
      </pre>
    </div>
  );
}
