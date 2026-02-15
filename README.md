# cli-prconsensus

> get consensus from all your AI code reviewers in one place

```bash
npx cli-prconsensus https://github.com/owner/repo/pull/123
```

---

## the problem

so here's the thing. i use multiple AI code review tools on my PRs - Copilot, Bito, Devin, CodeRabbit, you name it. each one catches different stuff. one might spot a security issue another misses. one is better at suggesting cleaner abstractions. they complement each other.

but then i realized something annoying. when i want to actually *use* all this feedback - maybe paste it into Claude Code or another LLM to help me fix things - i'm manually copy-pasting comments one by one. and the data is all over the place.

here's the real problem though: **scattered context is terrible for LLMs**.

let's say Copilot comments on line 27 of `Button.tsx`, and Bito comments on line 45 of the same file, but they're comment #2 and comment #47 in the thread. when you feed this to an LLM, the attention mechanism has to work way harder to connect related information. if you understand how transformers work, you know that keeping related context close together makes a huge difference.

that's why i built this. it collects all PR feedback and reorganizes it by file and line number. all comments about `Button.tsx` are together. all feedback about lines 40-50 is grouped. the LLM can actually *see* the full picture.

## why this matters

this isn't just about catching bugs before production (though it does that).

i run two different AI review subscriptions. before any code hits production, multiple perspectives have looked at it. but it's not just "find security holes" - these tools can enforce:

- are we using existing abstractions correctly?
- does this follow our clean code standards?
- is there unnecessary complexity?
- are we being consistent with the rest of the codebase?

people think AI code review is just for catching obvious bugs. it's not. it's about maintaining quality at scale. but you need to actually *use* the feedback efficiently, and that's where the tooling was broken.

---

## install

```bash
# just run it (no install needed)
npx cli-prconsensus <github-pr-url>

# or install globally
pnpm add -g cli-prconsensus

# then use either command
pr-consensus <url>
prc <url>  # short alias
```

**requires**: [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`)

---

## usage

```bash
# basic - get all comments as JSON
prc https://github.com/facebook/react/pull/28000

# consensus mode - grouped by file, optimized for LLMs
prc <url> --format consensus

# get the diffs too
prc <url> --full

# different formats
prc <url> --format json       # structured data
prc <url> --format yaml       # readable, grouped by folder
prc <url> --format md         # markdown
prc <url> --format consensus  # the good stuff

# save to file
prc <url> --format consensus -o review.md

# pipe to clipboard (macOS)
prc <url> --format consensus | pbcopy
```

### quick copy-paste examples

```bash
# get consensus view, copy to clipboard, paste into Claude
npx cli-prconsensus https://github.com/owner/repo/pull/123 --format consensus | pbcopy

# save full review with diffs for later
npx cli-prconsensus https://github.com/owner/repo/pull/123 --full -o pr-review.json

# quiet mode for scripting
npx cli-prconsensus <url> -q --format json > data.json
```

---

## what it does

### collects everything

- PR metadata (title, author, status, labels)
- all comments (top-level and inline)
- all review threads with replies
- review decisions (approved, changes requested)
- file diffs (optional)

### detects AI agents

automatically identifies and normalizes output from:

| agent | what we extract |
|-------|-----------------|
| Copilot | code suggestions, review summaries |
| Bito | issue/fix pairs, severity, citations |
| Devin | metadata, dashboard links |
| CodeRabbit | actionable items, summaries |
| Greptile | analysis, recommendations |

### filters noise

removes the annoying stuff:
- "Bito is crafting review details..."
- empty bodies
- status updates that aren't actual feedback

### reorganizes for LLMs

the consensus format groups everything by file:

```markdown
## src/components/Button.tsx (4 comments)

### lines 42-48
[diff snippet]

**@copilot**: consider memoizing this callback

**@bito**: same issue - this will cause unnecessary re-renders
> suggestion: wrap in useCallback

### line 89
[diff snippet]

**@devin**: missing error boundary for async operation
```

all feedback about the same code is together. the LLM doesn't have to hunt through a 50-comment thread to find related information.

---

## options

| flag | what it does |
|------|--------------|
| `--format <type>` | output format: `json`, `yaml`, `md`, `consensus` |
| `--code` | diffs only, no comments |
| `--full` | everything - comments + diffs |
| `-o, --output <file>` | write to file |
| `--no-filter` | keep noise comments |
| `-v, --verbose` | show progress |
| `-q, --quiet` | suppress status messages |

---

## example output

### consensus format

```markdown
# PR #142: feat: add user authentication

> status: CHANGES_REQUESTED | author: @yigitkonur | files: 12 | comments: 23

## summary

**@copilot** (COMMENTED): overall solid implementation, but auth token
handling needs attention...

**@bito** (CHANGES_REQUESTED): found 3 security issues...

---

## file reviews

### src/auth/login.ts (5 comments)

#### lines 23-31

```diff
+ const token = generateToken(user);
+ localStorage.setItem('auth', token);
```

**@copilot** [copilot]:
> storing tokens in localStorage is vulnerable to XSS. consider httpOnly cookies.

**@bito** [bito]:
> **issue**: XSS vulnerability
> **fix**: use secure cookie storage with httpOnly flag

**@devin** [devin]:
> same concern flagged. see OWASP guidelines for token storage.

---

### src/auth/middleware.ts (2 comments)

#### line 67

**@coderabbit** [coderabbit]:
> missing rate limiting on auth endpoints. consider adding express-rate-limit.
```

three different tools, same concern, all in one place. now you can actually address it properly.

---

## workflow

here's how i use this:

1. open PR, let all the AI reviewers do their thing
2. run `prc <url> --format consensus | pbcopy`
3. paste into Claude Code: "here's the feedback on my PR, help me address these issues"
4. Claude can see everything organized by file, makes targeted fixes
5. push, repeat if needed

the key insight: **multiple AI reviewers catch more issues than one, but only if you can actually process their combined feedback efficiently**.

---

## development

want to add support for a new AI review tool? see [DEVELOPMENT.md](./DEVELOPMENT.md) for:
- architecture overview
- how to add new agent parsers
- parser design guidelines

---

## license

MIT

---

*built because copy-pasting 47 comments from 5 different bots is not a workflow*
