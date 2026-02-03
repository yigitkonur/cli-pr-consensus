# PR Consensus - Developer Guide

This guide is for developers maintaining or extending pr-consensus, especially those adding new AI agent parsers.

---

## Architecture Overview

```
pr-consensus/
├── src/
│   ├── index.ts              # CLI entry point (Commander.js)
│   ├── collector.ts          # Orchestrates data collection & processing
│   ├── graphql/
│   │   └── queries.ts        # GraphQL queries for GitHub API
│   ├── rest/
│   │   └── diff.ts           # REST API client + gh CLI wrapper
│   ├── parsers/
│   │   ├── index.ts          # Agent detection & routing
│   │   ├── copilot.ts        # GitHub Copilot parser
│   │   ├── bito.ts           # Bito parser
│   │   ├── devin.ts          # Devin AI parser
│   │   ├── coderabbit.ts     # CodeRabbit parser
│   │   └── generic.ts        # Fallback parser
│   ├── filters/
│   │   ├── noise.ts          # Noise filtering logic
│   │   └── defaults.ts       # Default filter patterns
│   ├── formatters/
│   │   ├── json.ts           # JSON output
│   │   ├── yaml.ts           # LLM-optimized YAML
│   │   ├── markdown.ts       # Markdown with Go templates
│   │   └── consensus.ts      # File-grouped consensus view
│   └── types/
│       └── index.ts          # All TypeScript interfaces
```

---

## Data Flow

```
1. CLI (index.ts)
   ↓
2. Collector (collector.ts)
   ├── GraphQL API → PR metadata, comments, reviews, threads
   ├── REST API → Diffs, file patches, enriched comments
   ↓
3. Parser Pipeline (parsers/)
   ├── Detect agent by username pattern
   ├── Route to specific parser (copilot, bito, devin, etc.)
   ├── Extract structured data (issue, fix, suggestion)
   ↓
4. Noise Filter (filters/)
   ├── Remove bot noise ("Bito is crafting...", empty bodies)
   ├── Apply user-defined patterns (.pr-consensus-ignore)
   ↓
5. Formatter (formatters/)
   ├── JSON, YAML, Markdown, or Consensus
   ↓
6. Output (stdout or file)
```

---

## Understanding Agent Parsers

### What is an Agent?

An "agent" is an AI code review bot that comments on PRs. Each agent has:
- A **username pattern** (e.g., `copilot-pull-request-reviewer`, `bito-code-review`)
- A **comment format** (plain text, HTML, JSON metadata, etc.)
- **Structured data** we want to extract (issues, fixes, suggestions)

### Current Agents

| Agent | Username Pattern | Format | Key Extraction |
|-------|------------------|--------|----------------|
| **Copilot** | `copilot`, `copilot-*` | Markdown with ```suggestion blocks | Code suggestions |
| **Bito** | `bito-*` | HTML divs (`id="issue"`, `id="fix"`) | Issue title, fix description, citations |
| **Devin** | `devin-*` | HTML comments with JSON | Metadata, links |
| **CodeRabbit** | `coderabbitai` | Markdown with callout blocks | Actionable items |
| **Greptile** | `greptile*` | Plain markdown | Direct use |
| **Generic** | (fallback) | Any | Minimal cleanup |

---

## How to Add a New Agent

### Step 1: Analyze the Agent's Comment Format

Before writing code, collect 5-10 example comments from the agent. Look for:

1. **Username pattern**: What login names does it use?
2. **Comment structure**: Is it plain text, HTML, JSON, or mixed?
3. **Extractable data**: What structured info can we pull out?
   - Issue/problem title
   - Fix/solution description
   - Code suggestions
   - Severity levels
   - Links to external tools

**Example analysis for a hypothetical "ReviewBot":**
```markdown
<!-- reviewbot-meta: {"severity": "high", "category": "security"} -->
## Security Issue

**Problem**: SQL injection vulnerability in user input handling.

**Recommendation**:
```suggestion
const query = db.prepare('SELECT * FROM users WHERE id = ?').bind(userId);
```

**Learn more**: [OWASP SQL Injection](https://owasp.org/...)
```

From this, we can extract:
- Severity from JSON metadata
- Issue title from ## heading
- Suggestion from code block
- External links

### Step 2: Add the Agent Type

Edit `src/types/index.ts`:

```typescript
export type AgentType =
  | 'copilot'
  | 'bito'
  | 'devin'
  | 'coderabbit'
  | 'greptile'
  | 'reviewbot'  // Add new agent
  | 'generic';
```

### Step 3: Add Detection Pattern

Edit `src/parsers/index.ts`:

```typescript
const AGENT_PATTERNS: Record<AgentType, RegExp[]> = {
  // ... existing patterns ...

  // Add patterns for the new agent
  // Be specific to avoid false positives
  reviewbot: [
    /^reviewbot$/i,           // Exact match
    /^reviewbot-/i,           // Prefix match (reviewbot-app, reviewbot-pro)
    /review-bot-integration/i // Known integration name
  ],

  generic: [], // Always last - fallback
};
```

**Pattern Design Guidelines:**
- Use case-insensitive patterns (`/i` flag)
- Start with exact match, then prefix patterns
- Check GitHub for the actual bot account names
- Avoid overly broad patterns that match human users

### Step 4: Create the Parser

Create `src/parsers/reviewbot.ts`:

```typescript
// ============================================
// PR Consensus - ReviewBot Parser
// ============================================
// Parses comments from ReviewBot AI code reviewer
// Format: HTML comments with JSON metadata + Markdown body

import type { AgentParseResult } from '../types/index.js';

/**
 * Parse ReviewBot comment format
 *
 * Example input:
 * <!-- reviewbot-meta: {"severity": "high", "category": "security"} -->
 * ## Security Issue
 * **Problem**: SQL injection...
 * ```suggestion
 * fixed code here
 * ```
 */
export function parseReviewBotComment(body: string): AgentParseResult {
  let cleanBody = body;
  let issue: string | undefined;
  let fix: string | undefined;
  let suggestion: string | undefined;
  const metadata: Record<string, unknown> = {};

  // 1. Extract JSON metadata from HTML comments
  const metaMatch = body.match(/<!--\s*reviewbot-meta:\s*(\{[^}]+\})\s*-->/);
  if (metaMatch) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      Object.assign(metadata, parsed);
    } catch {
      // Invalid JSON, ignore
    }
    cleanBody = cleanBody.replace(metaMatch[0], '').trim();
  }

  // 2. Extract issue title from ## heading
  const issueMatch = cleanBody.match(/^##\s+(.+?)$/m);
  if (issueMatch) {
    issue = issueMatch[1].trim();
  }

  // 3. Extract problem description
  const problemMatch = cleanBody.match(/\*\*Problem\*\*:\s*(.+?)(?=\n\n|\*\*|$)/s);
  if (problemMatch) {
    fix = problemMatch[1].trim();
  }

  // 4. Extract code suggestion
  const suggestionMatch = cleanBody.match(/```suggestion\n([\s\S]*?)```/);
  if (suggestionMatch) {
    suggestion = suggestionMatch[1].trim();
    // Remove suggestion block from body to avoid duplication
    cleanBody = cleanBody.replace(suggestionMatch[0], '[See suggestion below]');
  }

  // 5. Clean up the body
  cleanBody = cleanBody
    .replace(/<!--[\s\S]*?-->/g, '')  // Remove HTML comments
    .replace(/\n{3,}/g, '\n\n')       // Collapse multiple newlines
    .trim();

  return {
    body: cleanBody,
    issue,
    fix,
    suggestion,
    metadata,
  };
}
```

### Step 5: Register the Parser

Edit `src/parsers/index.ts` to import and route to your parser:

```typescript
import { parseReviewBotComment } from './reviewbot.js';

// In the parseComment function, add the case:
export function parseComment(/* ... */): ParsedComment {
  // ... existing code ...

  // Parse based on agent type
  let parseResult: AgentParseResult;

  switch (agent) {
    case 'copilot':
      parseResult = parseCopilotComment(rawBody);
      break;
    case 'bito':
      parseResult = parseBitoComment(rawBody);
      break;
    case 'devin':
      parseResult = parseDevinComment(rawBody);
      break;
    case 'coderabbit':
      parseResult = parseCodeRabbitComment(rawBody);
      break;
    case 'reviewbot':  // Add new case
      parseResult = parseReviewBotComment(rawBody);
      break;
    default:
      parseResult = parseGenericComment(rawBody);
  }

  // ... rest of function ...
}
```

### Step 6: Add Noise Patterns (if needed)

If the agent produces noisy comments (status updates, "processing...", etc.), add patterns to `src/filters/defaults.ts`:

```typescript
export const DEFAULT_NOISE_PATTERNS: RegExp[] = [
  // ... existing patterns ...

  // ReviewBot noise
  /^ReviewBot is analyzing/i,
  /^Analysis in progress/i,
  /^No issues found\.?\s*$/i,
];
```

### Step 7: Test Your Parser

1. Find a real PR with the agent's comments
2. Run the CLI and check the output:

```bash
npm run dev -- https://github.com/owner/repo/pull/123 --format json -v

# Check specific fields in output:
npm run dev -- <url> --format json | jq '.comments.byFile | to_entries[] | .value[] | select(.agent == "reviewbot")'
```

3. Verify:
   - Agent is correctly detected
   - Issue/fix/suggestion are extracted
   - Body is cleaned up
   - Noise comments are filtered

---

## Parser Design Principles

### 1. Be Conservative with Extraction

Only extract fields you're confident about. It's better to leave data in the body than to extract garbage:

```typescript
// Good: Only extract if pattern clearly matches
const issueMatch = body.match(/^##\s+(?:Issue|Problem|Bug):\s*(.+)$/m);
if (issueMatch) {
  issue = issueMatch[1];
}

// Bad: Overly greedy pattern that might grab wrong content
const issueMatch = body.match(/##\s+(.+)/);  // Too broad!
```

### 2. Preserve Original Content

Always keep the original body accessible. Some users want raw data:

```typescript
return {
  body: cleanedBody,      // Processed version
  rawBody: originalBody,  // Keep original for reference (if different)
  // ...
};
```

### 3. Handle Malformed Input Gracefully

Agents update their formats. Don't crash on unexpected input:

```typescript
// Good: Defensive parsing
try {
  const meta = JSON.parse(metaMatch[1]);
  metadata.severity = meta.severity;
} catch {
  // JSON parsing failed, continue without metadata
}

// Bad: Assumes structure exists
const meta = JSON.parse(metaMatch[1]);
metadata.severity = meta.severity;  // Crashes if meta is malformed
```

### 4. Document the Expected Format

Add comments showing example input so future developers understand what you're parsing:

```typescript
/**
 * Parse Bito comment format
 *
 * Example input:
 * <div id="issue">SQL Injection Risk</div>
 * <div id="description">User input is not sanitized...</div>
 * <div id="fix">Use parameterized queries</div>
 * <div id="code">
 * ```suggestion
 * db.query('SELECT * FROM users WHERE id = ?', [userId])
 * ```
 * </div>
 */
```

### 5. Test with Edge Cases

Consider these scenarios:
- Empty body
- Body with only whitespace
- Partial format (e.g., issue but no fix)
- Multiple issues in one comment
- Nested formatting (code blocks inside suggestions)
- Unicode/emoji content
- Very long comments (>10KB)

---

## Key Files Reference

| File | Purpose | When to Modify |
|------|---------|----------------|
| `src/types/index.ts` | All TypeScript interfaces | Adding new agent type, new parsed fields |
| `src/parsers/index.ts` | Agent detection & routing | Adding detection patterns, new parser imports |
| `src/parsers/*.ts` | Individual agent parsers | Agent-specific parsing logic |
| `src/filters/defaults.ts` | Noise patterns | Agent-specific noise patterns |
| `src/collector.ts` | Data orchestration | Changing how data flows through pipeline |
| `src/formatters/*.ts` | Output formatting | Adding new output formats, changing structure |

---

## Common Issues & Solutions

### "Agent not detected, falling back to generic"

1. Check the username exactly matches your pattern
2. Ensure pattern is case-insensitive if needed
3. Add debug logging: `console.error('Checking:', author, 'against', pattern)`

### "Suggestion not extracted"

1. Verify the code fence format: ` ```suggestion ` (not `~~~` or other variants)
2. Check for leading/trailing whitespace in the fence
3. Some agents use ```` ```diff ```` instead of ```` ```suggestion ````

### "JSON metadata parsing fails"

1. Check for single quotes vs double quotes (JSON requires double)
2. Look for trailing commas (invalid in JSON)
3. Check for unescaped special characters

### "Comments appear duplicated"

The collector merges GraphQL and REST data. If you see duplicates:
1. Check if the same comment is in both `comments.nodes` and `reviewThreads.nodes`
2. The REST enrichment in `processComments()` might be matching incorrectly

---

## Testing Checklist for New Agents

- [ ] Agent username patterns added to `AGENT_PATTERNS`
- [ ] Parser file created with clear documentation
- [ ] Parser registered in `parseComment()` switch statement
- [ ] Noise patterns added (if applicable)
- [ ] Tested with real PR containing agent comments
- [ ] All 4 output formats show correct data (json, yaml, md, consensus)
- [ ] Edge cases handled (empty body, malformed input)
- [ ] No TypeScript errors (`npm run build`)

---

## Getting Help

1. Check existing parsers for patterns - `bito.ts` is the most complex example
2. Use `--verbose` flag to see debug output
3. Dump raw GraphQL response: add `console.log(JSON.stringify(prData, null, 2))` in collector.ts

---

*Last updated: February 2026*
