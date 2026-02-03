import type { ParsedComment } from '../types/index.js';
/**
 * Parse Bito comment format
 *
 * Bito comments typically have:
 * - <div id="suggestion"> wrapper
 * - <div id="issue"> for issue title
 * - <div id="fix"> for fix description
 * - <details><summary> for citations
 * - Code blocks with suggestions
 */
export declare function parseBitoComment(comment: ParsedComment): ParsedComment;
//# sourceMappingURL=bito.d.ts.map