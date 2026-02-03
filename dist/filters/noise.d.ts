import type { ParsedComment, FilterConfig } from '../types/index.js';
/**
 * Load filter configuration
 * Merges hardcoded defaults with user-defined patterns
 */
export declare function loadFilterConfig(filterFilePath?: string): FilterConfig;
/**
 * Check if a comment should be filtered (is noise)
 */
export declare function isNoiseComment(comment: ParsedComment, config: FilterConfig): boolean;
/**
 * Filter out noise comments from array
 */
export declare function filterNoiseComments(comments: ParsedComment[], config: FilterConfig): ParsedComment[];
/**
 * Get noise statistics
 */
export declare function getNoiseStats(comments: ParsedComment[]): {
    total: number;
    noise: number;
    kept: number;
    byReason: Record<string, number>;
};
//# sourceMappingURL=noise.d.ts.map