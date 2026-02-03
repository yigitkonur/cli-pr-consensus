// ============================================
// PR Consensus - Devin Parser
// ============================================
// Devin uses HTML comments with JSON metadata

import type { ParsedComment } from '../types/index.js';

interface DevinMetadata {
  id?: string;
  file_path?: string;
  start_line?: number;
  end_line?: number;
  severity?: string;
  category?: string;
  issue_type?: string;
}

/**
 * Parse Devin comment format
 *
 * Devin comments typically have:
 * - HTML comments with JSON metadata: <!-- devin-review-comment {...} -->
 * - Markdown content with badges/links
 * - Issue descriptions
 */
export function parseDevinComment(comment: ParsedComment): ParsedComment {
  const { rawBody } = comment;

  // Extract JSON metadata from HTML comments
  const metadataMatch = rawBody.match(/<!--\s*devin-review-comment\s*(\{[\s\S]*?\})\s*-->/);
  let metadata: DevinMetadata = {};

  if (metadataMatch) {
    try {
      metadata = JSON.parse(metadataMatch[1]);

      // Use metadata to enrich comment
      if (metadata.file_path && !comment.file) {
        comment.file = metadata.file_path;
      }
      if (metadata.start_line && !comment.line) {
        comment.line = metadata.start_line;
      }
      if (metadata.end_line) {
        comment.endLine = metadata.end_line;
      }
      if (metadata.issue_type) {
        comment.issue = metadata.issue_type;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Remove HTML comments and badges for clean body
  let cleanBody = rawBody
    .replace(/<!--[\s\S]*?-->/g, '')  // Remove HTML comments
    .replace(/<a[^>]*>[\s\S]*?<\/a>/gi, '')  // Remove links with images
    .replace(/<picture>[\s\S]*?<\/picture>/gi, '')  // Remove picture elements
    .replace(/<img[^>]*>/gi, '')  // Remove images
    .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')  // Remove markdown image links
    .replace(/\s*\n\s*\n\s*\n/g, '\n\n')  // Collapse multiple newlines
    .trim();

  // Extract the main content (usually after "found X potential issues")
  const issueCountMatch = cleanBody.match(/found\s+(\d+)\s+potential\s+issues?/i);
  if (issueCountMatch) {
    comment.issue = `Found ${issueCountMatch[1]} potential issue(s)`;
  }

  // Look for issue description after stripping metadata
  const descriptionMatch = cleanBody.match(/\*\*([^*]+)\*\*/);
  if (descriptionMatch && !comment.issue) {
    comment.issue = descriptionMatch[1].trim();
  }

  comment.body = cleanBody || rawBody;

  return comment;
}
