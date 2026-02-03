// ============================================
// PR Consensus - Data Collector
// ============================================

import type {
  CLIOptions,
  ParsedPRUrl,
  DataMode,
  PRConsensusOutput,
  GitHubPRResponse,
  ParsedComment,
  FileWithComments,
  ReviewSummary,
} from './types/index.js';

import { PR_COMPLETE_QUERY, PR_FILES_ONLY_QUERY } from './graphql/queries.js';
import {
  executeGraphQL,
  fetchDiff,
  fetchReviewComments,
  fetchFilesWithPatches,
  checkGhAuth,
} from './rest/diff.js';
import { parseComment, detectAgentType } from './parsers/index.js';
import { loadFilterConfig, filterNoiseComments, getNoiseStats } from './filters/noise.js';

const VERSION = '1.0.0';

/**
 * Parse PR URL to extract owner, repo, and PR number
 */
export function parsePRUrl(input: string): ParsedPRUrl {
  // Full GitHub URL
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      number: parseInt(urlMatch[3], 10),
    };
  }

  // owner/repo/number format
  const shortMatch = input.match(/^([^/]+)\/([^/]+)\/(\d+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      number: parseInt(shortMatch[3], 10),
    };
  }

  throw new Error(
    `Invalid PR URL format. Expected: https://github.com/owner/repo/pull/123 or owner/repo/123`
  );
}

/**
 * Determine data mode from CLI options
 */
export function getDataMode(options: CLIOptions): DataMode {
  if (options.full) return 'full';
  if (options.code) return 'code';
  return 'normal';
}

/**
 * Main collector function
 */
export async function collectPRData(
  prUrl: string,
  options: CLIOptions
): Promise<PRConsensusOutput> {
  // Check gh CLI auth
  if (!checkGhAuth()) {
    throw new Error(
      'GitHub CLI not authenticated. Run `gh auth login` first.'
    );
  }

  const pr = parsePRUrl(prUrl);
  const mode = getDataMode(options);
  const filterConfig = options.noFilter ? null : loadFilterConfig(options.filterFile);

  // Fetch PR data via GraphQL
  const query = mode === 'code' ? PR_FILES_ONLY_QUERY : PR_COMPLETE_QUERY;
  const graphqlResponse = executeGraphQL<{ repository: { pullRequest: GitHubPRResponse } }>(
    query,
    { owner: pr.owner, repo: pr.repo, pr: pr.number }
  );

  const prData = graphqlResponse.repository.pullRequest;

  // Fetch additional data via REST API
  const restComments = mode !== 'code' ? fetchReviewComments(pr) : [];
  const filesWithPatches = (mode === 'code' || mode === 'full')
    ? fetchFilesWithPatches(pr)
    : [];

  // Fetch full diff if needed
  const fullDiff = (mode === 'code' || mode === 'full' || options.includeDiff)
    ? fetchDiff(pr)
    : undefined;

  // Process comments (skip in code-only mode)
  let filteredComments: ParsedComment[] = [];

  if (mode !== 'code') {
    const allComments = processComments(prData, restComments);

    // Apply filtering
    filteredComments = filterConfig
      ? filterNoiseComments(allComments, filterConfig)
      : allComments;

    // Log noise stats if verbose
    if (options.verbose && filterConfig) {
      const stats = getNoiseStats(allComments);
      console.error(`Filtered ${stats.noise} noise comments out of ${stats.total}`);
    }
  }

  // Build output structure
  const output = buildOutput(prData, filteredComments, filesWithPatches, fullDiff, mode, prUrl);

  return output;
}

/**
 * Process all comments from GraphQL and REST responses
 */
function processComments(
  prData: GitHubPRResponse,
  restComments: ReturnType<typeof fetchReviewComments>
): ParsedComment[] {
  const comments: ParsedComment[] = [];

  // Process top-level comments
  for (const comment of prData.comments.nodes) {
    comments.push(
      parseComment(
        comment.id,
        comment.author.login,
        comment.body,
        comment.createdAt,
        'comment'
      )
    );
  }

  // Process review bodies
  for (const review of prData.reviews.nodes) {
    if (review.body && review.body.trim()) {
      comments.push(
        parseComment(
          review.id,
          review.author.login,
          review.body,
          review.submittedAt,
          'review'
        )
      );
    }
  }

  // Process review threads (inline comments)
  for (const thread of prData.reviewThreads.nodes) {
    for (const comment of thread.comments.nodes) {
      comments.push(
        parseComment(
          comment.id,
          comment.author.login,
          comment.body,
          comment.createdAt,
          'inline',
          {
            file: thread.path || comment.path,
            line: thread.line || comment.position,
            diffHunk: comment.diffHunk,
            isResolved: thread.isResolved,
            replyToId: comment.replyTo?.id,
          }
        )
      );
    }
  }

  // Merge REST comments (they have more detail)
  // Use REST comment data to enrich existing inline comments
  const restCommentMap = new Map(
    restComments.map(c => [c.id.toString(), c])
  );

  for (const comment of comments) {
    if (comment.type === 'inline') {
      // Try to find matching REST comment by body similarity
      for (const restComment of restComments) {
        if (restComment.body === comment.rawBody) {
          // Enrich with REST data
          if (restComment.line) comment.line = restComment.line;
          if (restComment.start_line) comment.line = restComment.start_line;
          if (restComment.diff_hunk && !comment.diffHunk) {
            comment.diffHunk = restComment.diff_hunk;
          }
          break;
        }
      }
    }
  }

  return comments;
}

/**
 * Build final output structure
 */
function buildOutput(
  prData: GitHubPRResponse,
  comments: ParsedComment[],
  filesWithPatches: ReturnType<typeof fetchFilesWithPatches>,
  fullDiff: string | undefined,
  mode: DataMode,
  prUrl: string
): PRConsensusOutput {
  // Group comments by file
  const commentsByFile: Record<string, ParsedComment[]> = {};
  const generalComments: ParsedComment[] = [];

  for (const comment of comments) {
    if (comment.file) {
      if (!commentsByFile[comment.file]) {
        commentsByFile[comment.file] = [];
      }
      commentsByFile[comment.file].push(comment);
    } else {
      generalComments.push(comment);
    }
  }

  // Build files array with comments and patches
  const files: FileWithComments[] = prData.files.nodes.map(file => {
    const patch = filesWithPatches.find(f => f.filename === file.path);
    const fileComments = commentsByFile[file.path] || [];

    return {
      path: file.path,
      additions: file.additions,
      deletions: file.deletions,
      diff: (mode === 'code' || mode === 'full') ? patch?.patch : undefined,
      comments: fileComments,
      commentCount: fileComments.length,
    };
  });

  // Build reviews summary (empty in code-only mode)
  const reviewsSummary: ReviewSummary[] = (prData.reviews?.nodes || [])
    .filter(r => r.state !== 'PENDING')
    .map(r => ({
      author: r.author.login,
      state: r.state,
      submittedAt: r.submittedAt,
      body: r.body || '',
      commentCount: r.comments?.nodes.length || 0,
    }));

  // Group reviews by author
  const reviewsByAuthor: Record<string, ParsedComment[]> = {};
  for (const comment of comments) {
    if (comment.type === 'review' || comment.type === 'inline') {
      if (!reviewsByAuthor[comment.author]) {
        reviewsByAuthor[comment.author] = [];
      }
      reviewsByAuthor[comment.author].push(comment);
    }
  }

  return {
    meta: {
      version: VERSION,
      generatedAt: new Date().toISOString(),
      prUrl,
      mode,
      format: 'json', // Will be updated by formatter
    },

    pr: {
      number: prData.number,
      title: prData.title,
      body: prData.body || '',
      state: prData.state,
      author: prData.author.login,
      createdAt: prData.createdAt || '',
      updatedAt: prData.updatedAt || '',
      mergedAt: prData.mergedAt || null,

      baseRef: prData.baseRefName,
      headRef: prData.headRefName,

      additions: prData.additions,
      deletions: prData.deletions,
      changedFiles: prData.changedFiles,

      isDraft: prData.isDraft || false,
      reviewDecision: prData.reviewDecision || null,
      mergeState: prData.mergeStateStatus || null,

      labels: (prData.labels?.nodes || []).map(l => l.name),
      assignees: (prData.assignees?.nodes || []).map(a => a.login),
    },

    files,

    comments: {
      general: generalComments,
      byFile: commentsByFile,
    },

    reviews: {
      summary: reviewsSummary,
      byAuthor: reviewsByAuthor,
    },

    diff: fullDiff,
  };
}
