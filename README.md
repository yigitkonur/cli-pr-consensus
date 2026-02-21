fetches every AI code review comment from a GitHub PR — Copilot, CodeRabbit, Bito, Devin, Greptile — normalizes them out of their proprietary HTML/markdown/JSON formats, filters noise, and renders one unified document you can feed straight into an LLM prompt.

```bash
npx cli-pr-consensus https://github.com/owner/repo/pull/123
```

[![npm](https://img.shields.io/npm/v/cli-pr-consensus.svg?style=flat-square)](https://www.npmjs.com/package/cli-pr-consensus)
[![node](https://img.shields.io/badge/node-18+-93450a.svg?style=flat-square)](https://nodejs.org/)
[![license](https://img.shields.io/badge/license-MIT-grey.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## what it does

- **agent-aware parsing** — each AI reviewer (Copilot, CodeRabbit, Bito, Devin, Greptile) has a dedicated parser that strips proprietary markup, extracts structured fields (`issue`, `fix`, `suggestion`, `citations`), and normalizes to clean markdown
- **noise filtering** — auto-detects and removes bot status messages, empty bodies, dependabot/renovate/github-actions chatter. customizable via `.pr-consensus-ignore`
- **four output formats** — JSON, YAML, markdown, and `consensus` (LLM-optimized: groups comments by folder, clusters by line range, includes truncated diff hunks)
- **three data modes** — comments only (default), code only (`--code`), or everything (`--full`)
- **line-range clustering** — inline comments within 5 lines of each other get grouped together with a shared diff hunk context
- **comment enrichment** — cross-references GraphQL and REST data to get the richest line/hunk metadata per comment
- **custom templates** — `--template` flag supports Go-style template syntax for markdown output

## prerequisites

[GitHub CLI](https://cli.github.com/) (`gh`) must be installed and authenticated. the tool shells out to `gh` for all GitHub API calls — no token env vars needed.

```bash
gh auth login
```

## install

```bash
npm install -g cli-pr-consensus
```

or run without installing:

```bash
npx cli-pr-consensus <PR_URL>
```

or from source:

```bash
git clone https://github.com/yigitkonur/cli-pr-consensus.git
cd cli-pr-consensus
pnpm install --frozen-lockfile && pnpm build
node dist/index.js <PR_URL>
```

## usage

```bash
# default: fetch comments, output JSON
prc https://github.com/owner/repo/pull/123

# shorthand works too
prc owner/repo/123

# LLM-optimized consensus format
prc owner/repo/123 -f consensus

# full mode: comments + diffs + file patches
prc owner/repo/123 --full -f yaml

# code only: files and diffs, skip comments
prc owner/repo/123 --code

# write to file
prc owner/repo/123 -f md -o review.md

# custom markdown template
prc owner/repo/123 -f md --template my-template.md

# disable noise filtering
prc owner/repo/123 --no-filter

# verbose progress info to stderr
prc owner/repo/123 -v
```

## CLI flags

```
USAGE:
    prc <url> [options]

ARGUMENTS:
    url                         PR URL or shorthand owner/repo/number

OPTIONS:
    -f, --format <type>         output format: json (default), yaml, md, consensus
    -t, --template <file>       custom Go-style template for md format
    -o, --output <file>         write to file instead of stdout
        --code                  code-only mode: files + diffs, no comments
        --full                  full mode: comments + diffs + file patches
        --include-diff          include full unified diff in normal mode
        --no-filter             disable noise filtering
        --filter-file <file>    custom filter patterns file
    -v, --verbose               print progress summary to stderr
    -q, --quiet                 suppress all non-data output
```

## output formats

| format | what you get |
|:---|:---|
| `json` | full `PRConsensusOutput` object, pretty-printed |
| `yaml` | restructured: files grouped by folder, sorted by total change count |
| `md` | markdown with tables, sections, inline comments. supports `--template` |
| `consensus` | LLM-optimized: comments clustered by file and line range, diff hunks (max 15 lines), agent badges, review decisions |

## supported agents

| agent | detection | parsed fields |
|:---|:---|:---|
| Copilot | `copilot`, `copilot-*` | `suggestion` blocks |
| CodeRabbit | `coderabbitai`, `coderabbit*` | `issue` (callout type), `suggestion`; auto-flags noise |
| Bito | `bito`, `bito-*` | `issue`/`fix` (HTML divs), `suggestion`, `citations` |
| Devin | `devin`, `devin-*` | `file`, `line`, `endLine`, `issue` (from JSON in HTML comments) |
| Greptile | `greptile*` | generic parser (clean markdown) |

unknown agents get a generic parser that normalizes whitespace and extracts `suggestion` blocks.

## noise filtering

built-in patterns filter ~25 common noise patterns (bot status updates, empty bodies, acknowledgements). you can extend with a `.pr-consensus-ignore` file in your cwd or home directory:

```
# exclude specific authors
@dependabot
@renovate

# regex patterns
/automated merge/i

# plain text (becomes case-insensitive regex)
review skipped
```

## project structure

```
src/
  index.ts              — CLI entry point (commander.js)
  collector.ts          — orchestrator: fetches, parses, filters, builds output
  types/index.ts        — all TypeScript interfaces
  rest/
    diff.ts             — all gh CLI subprocess calls (execSync)
  graphql/
    queries.ts          — GraphQL query strings
  parsers/
    index.ts            — agent detection + routing
    copilot.ts          — Copilot comment parser
    coderabbit.ts       — CodeRabbit comment parser
    bito.ts             — Bito comment parser
    devin.ts            — Devin comment parser
    generic.ts          — fallback parser
  filters/
    defaults.ts         — built-in noise patterns + excluded authors
    noise.ts            — filter config loader + noise detection
  formatters/
    json.ts             — JSON + NDJSON output
    yaml.ts             — YAML output (folder-grouped)
    markdown.ts         — markdown + Go-style template engine
    consensus.ts        — LLM-optimized consensus output
```

## license

MIT
