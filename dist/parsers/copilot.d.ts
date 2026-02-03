import type { ParsedComment } from '../types/index.js';
/**
 * Parse Copilot comment format
 *
 * Copilot comments are clean text, often with:
 * - Direct issue description
 * - ```suggestion blocks for code fixes
 * - References to specific lines/code
 */
export declare function parseCopilotComment(comment: ParsedComment): ParsedComment;
//# sourceMappingURL=copilot.d.ts.map