// ============================================
// PR Consensus - Bito Parser
// ============================================
// Bito uses HTML divs with specific IDs for structure
/**
 * Parse Bito comment format
 *
 * Bito comments typically have:
 * - <div id="suggestion"> wrapper
 * - <div id="issue"> for issue title
 * - <div id="fix"> for fix description
 * - <details><summary> for citations
 * - Code blocks with suggestions
 */
export function parseBitoComment(comment) {
    const { rawBody } = comment;
    // Extract issue title
    const issueMatch = rawBody.match(/<div id="issue"[^>]*>(?:<b>)?([^<]+)(?:<\/b>)?<\/div>/i);
    if (issueMatch) {
        comment.issue = issueMatch[1].trim();
    }
    // Extract fix description
    const fixMatch = rawBody.match(/<div id="fix"[^>]*>([\s\S]*?)<\/div>/i);
    if (fixMatch) {
        comment.fix = stripHtml(fixMatch[1]).trim();
    }
    // Extract code suggestion
    const codeMatch = rawBody.match(/```suggestion\n?([\s\S]*?)```/);
    if (codeMatch) {
        comment.suggestion = codeMatch[1].trim();
    }
    // Extract citations
    const citationsMatch = rawBody.match(/<summary>.*?Citations.*?<\/summary>([\s\S]*?)<\/details>/i);
    if (citationsMatch) {
        const citationLinks = citationsMatch[1].match(/href\s*=\s*"([^"]+)"/g);
        if (citationLinks) {
            comment.citations = citationLinks.map(link => {
                const match = link.match(/href\s*=\s*"([^"]+)"/);
                return match ? match[1] : '';
            }).filter(Boolean);
        }
    }
    // Build clean markdown body
    let cleanBody = '';
    if (comment.issue) {
        cleanBody += `**${comment.issue}**\n\n`;
    }
    if (comment.fix) {
        cleanBody += comment.fix + '\n';
    }
    if (comment.suggestion) {
        cleanBody += '\n```suggestion\n' + comment.suggestion + '\n```\n';
    }
    if (comment.citations && comment.citations.length > 0) {
        cleanBody += '\n**Citations:**\n';
        for (const citation of comment.citations) {
            cleanBody += `- ${citation}\n`;
        }
    }
    comment.body = cleanBody.trim() || stripHtml(rawBody).trim();
    return comment;
}
/**
 * Strip HTML tags from text
 */
function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}
//# sourceMappingURL=bito.js.map