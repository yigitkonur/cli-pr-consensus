// ============================================
// PR Consensus - TypeScript Type Definitions
// ============================================

// CLI Options
export interface CLIOptions {
  code: boolean;
  full: boolean;
  format: OutputFormat;
  template?: string;
  output?: string;
  includeDiff: boolean;
  noFilter: boolean;
  filterFile?: string;
  verbose: boolean;
  quiet: boolean;
}

export type OutputFormat = 'json' | 'yaml' | 'md' | 'consensus';
export type DataMode = 'normal' | 'code' | 'full';

// PR URL Parsing
export interface ParsedPRUrl {
  owner: string;
  repo: string;
  number: number;
}

// ============================================
// GitHub API Response Types
// ============================================

export interface GitHubUser {
  login: string;
  name?: string;
  email?: string;
}

export interface GitHubLabel {
  name: string;
  color: string;
  description?: string;
}

export interface GitHubMilestone {
  title: string;
  number: number;
  state: string;
}

export interface GitHubFile {
  path: string;
  additions: number;
  deletions: number;
  changeType?: string;
}

export interface GitHubCommit {
  oid: string;
  message: string;
  messageHeadline: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
}

export interface GitHubReaction {
  content: string;
  user: { login: string };
}

export interface GitHubComment {
  id: string;
  databaseId?: number;
  body: string;
  author: { login: string };
  createdAt: string;
  updatedAt: string;
  isMinimized?: boolean;
  minimizedReason?: string;
  reactions?: {
    nodes: GitHubReaction[];
  };
}

export interface GitHubReviewComment {
  id: string;
  databaseId?: number;
  body: string;
  author: { login: string };
  createdAt: string;
  updatedAt?: string;
  path: string;
  line?: number;
  position?: number;
  originalPosition?: number;
  diffHunk?: string;
  outdated?: boolean;
  replyTo?: {
    id: string;
    author: { login: string };
  };
  reactions?: {
    nodes: GitHubReaction[];
  };
}

export interface GitHubReviewThread {
  id: string;
  isResolved: boolean;
  isOutdated: boolean;
  isCollapsed?: boolean;
  path: string;
  line?: number;
  comments: {
    nodes: GitHubReviewComment[];
  };
}

export interface GitHubReview {
  id: string;
  databaseId?: number;
  body: string;
  state: ReviewState;
  author: { login: string };
  submittedAt: string;
  comments?: {
    nodes: GitHubReviewComment[];
  };
}

export type ReviewState =
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'COMMENTED'
  | 'DISMISSED'
  | 'PENDING';

export type ReviewDecision =
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'REVIEW_REQUIRED'
  | null;

export type MergeStateStatus =
  | 'BEHIND'
  | 'BLOCKED'
  | 'CLEAN'
  | 'DIRTY'
  | 'DRAFT'
  | 'HAS_HOOKS'
  | 'UNSTABLE'
  | 'UNKNOWN';

export interface GitHubAutoMergeRequest {
  enabledBy: { login: string };
  enabledAt: string;
  mergeMethod: string;
}

export interface GitHubCheckRun {
  name: string;
  status: string;
  conclusion: string | null;
  detailsUrl?: string;
}

export interface GitHubStatusCheckRollup {
  state: string;
  contexts: {
    nodes: GitHubCheckRun[];
  };
}

// Timeline Event Types
export interface GitHubTimelineEvent {
  __typename: string;
  id?: string;
  body?: string;
  author?: { login: string };
  actor?: { login: string };
  createdAt?: string;
  submittedAt?: string;
  state?: string;
  label?: { name: string };
  mergeRefName?: string;
  requestedReviewer?: {
    login?: string;
    name?: string;
  };
}

// Full PR Response from GraphQL
export interface GitHubPRResponse {
  id: string;
  number: number;
  title: string;
  body: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  mergedAt: string | null;
  additions: number;
  deletions: number;
  changedFiles: number;
  isDraft: boolean;
  mergeable: string;

  baseRefName: string;
  headRefName: string;

  author: GitHubUser;
  mergedBy: GitHubUser | null;

  assignees: { nodes: GitHubUser[] };
  labels: { nodes: GitHubLabel[] };
  milestone: GitHubMilestone | null;

  reviewDecision: ReviewDecision;
  mergeStateStatus: MergeStateStatus;
  autoMergeRequest: GitHubAutoMergeRequest | null;

  files: { nodes: GitHubFile[] };
  commits: { nodes: { commit: GitHubCommit }[] };

  comments: {
    totalCount: number;
    nodes: GitHubComment[];
  };

  reviewThreads: {
    totalCount: number;
    nodes: GitHubReviewThread[];
  };

  reviews: {
    totalCount: number;
    nodes: GitHubReview[];
  };

  latestReviews?: {
    nodes: GitHubReview[];
  };

  reviewRequests?: {
    nodes: {
      requestedReviewer: {
        login?: string;
        name?: string;
        slug?: string;
      };
    }[];
  };

  closingIssuesReferences?: {
    nodes: {
      number: number;
      title: string;
      state: string;
    }[];
  };

  timelineItems?: {
    totalCount: number;
    nodes: GitHubTimelineEvent[];
  };
}

// ============================================
// Agent Detection & Parsing
// ============================================

export type AgentType =
  | 'copilot'
  | 'bito'
  | 'devin'
  | 'coderabbit'
  | 'greptile'
  | 'generic';

export interface ParsedComment {
  id: string;
  agent: AgentType;
  author: string;
  body: string;           // Normalized/cleaned body
  rawBody: string;        // Original body
  createdAt: string;
  type: 'comment' | 'review' | 'inline';

  // For inline comments
  file?: string;
  line?: number;
  endLine?: number;
  diffHunk?: string;

  // Extracted structured data
  issue?: string;         // Issue title (from Bito, etc.)
  suggestion?: string;    // Code suggestion
  fix?: string;           // Fix description
  citations?: string[];   // Referenced rules/docs

  // Thread info
  isResolved?: boolean;
  replyToId?: string;

  // Filtering
  isNoise?: boolean;
  noiseReason?: string;
}

// ============================================
// Output Structures
// ============================================

export interface PRConsensusOutput {
  meta: {
    version: string;
    generatedAt: string;
    prUrl: string;
    mode: DataMode;
    format: OutputFormat;
  };

  pr: {
    number: number;
    title: string;
    body: string;
    state: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    mergedAt: string | null;

    // Branch info
    baseRef: string;
    headRef: string;

    // Stats
    additions: number;
    deletions: number;
    changedFiles: number;

    // Status
    isDraft: boolean;
    reviewDecision: ReviewDecision;
    mergeState: MergeStateStatus;

    // Labels & assignees
    labels: string[];
    assignees: string[];
  };

  files: FileWithComments[];

  comments: {
    general: ParsedComment[];     // Non-file-specific
    byFile: Record<string, ParsedComment[]>;  // Grouped by file path
  };

  reviews: {
    summary: ReviewSummary[];
    byAuthor: Record<string, ParsedComment[]>;
  };

  ci?: {
    status: string;
    checks: {
      name: string;
      status: string;
      conclusion: string | null;
      url?: string;
    }[];
  };

  // Only included with --code or --full
  diff?: string;
}

export interface FileWithComments {
  path: string;
  additions: number;
  deletions: number;
  diff?: string;           // Only with --code or --full
  comments: ParsedComment[];
  commentCount: number;
}

export interface ReviewSummary {
  author: string;
  state: ReviewState;
  submittedAt: string;
  body: string;
  commentCount: number;
}

// ============================================
// Consensus Mode Structures
// ============================================

export interface ConsensusFileSection {
  path: string;
  folder: string;
  commentCount: number;
  lines: ConsensusLineGroup[];
}

export interface ConsensusLineGroup {
  startLine: number;
  endLine: number;
  diffHunk?: string;
  comments: ConsensusComment[];
}

export interface ConsensusComment {
  agent: AgentType;
  author: string;
  body: string;
  issue?: string;
  suggestion?: string;
  fix?: string;
}

export interface ConsensusOutput {
  pr: {
    number: number;
    title: string;
    state: string;
    author: string;
    reviewDecision: ReviewDecision;
    fileCount: number;
    commentCount: number;
  };

  summary: string[];          // Non-file comments aggregated

  fileReviews: ConsensusFileSection[];

  overallFeedback: {
    agent: AgentType;
    author: string;
    body: string;
  }[];
}

// ============================================
// Filter Configuration
// ============================================

export interface FilterConfig {
  patterns: RegExp[];
  authors: string[];          // Authors to always exclude
  minBodyLength: number;      // Minimum body length to include
}

export const DEFAULT_FILTER_CONFIG: FilterConfig = {
  patterns: [
    /^Bito is crafting review details/i,
    /^@\w+\s*$/,                         // Just @mentions with no content
    /^\/review\s*$/i,                    // Just /review commands
    /Review skipped/i,
    /Auto reviews are disabled/i,
    /^\s*$/,                             // Empty bodies
    /^<!-- .+ -->\s*$/,                  // Just HTML comments
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
