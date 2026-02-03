// ============================================
// PR Consensus - Generic Parser
// ============================================
// Fallback parser for unknown agents and human comments

import type { ParsedComment } from '../types/index.js';

/**
 * Parse generic/unknown comment format
 *
 * Minimal processing for:
 * - Human comments
 * - Unknown AI agents
 * - Clean markdown comments
 */
export function parseGenericComment(comment: ParsedComment): ParsedComment {
  const { rawBody } = comment;

  // Extract code suggestions if present (standard format)
  const suggestionMatch = rawBody.match(/```suggestion\n?([\s\S]*?)```/);
  if (suggestionMatch) {
    comment.suggestion = suggestionMatch[1].trim();
  }

  // Clean up common markdown issues
  let cleanBody = rawBody
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\s*\n\s*\n\s*\n/g, '\n\n')  // Collapse multiple newlines
    .trim();

  // Remove excessive whitespace at line starts (common in copied code)
  const lines = cleanBody.split('\n');
  const minIndent = lines
    .filter(line => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      return Math.min(min, indent);
    }, Infinity);

  if (minIndent > 0 && minIndent !== Infinity) {
    cleanBody = lines
      .map(line => line.slice(minIndent))
      .join('\n');
  }

  comment.body = cleanBody;

  return comment;
}
