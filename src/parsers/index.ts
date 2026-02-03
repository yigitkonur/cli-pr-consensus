// ============================================
// PR Consensus - Agent Detection & Parsing
// ============================================

import type { AgentType, ParsedComment } from '../types/index.js';
import { parseCopilotComment } from './copilot.js';
import { parseBitoComment } from './bito.js';
import { parseDevinComment } from './devin.js';
import { parseCodeRabbitComment } from './coderabbit.js';
import { parseGenericComment } from './generic.js';

// Agent detection patterns
const AGENT_PATTERNS: Record<AgentType, RegExp[]> = {
  copilot: [
    /^copilot$/i,
    /^copilot-/i,
    /copilot-pull-request-reviewer/i,
  ],
  bito: [
    /^bito-/i,
    /bito-code-review/i,
    /^bito$/i,
  ],
  devin: [
    /^devin-/i,
    /devin-ai-integration/i,
    /^devin$/i,
  ],
  coderabbit: [
    /^coderabbitai$/i,
    /^coderabbit/i,
  ],
  greptile: [
    /^greptile/i,
  ],
  generic: [], // Fallback, no patterns needed
};

/**
 * Detect agent type from author login
 */
export function detectAgentType(author: string): AgentType {
  for (const [agentType, patterns] of Object.entries(AGENT_PATTERNS)) {
    if (agentType === 'generic') continue;

    for (const pattern of patterns) {
      if (pattern.test(author)) {
        return agentType as AgentType;
      }
    }
  }

  return 'generic';
}

/**
 * Check if an author is a known AI agent
 */
export function isAIAgent(author: string): boolean {
  return detectAgentType(author) !== 'generic';
}

/**
 * Parse a comment based on detected agent type
 */
export function parseComment(
  id: string,
  author: string,
  body: string,
  createdAt: string,
  type: 'comment' | 'review' | 'inline',
  options?: {
    file?: string;
    line?: number;
    endLine?: number;
    diffHunk?: string;
    isResolved?: boolean;
    replyToId?: string;
  }
): ParsedComment {
  const agentType = detectAgentType(author);

  const baseComment: ParsedComment = {
    id,
    agent: agentType,
    author,
    body,
    rawBody: body,
    createdAt,
    type,
    file: options?.file,
    line: options?.line,
    endLine: options?.endLine,
    diffHunk: options?.diffHunk,
    isResolved: options?.isResolved,
    replyToId: options?.replyToId,
  };

  // Parse based on agent type
  switch (agentType) {
    case 'copilot':
      return parseCopilotComment(baseComment);
    case 'bito':
      return parseBitoComment(baseComment);
    case 'devin':
      return parseDevinComment(baseComment);
    case 'coderabbit':
      return parseCodeRabbitComment(baseComment);
    case 'greptile':
      // Greptile uses clean markdown, minimal parsing needed
      return parseGenericComment(baseComment);
    default:
      return parseGenericComment(baseComment);
  }
}

/**
 * Extract all agents that participated in a PR
 */
export function extractParticipatingAgents(comments: ParsedComment[]): AgentType[] {
  const agents = new Set<AgentType>();

  for (const comment of comments) {
    if (comment.agent !== 'generic') {
      agents.add(comment.agent);
    }
  }

  return Array.from(agents);
}

/**
 * Group comments by agent
 */
export function groupCommentsByAgent(
  comments: ParsedComment[]
): Record<AgentType, ParsedComment[]> {
  const groups: Record<AgentType, ParsedComment[]> = {
    copilot: [],
    bito: [],
    devin: [],
    coderabbit: [],
    greptile: [],
    generic: [],
  };

  for (const comment of comments) {
    groups[comment.agent].push(comment);
  }

  return groups;
}
