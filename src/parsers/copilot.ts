// ============================================
// PR Consensus - Copilot Parser
// ============================================
// Copilot uses plain text with ```suggestion blocks

import type { ParsedComment } from '../types/index.js';

/**
 * Parse Copilot comment format
 *
 * Copilot comments are clean text, often with:
 * - Direct issue description
 * - ```suggestion blocks for code fixes
 * - References to specific lines/code
 */
export function parseCopilotComment(comment: ParsedComment): ParsedComment {
  const { rawBody } = comment;

  // Extract code suggestion if present
  const suggestionMatch = rawBody.match(/```suggestion\n([\s\S]*?)```/);
  if (suggestionMatch) {
    comment.suggestion = suggestionMatch[1].trim();
  }

  // Clean body - remove the suggestion block for the main body
  let cleanBody = rawBody
    .replace(/```suggestion\n[\s\S]*?```/g, '')
    .trim();

  // If there's a suggestion, add a reference to it
  if (comment.suggestion && cleanBody) {
    cleanBody = cleanBody + '\n\n*(See code suggestion below)*';
  }

  comment.body = cleanBody || rawBody;

  return comment;
}
