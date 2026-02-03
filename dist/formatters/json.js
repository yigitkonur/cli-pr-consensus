// ============================================
// PR Consensus - JSON Formatter
// ============================================
/**
 * Format output as JSON
 */
export function formatAsJSON(data, pretty = true) {
    if (pretty) {
        return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(data);
}
/**
 * Format output as NDJSON (newline-delimited JSON) for streaming
 */
export function formatAsNDJSON(data) {
    const lines = [];
    // Meta
    lines.push(JSON.stringify({ type: 'meta', data: data.meta }));
    // PR info
    lines.push(JSON.stringify({ type: 'pr', data: data.pr }));
    // Files
    for (const file of data.files) {
        lines.push(JSON.stringify({ type: 'file', data: file }));
    }
    // General comments
    for (const comment of data.comments.general) {
        lines.push(JSON.stringify({ type: 'comment', subtype: 'general', data: comment }));
    }
    // File comments
    for (const [filePath, comments] of Object.entries(data.comments.byFile)) {
        for (const comment of comments) {
            lines.push(JSON.stringify({ type: 'comment', subtype: 'file', file: filePath, data: comment }));
        }
    }
    // Reviews
    for (const review of data.reviews.summary) {
        lines.push(JSON.stringify({ type: 'review', data: review }));
    }
    // CI
    if (data.ci) {
        lines.push(JSON.stringify({ type: 'ci', data: data.ci }));
    }
    return lines.join('\n');
}
//# sourceMappingURL=json.js.map