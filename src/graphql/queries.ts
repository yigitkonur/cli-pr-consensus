// ============================================
// PR Consensus - GraphQL Queries
// ============================================

export const PR_COMPLETE_QUERY = `
query PRComplete($owner: String!, $repo: String!, $pr: Int!) {
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

      assignees(first: 20) {
        nodes { login }
      }

      labels(first: 30) {
        nodes { name color description }
      }

      milestone {
        title
        number
        state
      }

      reviewDecision
      mergeStateStatus

      autoMergeRequest {
        enabledBy { login }
        enabledAt
        mergeMethod
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

      latestReviews(first: 20) {
        nodes {
          author { login }
          state
          submittedAt
          body
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

      closingIssuesReferences(first: 20) {
        nodes {
          number
          title
          state
        }
      }
    }
  }
}
`;

// Simplified query for code-only mode (just files, no comments)
export const PR_FILES_ONLY_QUERY = `
query PRFilesOnly($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      id
      number
      title
      state
      additions
      deletions
      changedFiles

      baseRefName
      headRefName

      author { login }

      files(first: 100) {
        nodes {
          path
          additions
          deletions
          changeType
        }
      }
    }
  }
}
`;
