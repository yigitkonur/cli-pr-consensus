// ============================================
// PR Consensus - REST API Client for Diffs
// ============================================
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
/**
 * Fetch the full unified diff for a PR using gh CLI
 */
export function fetchDiff(pr) {
    try {
        const result = execSync(`gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number} -H "Accept: application/vnd.github.v3.diff"`, {
            encoding: 'utf-8',
            maxBuffer: 50 * 1024 * 1024, // 50MB for large diffs
        });
        return result;
    }
    catch (error) {
        console.error('Failed to fetch diff:', error);
        return '';
    }
}
export function fetchReviewComments(pr) {
    try {
        const result = execSync(`gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number}/comments --paginate`, {
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024, // 10MB
        });
        return JSON.parse(result);
    }
    catch (error) {
        console.error('Failed to fetch review comments:', error);
        return [];
    }
}
export function fetchIssueComments(pr) {
    try {
        const result = execSync(`gh api repos/${pr.owner}/${pr.repo}/issues/${pr.number}/comments --paginate`, {
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024,
        });
        return JSON.parse(result);
    }
    catch (error) {
        console.error('Failed to fetch issue comments:', error);
        return [];
    }
}
export function fetchFilesWithPatches(pr) {
    try {
        const result = execSync(`gh api repos/${pr.owner}/${pr.repo}/pulls/${pr.number}/files --paginate`, {
            encoding: 'utf-8',
            maxBuffer: 50 * 1024 * 1024, // 50MB for large diffs
        });
        return JSON.parse(result);
    }
    catch (error) {
        console.error('Failed to fetch files with patches:', error);
        return [];
    }
}
/**
 * Execute GraphQL query using gh CLI
 */
export function executeGraphQL(query, variables) {
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
        const result = execSync(`gh api graphql -f query="${escapedQuery}" ${variableArgs}`, {
            encoding: 'utf-8',
            maxBuffer: 50 * 1024 * 1024,
            stdio: ['pipe', 'pipe', 'pipe'], // Suppress stderr warnings
        });
        const parsed = JSON.parse(result);
        if (parsed.errors) {
            console.error('GraphQL errors:', parsed.errors);
            throw new Error(parsed.errors[0]?.message || 'GraphQL query failed');
        }
        return parsed.data;
    }
    catch (error) {
        // Try alternative approach with file-based query
        return executeGraphQLWithFile(query, variables);
    }
}
/**
 * Alternative GraphQL execution using temp file for complex queries
 */
function executeGraphQLWithFile(query, variables) {
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
        const result = execSync(`gh api graphql -F query=@${queryFile} ${variableArgs}`, {
            encoding: 'utf-8',
            maxBuffer: 50 * 1024 * 1024,
        });
        const parsed = JSON.parse(result);
        if (parsed.errors) {
            throw new Error(parsed.errors[0]?.message || 'GraphQL query failed');
        }
        return parsed.data;
    }
    finally {
        // Cleanup temp file
        try {
            unlinkSync(queryFile);
        }
        catch {
            // Ignore cleanup errors
        }
    }
}
/**
 * Check if gh CLI is authenticated
 * Uses a simple API call test instead of auth status (which can fail with multiple accounts)
 */
export function checkGhAuth() {
    try {
        // Try a simple API call to verify authentication works
        execSync('gh api user --jq .login', { encoding: 'utf-8', stdio: 'pipe' });
        return true;
    }
    catch {
        // Fallback: check if auth token exists
        try {
            execSync('gh auth token', { encoding: 'utf-8', stdio: 'pipe' });
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=diff.js.map