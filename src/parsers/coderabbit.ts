// ============================================
// PR Consensus - CodeRabbit Parser
// ============================================
// CodeRabbit uses markdown with callouts and structured sections

import type { ParsedComment } from '../types/index.js';

/**
 * Parse CodeRabbit comment format
 *
 * CodeRabbit comments typically have:
 * - HTML comments for metadata: <!-- This is an auto-generated comment: ... -->
 * - GitHub callouts: > [!IMPORTANT], > [!NOTE], etc.
 * - Structured sections with headers
 * - Code suggestions in standard markdown format
 */
export function parseCodeRabbitComment(comment: ParsedComment): ParsedComment {
  const { rawBody } = comment;

  // Check for skip/status comments (these are noise)
  if (rawBody.includes('Review skipped') || rawBody.includes('Auto reviews are disabled')) {
    comment.isNoise = true;
    comment.noiseReason = 'Review skipped notice';
  }

  // Remove auto-generated comment markers
  let cleanBody = rawBody
    .replace(/<!--\s*This is an auto-generated comment:.*?-->/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // Extract callout type and content
  const calloutMatch = cleanBody.match(/>\s*\[!(\w+)\]\s*\n([\s\S]*?)(?=\n\n|\n>|$)/);
  if (calloutMatch) {
    const calloutType = calloutMatch[1].toUpperCase();
    comment.issue = `[${calloutType}]`;
  }

  // Extract code suggestions
  const suggestionMatch = cleanBody.match(/```(?:suggestion|diff)\n?([\s\S]*?)```/);
  if (suggestionMatch) {
    comment.suggestion = suggestionMatch[1].trim();
  }

  // Clean up the body
  cleanBody = cleanBody
    .replace(/^\s*>\s*/gm, '')  // Remove blockquote markers
    .replace(/\[!(\w+)\]\s*/g, '**[$1]** ')  // Convert callouts to bold
    .replace(/\s*\n\s*\n\s*\n/g, '\n\n')  // Collapse multiple newlines
    .trim();

  comment.body = cleanBody;

  return comment;
}
