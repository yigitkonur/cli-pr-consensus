// ============================================
// PR Consensus - Default Noise Filter Patterns
// ============================================
// Hardcoded patterns for well-known agent noise
/**
 * Default patterns to filter out noise comments
 * These are common patterns from AI code review agents that don't add value
 */
export const DEFAULT_NOISE_PATTERNS = [
    // Empty or whitespace-only
    /^\s*$/,
    // Just @mentions with no content
    /^@\w+\s*$/,
    // Just command invocations
    /^\/review\s*$/i,
    /^\/approve\s*$/i,
    /^\/dismiss\s*$/i,
    // Bito status messages
    /^Bito is crafting review details/i,
    /^Bito Code Review Agent/i,
    // CodeRabbit status messages
    /Review skipped/i,
    /Auto reviews are disabled/i,
    /Walkthrough has been disabled/i,
    // Generic waiting/status messages
    /waiting for (CI|checks|review)/i,
    /will review (later|soon)/i,
    /reviewing\.\.\./i,
    /^checking\.\.\./i,
    // Bot acknowledgments
    /^Thanks for your (contribution|PR)/i,
    /^Thank you for (contributing|your)/i,
    // Just HTML comments
    /^<!--[\s\S]*-->$/,
    // Just emoji reactions (no text)
    /^[:]\w+[:]$/,
    /^[\u{1F300}-\u{1F9FF}]+$/u,
    // Dependabot/Renovate auto-comments
    /^Superseded by #\d+/i,
    /^This PR has been superseded/i,
    // GitHub Actions bot messages
    /^This comment has been minimized/i,
    // Common agent "thinking" messages
    /^Analyzing\.\.\./i,
    /^Processing\.\.\./i,
    /^Scanning\.\.\./i,
    // Duplicate detection
    /^This appears to be a duplicate/i,
    // Auto-generated notices
    /This is an automated (message|comment)/i,
    /automatically generated/i,
];
/**
 * Authors to always exclude (bots that don't provide useful review comments)
 */
export const DEFAULT_EXCLUDED_AUTHORS = [
    'dependabot',
    'dependabot[bot]',
    'renovate',
    'renovate[bot]',
    'github-actions',
    'github-actions[bot]',
    'codecov',
    'codecov[bot]',
    'sonarcloud',
    'sonarcloud[bot]',
    'stale',
    'stale[bot]',
];
/**
 * Patterns that indicate a comment has useful content
 * (opposite of noise - if these match, keep the comment)
 */
export const USEFUL_CONTENT_PATTERNS = [
    // Contains code suggestions
    /```suggestion/i,
    /```diff/i,
    // Contains issue/fix structure
    /<div id="(issue|fix|suggestion)"/i,
    // Contains line references
    /line\s+\d+/i,
    /lines?\s+\d+-\d+/i,
    // Contains file paths
    /\w+\.(ts|js|tsx|jsx|py|go|rs|java|rb|php|c|cpp|h|hpp|swift|kt)\b/i,
    // Contains actual review content keywords
    /\b(bug|error|issue|fix|refactor|improve|security|vulnerability|performance|memory|leak|race condition)\b/i,
];
/**
 * Check if content contains useful patterns (override noise filtering)
 */
export function hasUsefulContent(body) {
    return USEFUL_CONTENT_PATTERNS.some(pattern => pattern.test(body));
}
//# sourceMappingURL=defaults.js.map