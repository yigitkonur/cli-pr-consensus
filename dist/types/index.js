// ============================================
// PR Consensus - TypeScript Type Definitions
// ============================================
export const DEFAULT_FILTER_CONFIG = {
    patterns: [
        /^Bito is crafting review details/i,
        /^@\w+\s*$/, // Just @mentions with no content
        /^\/review\s*$/i, // Just /review commands
        /Review skipped/i,
        /Auto reviews are disabled/i,
        /^\s*$/, // Empty bodies
        /^<!-- .+ -->\s*$/, // Just HTML comments
        /waiting for (CI|checks)/i,
        /will review (later|soon)/i,
    ],
    authors: [
        'dependabot',
        'dependabot[bot]',
        'renovate',
        'renovate[bot]',
    ],
    minBodyLength: 3,
};
//# sourceMappingURL=index.js.map