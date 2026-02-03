// ============================================
// PR Consensus - REST API Client for Diffs
// ============================================

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { ParsedPRUrl } from '../types/index.js';

/**
 * Fetch the full unified diff for a PR using gh CLI
 */
export function fetchDiff(pr: ParsedPRUrl): string {
  try {
    const result = execSync(
      `gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number} -H "Accept: application/vnd.github.v3.diff"`,
      {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024, // 50MB for large diffs
      }
    );
    return result;
  } catch (error) {
    console.error('Failed to fetch diff:', error);
    return '';
  }
}

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

export function fetchReviewComments(pr: ParsedPRUrl): RESTReviewComment[] {
  try {
    const result = execSync(
      `gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number}/comments --paginate`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB
      }
    );
    return JSON.parse(result) as RESTReviewComment[];
  } catch (error) {
    console.error('Failed to fetch review comments:', error);
    return [];
  }
}

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

export function fetchIssueComments(pr: ParsedPRUrl): RESTIssueComment[] {
  try {
    const result = execSync(
      `gh api repos/${pr.owner}/${pr.repo}/issues/${pr.number}/comments --paginate`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
      }
    );
    return JSON.parse(result) as RESTIssueComment[];
  } catch (error) {
    console.error('Failed to fetch issue comments:', error);
    return [];
  }
}

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

export function fetchFilesWithPatches(pr: ParsedPRUrl): RESTFilePatch[] {
  try {
    const result = execSync(
      `gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number}/files --paginate`,
      {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024, // 50MB for large diffs
      }
    );
    return JSON.parse(result) as RESTFilePatch[];
  } catch (error) {
    console.error('Failed to fetch files with patches:', error);
    return [];
  }
}

/**
 * Execute GraphQL query using gh CLI
 */
export function executeGraphQL<T>(query: string, variables: Record<string, unknown>): T {
  try {
    // Build the gh api graphql command
    const variableArgs = Object.entries(variables)
      .map(([key, value]) => {
        if (typeof value === 'number') {
          return `-F ${key}=${value}`;
        }
        return `-F ${key}="${value}"`;
      })
      .join(' ');

    // Escape the query for shell
    const escapedQuery = query.replace(/"/g, '\\"').replace(/\n/g, ' ');

    const result = execSync(
      `gh api graphql -f query="${escapedQuery}" ${variableArgs}`,
      {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
        stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr warnings
      }
    );

    const parsed = JSON.parse(result);

    if (parsed.errors) {
      console.error('GraphQL errors:', parsed.errors);
      throw new Error(parsed.errors[0]?.message || 'GraphQL query failed');
    }

    return parsed.data as T;
  } catch (error) {
    // Try alternative approach with file-based query
    return executeGraphQLWithFile<T>(query, variables);
  }
}

/**
 * Alternative GraphQL execution using temp file for complex queries
 */
function executeGraphQLWithFile<T>(query: string, variables: Record<string, unknown>): T {
  const queryFile = join(tmpdir(), `pr-consensus-query-${Date.now()}.graphql`);

  try {
    // Write query to temp file
    writeFileSync(queryFile, query);

    // Build variable args
    const variableArgs = Object.entries(variables)
      .map(([key, value]) => {
        if (typeof value === 'number') {
          return `-F ${key}=${value}`;
        }
        return `-F ${key}=${value}`;
      })
      .join(' ');

    const result = execSync(
      `gh api graphql -F query=@${queryFile} ${variableArgs}`,
      {
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024,
      }
    );

    const parsed = JSON.parse(result);

    if (parsed.errors) {
      throw new Error(parsed.errors[0]?.message || 'GraphQL query failed');
    }

    return parsed.data as T;
  } finally {
    // Cleanup temp file
    try {
      unlinkSync(queryFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Check if gh CLI is authenticated
 * Uses a simple API call test instead of auth status (which can fail with multiple accounts)
 */
export function checkGhAuth(): boolean {
  try {
    // Try a simple API call to verify authentication works
    execSync('gh api user --jq .login', { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    // Fallback: check if auth token exists
    try {
      execSync('gh auth token', { encoding: 'utf-8', stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }
}
