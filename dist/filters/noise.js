// ============================================
// PR Consensus - Noise Filtering
// ============================================
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { DEFAULT_NOISE_PATTERNS } from './defaults.js';
/**
 * Load filter configuration
 * Merges hardcoded defaults with user-defined patterns
 */
export function loadFilterConfig(filterFilePath) {
    const config = {
        patterns: [...DEFAULT_NOISE_PATTERNS],
        authors: [
            'dependabot',
            'dependabot[bot]',
            'renovate',
            'renovate[bot]',
        ],
        minBodyLength: 3,
    };
    // Try to load user-defined filter file
    const filePath = filterFilePath || findFilterFile();
    if (filePath && existsSync(filePath)) {
        const userPatterns = parseFilterFile(filePath);
        config.patterns.push(...userPatterns.patterns);
        config.authors.push(...userPatterns.authors);
    }
    return config;
}
/**
 * Find .pr-consensus-ignore file in current directory or parent directories
 */
function findFilterFile() {
    const possiblePaths = [
        '.pr-consensus-ignore',
        '.pr-consensusignore',
        join(process.env.HOME || '', '.pr-consensus-ignore'),
    ];
    for (const path of possiblePaths) {
        if (existsSync(path)) {
            return path;
        }
    }
    return null;
}
/**
 * Parse filter file content
 *
 * Format:
 * # Comment line
 * /pattern/flags  - Regex pattern
 * @username       - Author to exclude
 * plain text      - Plain text pattern (converted to regex)
 */
function parseFilterFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    const patterns = [];
    const authors = [];
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        // Author pattern
        if (trimmed.startsWith('@')) {
            authors.push(trimmed.slice(1));
            continue;
        }
        // Regex pattern: /pattern/flags
        const regexMatch = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
        if (regexMatch) {
            try {
                patterns.push(new RegExp(regexMatch[1], regexMatch[2]));
            }
            catch (e) {
                console.warn(`Invalid regex pattern in filter file: ${trimmed}`);
            }
            continue;
        }
        // Plain text pattern - convert to case-insensitive regex
        patterns.push(new RegExp(escapeRegex(trimmed), 'i'));
    }
    return { patterns, authors };
}
/**
 * Escape special regex characters
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * Check if a comment should be filtered (is noise)
 */
export function isNoiseComment(comment, config) {
    // Already marked as noise by parser
    if (comment.isNoise) {
        return true;
    }
    const body = comment.body.trim();
    // Check minimum body length
    if (body.length < config.minBodyLength) {
        comment.isNoise = true;
        comment.noiseReason = 'Body too short';
        return true;
    }
    // Check author exclusions
    if (config.authors.some(author => comment.author.toLowerCase().includes(author.toLowerCase()))) {
        comment.isNoise = true;
        comment.noiseReason = `Author excluded: ${comment.author}`;
        return true;
    }
    // Check pattern matches
    for (const pattern of config.patterns) {
        if (pattern.test(body)) {
            comment.isNoise = true;
            comment.noiseReason = `Matched noise pattern: ${pattern.source}`;
            return true;
        }
    }
    return false;
}
/**
 * Filter out noise comments from array
 */
export function filterNoiseComments(comments, config) {
    return comments.filter(comment => !isNoiseComment(comment, config));
}
/**
 * Get noise statistics
 */
export function getNoiseStats(comments) {
    const stats = {
        total: comments.length,
        noise: 0,
        kept: 0,
        byReason: {},
    };
    for (const comment of comments) {
        if (comment.isNoise) {
            stats.noise++;
            const reason = comment.noiseReason || 'Unknown';
            stats.byReason[reason] = (stats.byReason[reason] || 0) + 1;
        }
        else {
            stats.kept++;
        }
    }
    return stats;
}
//# sourceMappingURL=noise.js.map