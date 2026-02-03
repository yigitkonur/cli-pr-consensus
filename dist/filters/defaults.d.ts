/**
 * Default patterns to filter out noise comments
 * These are common patterns from AI code review agents that don't add value
 */
export declare const DEFAULT_NOISE_PATTERNS: RegExp[];
/**
 * Authors to always exclude (bots that don't provide useful review comments)
 */
export declare const DEFAULT_EXCLUDED_AUTHORS: string[];
/**
 * Patterns that indicate a comment has useful content
 * (opposite of noise - if these match, keep the comment)
 */
export declare const USEFUL_CONTENT_PATTERNS: RegExp[];
/**
 * Check if content contains useful patterns (override noise filtering)
 */
export declare function hasUsefulContent(body: string): boolean;
//# sourceMappingURL=defaults.d.ts.map