#!/bin/bash
# gh-pr-complete.sh - Get complete PR data with ALL nested comments/threads
# Usage: ./gh-pr-complete.sh <PR_URL>
# Example: ./gh-pr-complete.sh https://github.com/owner/repo/pull/123

set -e

PR_INPUT="$1"

if [ -z "$PR_INPUT" ]; then
  echo "Usage: $0 <PR_URL or owner/repo/number>"
  echo "Example: $0 https://github.com/yigitkonur/tauri-meeting-transcriber/pull/1"
  echo "Example: $0 yigitkonur/tauri-meeting-transcriber/1"
  exit 1
fi

# Parse the PR URL or owner/repo/number format
if [[ "$PR_INPUT" =~ ^https://github.com/([^/]+)/([^/]+)/pull/([0-9]+) ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
  PR="${BASH_REMATCH[3]}"
elif [[ "$PR_INPUT" =~ ^([^/]+)/([^/]+)/([0-9]+)$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
  PR="${BASH_REMATCH[3]}"
else
  echo "Error: Invalid PR format. Use URL or owner/repo/number"
  exit 1
fi

echo "Fetching PR #$PR from $OWNER/$REPO..."

# GraphQL query with proper variable syntax
QUERY='
query($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      id
      number
      title
      body
      state
      createdAt
      updatedAt
      closedAt
      mergedAt
      additions
      deletions
      changedFiles
      isDraft
      mergeable

      baseRefName
      headRefName

      author {
        login
        ... on User { name email }
      }

      mergedBy {
        login
      }

      assignees(first: 10) {
        nodes { login }
      }

      labels(first: 20) {
        nodes { name color description }
      }

      milestone {
        title
        number
        state
      }

      files(first: 100) {
        nodes {
          path
          additions
          deletions
          changeType
        }
      }

      commits(first: 100) {
        nodes {
          commit {
            oid
            message
            messageHeadline
            author {
              name
              email
              date
            }
          }
        }
      }

      comments(first: 100) {
        totalCount
        nodes {
          id
          databaseId
          body
          author { login }
          createdAt
          updatedAt
          isMinimized
          minimizedReason

          reactions(first: 20) {
            nodes {
              content
              user { login }
            }
          }
        }
      }

      reviewThreads(first: 100) {
        totalCount
        nodes {
          id
          isResolved
          isOutdated
          isCollapsed
          path
          line

          comments(first: 100) {
            nodes {
              id
              databaseId
              body
              author { login }
              createdAt
              updatedAt
              path
              position
              originalPosition
              diffHunk
              outdated

              replyTo {
                id
                author { login }
              }

              reactions(first: 10) {
                nodes {
                  content
                  user { login }
                }
              }
            }
          }
        }
      }

      reviews(first: 100) {
        totalCount
        nodes {
          id
          databaseId
          body
          state
          author { login }
          submittedAt

          comments(first: 100) {
            nodes {
              id
              body
              path
              position
              originalPosition
              diffHunk
              author { login }
              createdAt
            }
          }
        }
      }

      reviewRequests(first: 20) {
        nodes {
          requestedReviewer {
            ... on User { login }
            ... on Team { name slug }
          }
        }
      }

      latestReviews(first: 20) {
        nodes {
          author { login }
          state
          submittedAt
          body
        }
      }

      closingIssuesReferences(first: 20) {
        nodes {
          number
          title
          state
        }
      }

      timelineItems(first: 100, itemTypes: [ISSUE_COMMENT, PULL_REQUEST_REVIEW, PULL_REQUEST_REVIEW_THREAD, REVIEW_REQUESTED_EVENT, MERGED_EVENT, CLOSED_EVENT, REOPENED_EVENT, LABELED_EVENT, UNLABELED_EVENT]) {
        totalCount
        nodes {
          __typename
          ... on IssueComment {
            id
            body
            author { login }
            createdAt
          }
          ... on PullRequestReview {
            id
            body
            state
            author { login }
            submittedAt
          }
          ... on MergedEvent {
            actor { login }
            createdAt
            mergeRefName
          }
          ... on ClosedEvent {
            actor { login }
            createdAt
          }
          ... on ReopenedEvent {
            actor { login }
            createdAt
          }
          ... on LabeledEvent {
            actor { login }
            createdAt
            label { name }
          }
          ... on ReviewRequestedEvent {
            actor { login }
            createdAt
            requestedReviewer {
              ... on User { login }
              ... on Team { name }
            }
          }
        }
      }
    }
  }
}
'

# Execute the GraphQL query with proper variable passing
OUTPUT_FILE="pr-${OWNER}-${REPO}-${PR}.json"

gh api graphql \
  -F owner="$OWNER" \
  -F repo="$REPO" \
  -F pr="$PR" \
  -f query="$QUERY" | jq '.data.repository.pullRequest' > "$OUTPUT_FILE"

if [ -s "$OUTPUT_FILE" ] && [ "$(cat "$OUTPUT_FILE")" != "null" ]; then
  echo "✅ Complete PR data saved to: $OUTPUT_FILE"
  echo ""
  echo "Summary:"
  jq -r '"  Title: \(.title)"' "$OUTPUT_FILE"
  jq -r '"  State: \(.state)"' "$OUTPUT_FILE"
  jq -r '"  Comments: \(.comments.totalCount)"' "$OUTPUT_FILE"
  jq -r '"  Review Threads: \(.reviewThreads.totalCount)"' "$OUTPUT_FILE"
  jq -r '"  Reviews: \(.reviews.totalCount)"' "$OUTPUT_FILE"
else
  echo "❌ Error: Failed to fetch PR data"
  cat "$OUTPUT_FILE"
  exit 1
fi
