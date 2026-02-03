import type { ParsedPRUrl } from '../types/index.js';
/**
 * Fetch the full unified diff for a PR using gh CLI
 */
export declare function fetchDiff(pr: ParsedPRUrl): string;
/**
 * Fetch inline review comments with full diff hunks via REST API
 * This provides more detail than GraphQL for inline comments
 */
export interface RESTReviewComment {
    id: number;
    body: string;
    path: string;
    line: number | null;
    original_line: number | null;
    start_line: number | null;
    original_start_line: number | null;
    side: 'LEFT' | 'RIGHT';
    diff_hunk: string;
    commit_id: string;
    original_commit_id: string;
    in_reply_to_id?: number;
    user: {
        login: string;
        type: string;
    };
    created_at: string;
    updated_at: string;
    html_url: string;
}
export declare function fetchReviewComments(pr: ParsedPRUrl): RESTReviewComment[];
/**
 * Fetch issue comments (top-level PR comments) via REST API
 */
export interface RESTIssueComment {
    id: number;
    body: string;
    user: {
        login: string;
        type: string;
    };
    created_at: string;
    updated_at: string;
    html_url: string;
    reactions?: {
        total_count: number;
        '+1': number;
        '-1': number;
        laugh: number;
        confused: number;
        heart: number;
        hooray: number;
        rocket: number;
        eyes: number;
    };
}
export declare function fetchIssueComments(pr: ParsedPRUrl): RESTIssueComment[];
/**
 * Fetch file patches (individual file diffs)
 */
export interface RESTFilePatch {
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    raw_url: string;
    contents_url: string;
}
export declare function fetchFilesWithPatches(pr: ParsedPRUrl): RESTFilePatch[];
/**
 * Execute GraphQL query using gh CLI
 */
export declare function executeGraphQL<T>(query: string, variables: Record<string, unknown>): T;
/**
 * Check if gh CLI is authenticated
 * Uses a simple API call test instead of auth status (which can fail with multiple accounts)
 */
export declare function checkGhAuth(): boolean;
//# sourceMappingURL=diff.d.ts.map