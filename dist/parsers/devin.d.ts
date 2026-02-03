import type { ParsedComment } from '../types/index.js';
/**
 * Parse Devin comment format
 *
 * Devin comments typically have:
 * - HTML comments with JSON metadata: <!-- devin-review-comment {...} -->
 * - Markdown content with badges/links
 * - Issue descriptions
 */
export declare function parseDevinComment(comment: ParsedComment): ParsedComment;
//# sourceMappingURL=devin.d.ts.map