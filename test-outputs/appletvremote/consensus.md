# PR #1: docs: Add comprehensive architecture documentation

> **Status**: Pending | **Author**: @yigitkonur | **Files**: 2 | **Comments**: 20

## Summary

**@devin-ai-integration** (COMMENTED): ## ✅ Devin Review: No Issues Found Devin Review analyzed this PR and found no potential bugs to report. View in Devin Review to see 2 additional flags. <!-- devin-review-badge-begin --> <a href="https://app.devin.ai/review/yigitkonur/website-appletvremote/pull/1">   <picture>     <source media="(...

**@coderabbitai** (COMMENTED): **Actionable comments posted: 1** <details> <summary>🤖 Fix all issues with AI agents</summary> ``` In `@docs/ARCHITECTURE.md`: - Line 772: Update the clone instruction that currently uses the placeholder URL "git clone https://github.com/[org]/website-appletvremote.git" to the real repository pa...

**@copilot-pull-request-reviewer** (COMMENTED): ## Pull request overview This PR adds comprehensive architecture documentation to the Apple TV Remote marketing website repository. The documentation provides an in-depth guide covering the project's structure, technology stack, internationalization system, component architecture, and deployment ...

**@copilot-pull-request-reviewer** (COMMENTED): ## Pull request overview Copilot reviewed 1 out of 2 changed files in this pull request and generated 8 comments. --- 💡 <a href="/yigitkonur/website-appletvremote/new/main/.github/instructions?filename=*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Cop...

---

## File Reviews

### 📁 docs/

### `ARCHITECTURE.md` (15 comments)

#### Line 111

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The file name is listed as "Tabs.tsx" but the actual file in the codebase is "Tab.tsx" (singular). This should be corrected to match the actual file name.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> │   │   ├── Tab.tsx               # Tab navigation
> ```

**@copilot-pull-request-reviewer** [copilot]:
> The documented RetroUI component list on line 112 shows "Tabs.tsx" but the actual filename in the codebase is "Tab.tsx" (without the 's'). This should be corrected for accuracy.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> │   │   ├── Tab.tsx               # Tab navigation
> ```

#### Line 148

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation states feature content files are in "lib/content/features/{id}.ts" (with .ts extension), but these files actually use the .tsx extension in the codebase. This should be corrected to ".tsx" to accurately reflect the actual file naming convention.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> │   │       ├── device-discovery.tsx
> │   │       ├── remote-control.tsx
> │   │       ├── keyboard-shortcuts.tsx
> │   │       └── [10 more feature files].tsx
> ```

**@copilot-pull-request-reviewer** [copilot]:
> The feature content files are documented with .ts extensions (device-discovery.ts, remote-control.ts, keyboard-shortcuts.ts), but the actual files in the codebase use .tsx extensions. This should be corrected throughout the directory structure diagram.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> │   │       ├── device-discovery.tsx
> │   │       ├── remote-control.tsx
> │   │       ├── keyboard-shortcuts.tsx
> ```

#### Line 188

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documented directory structure shows icon files (apple-icon.png, icon.png, opengraph-image.png, twitter-image.png) in the public/ directory, but these files are actually located in the app/ directory. This is the correct location for Next.js 16 App Router, but the documentation should be updated to reflect the actual file locations to avoid confusion.

#### Line 212

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation references "Content: lib/content/features/device-discovery.ts" but the actual file extension is .tsx, not .ts. This should be updated to match the actual file naming.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> - Content: `lib/content/features/device-discovery.tsx`
> ```

#### Line 223

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation states there are 24 supported locales throughout (lines 5, 49, 59, 223, 730), but the actual i18n/config.ts file contains only 23 locales. Additionally, the messages-src directory contains 24 locale folders including 'ko' (Korean), but Korean is missing from the i18n/config.ts locales array and is not documented in the Supported Locales table. This is a discrepancy between the codebase state and the documentation that needs to be resolved - either add Korean to the configuration or remove it from messages-src and update the documentation to reflect 23 locales.

#### Line 359

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation lists "home" and "menu" as available icons, but these icons are not present in the actual ICON_REGISTRY in lib/icons/registry.tsx. The documentation should only list icons that are actually available in the registry, or these icons should be added to the registry if they're needed.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> Available icons: `keyboard`, `tv`, `monitor`, `volume-2`, `play`, `pause`, `skip-forward`, `skip-back`, `search`, `settings`, `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right`, and 40+ more.
> ```

#### Line 403

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation states feature content is defined in "lib/content/features/{id}.ts" but the actual files use the .tsx extension. The file extension should be corrected to .tsx throughout this section.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> Feature content is defined in `lib/content/features/{id}.tsx`:
> ```

#### Line 673

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The wrangler.toml configuration shows name as "apple-tv-remote-website" but the documentation states "apple-tv-remote". This should be updated to match the actual configuration in wrangler.toml.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> name = "apple-tv-remote-website"
> ```

**@copilot-pull-request-reviewer** [copilot]:
> The wrangler.toml configuration example shows name = "apple-tv-remote" but the actual wrangler.toml file in the codebase uses name = "apple-tv-remote-website". The documentation should match the actual configuration. Additionally, the actual wrangler.toml includes a compatibility_date field which is missing from the documentation example.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> name = "apple-tv-remote-website"
> compatibility_date = "2024-01-01"
> ```

#### Line 703

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The example code for adding a new icon shows "export const iconRegistry" (line 703) but the actual code in lib/icons/registry.tsx uses "export const ICON_REGISTRY" (all uppercase). The documentation example should match the actual constant name used in the codebase.
> 
> *(See code suggestion below)*

> **Suggestion**:
> ```suggestion
> export const ICON_REGISTRY = {
> ```

#### Line 733

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The documentation states there are 13 UI Components, but the components/retroui/ directory contains 23 component files (Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Checkbox, Dialog, Input, Label, Menu, Select, Skeleton, Slider, Switch, Tab, Table, Text, Textarea, Toggle, Tooltip). The count should be updated to accurately reflect the actual number of UI components.

#### Line 739

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@copilot-pull-request-reviewer** [copilot]:
> The "What This PR Contains" section (lines 739-765) describes the entire application codebase as if this PR is adding all of those files. However, based on the actual changes in this PR (only adding ARCHITECTURE.md and updating .gitignore), this section is documenting the existing codebase rather than describing what this specific PR adds. Consider rephrasing this section to clarify that it documents the existing architecture rather than claiming these files are being added in this PR, or retitle it to "What This Repository Contains".

#### Line 772

```diff
@@ -0,0 +1,791 @@
+# Apple TV Remote Marketing Website - Initial Repository Setup
+
+## Overview
+
+This repository contains the complete marketing website for **Apple TV Remote**, a native macOS desktop application that enables users to control their Apple TV directly from their Mac. The website is built with modern web technologies, featuring world-class internationalization (24 languages), accessibility compliance, and SEO optimization.
+
+**Live URL**: https://appletvremote.app
+
+---
+
+## Product: Apple TV Remote
+
+### What It Does
+
// ... (truncated)
```

**@coderabbitai** [coderabbit]:
> _⚠️ Potential issue_ | _🟡 Minor_
> 
> **Replace placeholder with actual repository path.**
> 
> The clone command contains `[org]` placeholder - users copying this command will hit an immediate error. What breaks: Developer onboarding fails at step 1. Blast radius: Anyone following the getting started guide can't clone the repo.
> 
> <details>
> <summary>🔧 Suggested fix</summary>
> 
> ```diff
> -git clone https://github.com/[org]/website-appletvremote.git
> +git clone https://github.com/yigitkonur/website-appletvremote.git
> ```
> 
> </details>
> 
> <details>
> <summary>📝 Committable suggestion</summary>
> ‼️ **IMPORTANT**
> Carefully review the code before committing. Ensure that it accurately replaces the highlighted code, contains no missing lines, and has no issues with indentation. Thoroughly test & benchmark the code to ensure it meets the requirements.
> 
> ```suggestion
> git clone https://github.com/yigitkonur/website-appletvremote.git
> ```
> 
> </details>
> 
> <details>
> <summary>🤖 Prompt for AI Agents</summary>
> 
> ```
> In `@docs/ARCHITECTURE.md` at line 772, Update the clone instruction that
> currently uses the placeholder URL "git clone
> https://github.com/[org]/website-appletvremote.git" to the real repository path
> by replacing "[org]" with the actual GitHub organization or username (e.g., "git
> clone https://github.com/actual-org/website-appletvremote.git"); ensure the
> example matches the project's canonical repo and verify the URL works by
> attempting a clone before committing the change.
> ```
> 
> </details>

> **Suggestion**:
> ```suggestion
> -git clone https://github.com/[org]/website-appletvremote.git
> +git clone https://github.com/yigitkonur/website-appletvremote.git
> ```

---

## Overall Feedback

### @coderabbitai [coderabbit]

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

Updates `.gitignore` to track additional Markdown documentation files in the `docs/` directory alongside existing patterns, and introduces a comprehensive architecture documentation file detailing the Apple TV Remote marketing website's structure, technology stack, routing, internationalization, and deployment configuration.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Git Configuration** <br> `.gitignore`|Updated documentation ignore rules; changed header comment to reflect "essential docs" and added exception for `docs/*.md` files to be tracked in version control.|
|**Architecture Documentation** <br> `docs/ARCHITECTURE.md`|New comprehensive documentation file covering the Next.js 16 app structure, technology stack, directory organization, route groups, dynamic routing, 24-locale internationalization with RTL support, SEO/JSON-LD systems, component design patterns, build/deployment workflows (Vercel and Cloudflare Pages), and development guidelines.|

## Estimated code review effort

🎯 1 (Trivial) | ⏱️ ~3 minutes

## Poem
📚 ✨ Architecture flows like a map,  
Docs emerge from the planning gap,  
Git now tracks what matters most,  
Clarity blooms from every post!

</details>

<details>
<summary>🚥 Pre-merge checks | ✅ 3</summary>

<details>
<summary>✅ Passed checks (3 passed)</summary>

|     Check name     | Status   | Explanation                                                                                                                          |
| :----------------: | :------- | :----------------------------------------------------------------------------------------------------------------------------------- |
|     Title check    | ✅ Passed | The pull request title accurately describes the main change: adding comprehensive architecture documentation to the docs/ directory. |
| Docstring Coverage | ✅ Passed | No functions found in the changed files to evaluate docstring coverage. Skipping docstring coverage check.                           |
|  Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                          |

</details>

<sub>✏️ Tip: You can configure your own custom pre-merge checks in the settings.</sub>

</details>

<details>
<summary>✨ Finishing touches</summary>

- [ ]  📝 Generate docstrings
<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ]    Create PR with unit tests
- [ ]    Post copyable unit tests in a comment
- [ ]    Commit unit tests in branch `docs/architecture`

</details>

</details>

---

<sub>Comment `@coderabbitai help` to get the list of available commands and usage tips.</sub>

### @devin-ai-integration [devin]

## ✅ Devin Review: No Issues Found

Devin Review analyzed this PR and found no potential bugs to report.

View in Devin Review to see 2 additional flags.

### @coderabbitai [coderabbit]

**Actionable comments posted: 1**

<details>
<summary>🤖 Fix all issues with AI agents</summary>

```
In `@docs/ARCHITECTURE.md`:
- Line 772: Update the clone instruction that currently uses the placeholder URL
"git clone https://github.com/[org]/website-appletvremote.git" to the real
repository path by replacing "[org]" with the actual GitHub organization or
username (e.g., "git clone
https://github.com/actual-org/website-appletvremote.git"); ensure the example
matches the project's canonical repo and verify the URL works by attempting a
clone before committing the change.
```

</details>

<details>
<summary>🧹 Nitpick comments (2)</summary><blockquote>

<details>
<summary>docs/ARCHITECTURE.md (2)</summary><blockquote>

`72-193`: **Consider adding language specifier for consistent rendering.**

The directory tree structure uses an unmarked code fence. Some Markdown renderers may not display this optimally.

<details>
<summary>📝 Suggested improvement</summary>

Add `text` language specifier:

```diff
-```
+```text
 apple-tv-app-website/
 ├── app/                          # Next.js App Router
```

</details>

---

`517-521`: **Add language specifier for robots.txt example.**

The robots.txt content block lacks a language specifier, which may affect rendering in some Markdown viewers.

<details>
<summary>📝 Suggested improvement</summary>

```diff
-```
+```text
 User-agent: *
 Allow: /
 Sitemap: https://appletvremote.app/sitemap.xml
```

</details>

</blockquote></details>

</blockquote></details>

### @copilot-pull-request-reviewer [copilot]

## Pull request overview

This PR adds comprehensive architecture documentation to the Apple TV Remote marketing website repository. The documentation provides an in-depth guide covering the project's structure, technology stack, internationalization system, component architecture, and deployment strategies.

**Changes:**
- Added complete ARCHITECTURE.md file with detailed technical documentation
- Updated .gitignore to allow documentation files in the docs/ directory while excluding other markdown files

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 6 comments.

| File | Description |
| ---- | ----------- |
| docs/ARCHITECTURE.md | Comprehensive 791-line documentation covering project structure, i18n system, component architecture, SEO implementation, build system, and development guidelines |
| .gitignore | Updated to whitelist docs/*.md files while maintaining exclusion of other markdown files |





---

💡 <a href="/yigitkonur/website-appletvremote/new/main/.github/instructions?filename=*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.

### @copilot-pull-request-reviewer [copilot]

## Pull request overview

Copilot reviewed 1 out of 2 changed files in this pull request and generated 8 comments.





---

💡 <a href="/yigitkonur/website-appletvremote/new/main/.github/instructions?filename=*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.

---
*Generated in consensus mode by pr-consensus*