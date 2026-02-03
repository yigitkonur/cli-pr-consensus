import type { AgentType, ParsedComment } from '../types/index.js';
/**
 * Detect agent type from author login
 */
export declare function detectAgentType(author: string): AgentType;
/**
 * Check if an author is a known AI agent
 */
export declare function isAIAgent(author: string): boolean;
/**
 * Parse a comment based on detected agent type
 */
export declare function parseComment(id: string, author: string, body: string, createdAt: string, type: 'comment' | 'review' | 'inline', options?: {
    file?: string;
    line?: number;
    endLine?: number;
    diffHunk?: string;
    isResolved?: boolean;
    replyToId?: string;
}): ParsedComment;
/**
 * Extract all agents that participated in a PR
 */
export declare function extractParticipatingAgents(comments: ParsedComment[]): AgentType[];
/**
 * Group comments by agent
 */
export declare function groupCommentsByAgent(comments: ParsedComment[]): Record<AgentType, ParsedComment[]>;
//# sourceMappingURL=index.d.ts.map