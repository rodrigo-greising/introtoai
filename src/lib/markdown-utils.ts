/**
 * Utility functions for converting DOM content to markdown
 */

/**
 * Converts a DOM element to markdown format
 */
function elementToMarkdown(element: HTMLElement): string {
  // Helper to process a node
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes);
    let content = "";

    // Skip interactive elements, hidden content, and copy buttons
    if (
      el.classList.contains("hidden") ||
      el.hasAttribute("data-copy-ignore") ||
      el.closest('[data-copy-ignore]') ||
      tagName === "script" ||
      tagName === "style" ||
      tagName === "noscript" ||
      el.classList.contains("copy-button") ||
      el.closest(".copy-button")
    ) {
      return "";
    }

    // Process children first
    for (const child of children) {
      content += processNode(child);
    }

    // Apply markdown formatting based on tag
    switch (tagName) {
      case "h1":
        return `# ${content.trim()}\n\n`;
      case "h2":
        return `## ${content.trim()}\n\n`;
      case "h3":
        return `### ${content.trim()}\n\n`;
      case "h4":
        return `#### ${content.trim()}\n\n`;
      case "h5":
        return `##### ${content.trim()}\n\n`;
      case "h6":
        return `###### ${content.trim()}\n\n`;
      case "p":
        const text = content.trim();
        return text ? `${text}\n\n` : "";
      case "strong":
      case "b":
        return `**${content.trim()}**`;
      case "em":
      case "i":
        return `*${content.trim()}*`;
      case "code":
        // Check if inside a pre block
        if (el.parentElement?.tagName.toLowerCase() === "pre") {
          return content;
        }
        return `\`${content.trim()}\``;
      case "pre":
        const codeContent = el.querySelector("code")?.textContent || content;
        return `\`\`\`\n${codeContent}\n\`\`\`\n\n`;
      case "ul":
      case "ol":
        return `${content}\n`;
      case "li":
        const prefix = el.parentElement?.tagName.toLowerCase() === "ol" ? "1. " : "- ";
        return `${prefix}${content.trim()}\n`;
      case "blockquote":
        return `> ${content.trim().split("\n").join("\n> ")}\n\n`;
      case "a":
        const href = el.getAttribute("href");
        if (href && content.trim()) {
          return `[${content.trim()}](${href})`;
        }
        return content;
      case "hr":
        return `---\n\n`;
      case "br":
        return "\n";
      case "div":
      case "span":
      case "section":
      case "article":
      case "main":
        // For containers, just return content
        return content;
      default:
        return content;
    }
  };

  let markdown = processNode(element);
  
  // Clean up extra whitespace
  markdown = markdown
    .replace(/\n{3,}/g, "\n\n") // Max 2 newlines
    .replace(/[ \t]+/g, " ") // Multiple spaces to single
    .trim();

  return markdown;
}

/**
 * Gets the content of a section by its ID and converts to markdown
 */
export function getSectionMarkdown(sectionId: string): string {
  // Try to find the section element directly
  let section = document.getElementById(sectionId);
  
  // If not found, try to find a section element with this ID
  if (!section || section.tagName.toLowerCase() !== "section") {
    section = document.querySelector(`section#${sectionId}`);
  }
  
  // If still not found, try to find by heading ID and get parent section
  if (!section) {
    const heading = document.getElementById(sectionId);
    if (heading) {
      section = heading.closest("section");
    }
  }
  
  // If still not found, try with -heading suffix removed
  if (!section) {
    const baseId = sectionId.replace("-heading", "");
    section = document.querySelector(`section#${baseId}`);
  }

  if (!section) {
    return "";
  }

  // Clone the section to avoid modifying the original
  const cloned = section.cloneNode(true) as HTMLElement;
  
  // Remove copy buttons and other UI elements
  cloned.querySelectorAll('.copy-button, [data-copy-ignore]').forEach(el => el.remove());
  
  // Get the heading
  const heading = cloned.querySelector("h2");
  let markdown = "";

  if (heading) {
    // Get the section title (remove the # link if present)
    const titleLink = heading.querySelector("a");
    const title = titleLink ? titleLink.textContent?.trim() : heading.textContent?.trim() || "";
    markdown = `## ${title}\n\n`;
    
    // Remove the heading from cloned content
    heading.remove();
  }

  // Convert the rest of the content
  markdown += elementToMarkdown(cloned);

  return markdown.trim();
}

/**
 * Gets all page content and converts to markdown
 */
export function getPageMarkdown(): string {
  const main = document.querySelector("main");
  if (!main) {
    return "";
  }

  // Get all section elements
  const sections = main.querySelectorAll("section[id]");
  
  let markdown = "# AI Engineering Guide\n\n";
  markdown += "A comprehensive guide for engineers building with AI.\n\n";
  markdown += "---\n\n";

  sections.forEach((section) => {
    const sectionId = section.id;
    if (sectionId) {
      const sectionMarkdown = getSectionMarkdown(sectionId);
      if (sectionMarkdown) {
        markdown += sectionMarkdown + "\n\n---\n\n";
      }
    }
  });

  return markdown.trim();
}
