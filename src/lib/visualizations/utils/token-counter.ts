/**
 * Token Counting Utilities
 *
 * Functions for estimating token counts from text content.
 * Uses word-based estimation for simplicity and speed.
 */

import type { TokenEstimationConfig } from "../types";
import { DEFAULT_TOKEN_CONFIG } from "../types";

/**
 * Count words in a string (simple whitespace split)
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/**
 * Estimate token count from word count
 */
export function wordsToTokens(
  wordCount: number,
  config: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): number {
  return Math.round(wordCount * config.tokensPerWord);
}

/**
 * Estimate token count from text
 */
export function estimateTokens(
  text: string,
  config: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): number {
  return wordsToTokens(countWords(text), config);
}

/**
 * Estimate duration in milliseconds based on token count
 */
export function tokensToDuration(
  tokens: number,
  config: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): number {
  return (tokens / config.tokensPerSecond) * 1000;
}

/**
 * Estimate duration from word count
 */
export function wordsToDuration(
  words: number,
  config: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): number {
  return tokensToDuration(wordsToTokens(words, config), config);
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return tokens.toLocaleString();
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  if (ms >= 60_000) {
    const minutes = Math.floor(ms / 60_000);
    const seconds = ((ms % 60_000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.round(ms)}ms`;
}

/**
 * Extract all text content from an object recursively
 * Useful for counting tokens in complex scenario data
 */
export function extractTextContent(obj: unknown): string[] {
  const texts: string[] = [];

  function traverse(value: unknown) {
    if (typeof value === "string") {
      texts.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(traverse);
    }
  }

  traverse(obj);
  return texts;
}

/**
 * Count total words in an object's text content
 */
export function countObjectWords(obj: unknown): number {
  return extractTextContent(obj).reduce((sum, text) => sum + countWords(text), 0);
}

/**
 * Count total tokens in an object's text content
 */
export function countObjectTokens(
  obj: unknown,
  config: TokenEstimationConfig = DEFAULT_TOKEN_CONFIG
): number {
  return wordsToTokens(countObjectWords(obj), config);
}
