// ============================================
// PR Consensus - YAML Formatter (LLM Optimized)
// ============================================
import YAML from 'yaml';
/**
 * Format output as YAML (LLM optimized - readable, grouped by context)
 */
export function formatAsYAML(data) {
    // Create a cleaner structure optimized for LLM consumption
    const llmOptimized = {
        // Header info
        pr: {
            number: data.pr.number,
            title: data.pr.title,
            author: data.pr.author,
            state: data.pr.state,
            review_status: data.pr.reviewDecision,
            stats: `+${data.pr.additions} -${data.pr.deletions} (${data.pr.changedFiles} files)`,
        },
        // Group files by folder for context locality
        files_by_folder: groupFilesByFolder(data),
        // Reviews summary (compact)
        reviews: data.reviews.summary.map(r => ({
            reviewer: r.author,
            decision: r.state,
            comments: r.commentCount,
        })),
        // CI status (if present)
        ...(data.ci && {
            ci: {
                status: data.ci.status,
                checks: data.ci.checks.map(c => `${c.name}: ${c.conclusion || c.status}`),
            },
        }),
    };
    return YAML.stringify(llmOptimized, {
        indent: 2,
        lineWidth: 120,
        defaultStringType: 'PLAIN',
        defaultKeyType: 'PLAIN',
    });
}
/**
 * Group files and their comments by folder for better context locality
 */
function groupFilesByFolder(data) {
    const folders = {};
    // Group files by their parent folder
    for (const file of data.files) {
        const parts = file.path.split('/');
        const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '.';
        const fileName = parts[parts.length - 1];
        if (!folders[folder]) {
            folders[folder] = {
                files: [],
                total_changes: 0,
            };
        }
        const fileComments = data.comments.byFile[file.path] || [];
        folders[folder].files.push({
            name: fileName,
            changes: `+${file.additions} -${file.deletions}`,
            comments: fileComments.length > 0
                ? fileComments.map(c => formatCommentCompact(c))
                : undefined,
        });
        folders[folder].total_changes += file.additions + file.deletions;
    }
    // Sort folders by total changes (most changed first)
    const sortedFolders = {};
    const folderEntries = Object.entries(folders)
        .sort((a, b) => b[1].total_changes - a[1].total_changes);
    for (const [folder, group] of folderEntries) {
        sortedFolders[folder] = group;
    }
    return sortedFolders;
}
/**
 * Format a comment in compact form for YAML
 */
function formatCommentCompact(comment) {
    const compact = {
        by: comment.author,
        body: truncateBody(comment.body, 200),
    };
    if (comment.line) {
        compact.line = comment.line;
    }
    if (comment.issue) {
        compact.issue = comment.issue;
    }
    if (comment.suggestion) {
        compact.suggestion = truncateBody(comment.suggestion, 100);
    }
    return compact;
}
/**
 * Truncate body text for compact display
 */
function truncateBody(text, maxLength) {
    const cleaned = text
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (cleaned.length <= maxLength) {
        return cleaned;
    }
    return cleaned.slice(0, maxLength - 3) + '...';
}
//# sourceMappingURL=yaml.js.map