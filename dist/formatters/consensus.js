// ============================================
// PR Consensus - Consensus Mode Formatter
// ============================================
// LLM-optimized view that groups comments by file and line
/**
 * Format output in consensus mode
 * Groups all comments by file, then by line number, for optimal LLM context
 */
export function formatAsConsensus(data) {
    const consensus = buildConsensusStructure(data);
    return renderConsensusMarkdown(consensus);
}
/**
 * Build consensus data structure from PR output
 */
function buildConsensusStructure(data) {
    // Collect all comments (general + file-specific)
    const allComments = [
        ...data.comments.general,
        ...Object.values(data.comments.byFile).flat(),
    ];
    // Separate file-specific and general comments
    const fileComments = allComments.filter(c => c.file);
    const generalComments = allComments.filter(c => !c.file);
    // Group by file
    const fileGroups = groupCommentsByFile(fileComments);
    // Build file sections ordered by folder proximity
    const fileSections = buildFileSections(fileGroups, data.files);
    // Build overall feedback from general comments
    const overallFeedback = generalComments.map(c => ({
        agent: c.agent,
        author: c.author,
        body: c.body,
    }));
    // Build summary from review bodies
    const summary = data.reviews.summary
        .filter(r => r.body && r.body.trim())
        .map(r => `**@${r.author}** (${r.state}): ${truncate(r.body, 300)}`);
    return {
        pr: {
            number: data.pr.number,
            title: data.pr.title,
            state: data.pr.state,
            author: data.pr.author,
            reviewDecision: data.pr.reviewDecision,
            fileCount: data.files.length,
            commentCount: allComments.length,
        },
        summary,
        fileReviews: fileSections,
        overallFeedback,
    };
}
/**
 * Group comments by file path
 */
function groupCommentsByFile(comments) {
    const groups = new Map();
    for (const comment of comments) {
        if (!comment.file)
            continue;
        const existing = groups.get(comment.file) || [];
        existing.push(comment);
        groups.set(comment.file, existing);
    }
    return groups;
}
/**
 * Build file sections grouped by folder for context locality
 */
function buildFileSections(fileGroups, files) {
    const sections = [];
    // Sort files by folder, then by name
    const sortedPaths = Array.from(fileGroups.keys()).sort((a, b) => {
        const folderA = a.split('/').slice(0, -1).join('/');
        const folderB = b.split('/').slice(0, -1).join('/');
        if (folderA !== folderB) {
            return folderA.localeCompare(folderB);
        }
        return a.localeCompare(b);
    });
    for (const filePath of sortedPaths) {
        const comments = fileGroups.get(filePath) || [];
        if (comments.length === 0)
            continue;
        const folder = filePath.split('/').slice(0, -1).join('/') || '.';
        // Group comments by line ranges
        const lineGroups = groupCommentsByLine(comments);
        sections.push({
            path: filePath,
            folder,
            commentCount: comments.length,
            lines: lineGroups,
        });
    }
    return sections;
}
/**
 * Group comments by line number/range
 */
function groupCommentsByLine(comments) {
    // Sort by line number
    const sorted = [...comments].sort((a, b) => {
        const lineA = a.line || 0;
        const lineB = b.line || 0;
        return lineA - lineB;
    });
    const groups = [];
    let currentGroup = null;
    for (const comment of sorted) {
        const line = comment.line || 0;
        const endLine = comment.endLine || line;
        // Check if this comment should be in the current group
        // (within 5 lines of the previous comment's range)
        if (currentGroup && line <= currentGroup.endLine + 5) {
            // Extend the current group
            currentGroup.endLine = Math.max(currentGroup.endLine, endLine);
            currentGroup.comments.push(toConsensusComment(comment));
            // Update diffHunk if this one is longer
            if (comment.diffHunk && (!currentGroup.diffHunk ||
                comment.diffHunk.length > currentGroup.diffHunk.length)) {
                currentGroup.diffHunk = comment.diffHunk;
            }
        }
        else {
            // Start a new group
            currentGroup = {
                startLine: line,
                endLine: endLine,
                diffHunk: comment.diffHunk,
                comments: [toConsensusComment(comment)],
            };
            groups.push(currentGroup);
        }
    }
    return groups;
}
/**
 * Convert ParsedComment to ConsensusComment
 */
function toConsensusComment(comment) {
    return {
        agent: comment.agent,
        author: comment.author,
        body: comment.body,
        issue: comment.issue,
        suggestion: comment.suggestion,
        fix: comment.fix,
    };
}
/**
 * Render consensus structure as markdown
 */
function renderConsensusMarkdown(consensus) {
    const lines = [];
    // Header
    lines.push(`# PR #${consensus.pr.number}: ${consensus.pr.title}`);
    lines.push('');
    lines.push(`> **Status**: ${consensus.pr.reviewDecision || 'Pending'} | **Author**: @${consensus.pr.author} | **Files**: ${consensus.pr.fileCount} | **Comments**: ${consensus.pr.commentCount}`);
    lines.push('');
    // Summary section
    if (consensus.summary.length > 0) {
        lines.push('## Summary');
        lines.push('');
        for (const item of consensus.summary) {
            lines.push(item);
            lines.push('');
        }
        lines.push('---');
        lines.push('');
    }
    // File reviews - grouped by folder
    if (consensus.fileReviews.length > 0) {
        lines.push('## File Reviews');
        lines.push('');
        let currentFolder = '';
        for (const fileSection of consensus.fileReviews) {
            // Add folder header if changed
            if (fileSection.folder !== currentFolder) {
                currentFolder = fileSection.folder;
                if (currentFolder !== '.') {
                    lines.push(`### 📁 ${currentFolder}/`);
                    lines.push('');
                }
            }
            // File header
            const fileName = fileSection.path.split('/').pop() || fileSection.path;
            lines.push(`### \`${fileName}\` (${fileSection.commentCount} comment${fileSection.commentCount !== 1 ? 's' : ''})`);
            lines.push('');
            // Line groups
            for (const lineGroup of fileSection.lines) {
                // Line range header
                if (lineGroup.startLine > 0) {
                    const lineRange = lineGroup.startLine === lineGroup.endLine
                        ? `Line ${lineGroup.startLine}`
                        : `Lines ${lineGroup.startLine}-${lineGroup.endLine}`;
                    lines.push(`#### ${lineRange}`);
                    lines.push('');
                }
                // Diff hunk (if available)
                if (lineGroup.diffHunk) {
                    lines.push('```diff');
                    // Limit diff hunk to reasonable size
                    const hunkLines = lineGroup.diffHunk.split('\n').slice(0, 15);
                    lines.push(hunkLines.join('\n'));
                    if (lineGroup.diffHunk.split('\n').length > 15) {
                        lines.push('// ... (truncated)');
                    }
                    lines.push('```');
                    lines.push('');
                }
                // Comments in this group
                for (const comment of lineGroup.comments) {
                    // Comment header with agent badge
                    const agentBadge = comment.agent !== 'generic' ? ` [${comment.agent}]` : '';
                    lines.push(`**@${comment.author}**${agentBadge}:`);
                    // Issue title if present
                    if (comment.issue) {
                        lines.push(`> **Issue**: ${comment.issue}`);
                    }
                    // Body
                    lines.push(`> ${comment.body.replace(/\n/g, '\n> ')}`);
                    // Fix if present
                    if (comment.fix) {
                        lines.push('');
                        lines.push(`> **Fix**: ${comment.fix}`);
                    }
                    // Suggestion if present
                    if (comment.suggestion) {
                        lines.push('');
                        lines.push('> **Suggestion**:');
                        lines.push('> ```suggestion');
                        lines.push(`> ${comment.suggestion.replace(/\n/g, '\n> ')}`);
                        lines.push('> ```');
                    }
                    lines.push('');
                }
            }
            lines.push('---');
            lines.push('');
        }
    }
    // Overall feedback (non-file-specific comments)
    if (consensus.overallFeedback.length > 0) {
        lines.push('## Overall Feedback');
        lines.push('');
        for (const feedback of consensus.overallFeedback) {
            const agentBadge = feedback.agent !== 'generic' ? ` [${feedback.agent}]` : '';
            lines.push(`### @${feedback.author}${agentBadge}`);
            lines.push('');
            lines.push(feedback.body);
            lines.push('');
        }
    }
    // Footer
    lines.push('---');
    lines.push('*Generated in consensus mode by pr-consensus*');
    return lines.join('\n');
}
/**
 * Truncate text with ellipsis
 */
function truncate(text, maxLength) {
    const cleaned = text.replace(/\n+/g, ' ').trim();
    if (cleaned.length <= maxLength)
        return cleaned;
    return cleaned.slice(0, maxLength - 3) + '...';
}
//# sourceMappingURL=consensus.js.map