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
export declare function parseCodeRabbitComment(comment: ParsedComment): ParsedComment;
//# sourceMappingURL=coderabbit.d.ts.map