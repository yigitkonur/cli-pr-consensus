#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# worktree-init.sh - Initialize a git worktree for cli-prconsensus
#
# Run this script from inside a freshly created git worktree to:
#   1. Copy .env (if it exists in the main repo)
#   2. Copy .claude/settings.local.json (if it exists in the main repo)
#   3. Install npm dependencies from the lockfile
#   4. Build the TypeScript project
#
# This script is idempotent -- safe to run multiple times.
###############################################################################

MAIN_REPO="/Users/yigitkonur/dev/projects/my-cli/cli-prconsensus"
WORKTREE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> worktree-init.sh"
echo "    Main repo : ${MAIN_REPO}"
echo "    Worktree  : ${WORKTREE_DIR}"
echo ""

# --------------------------------------------------------------------------- #
# 1. Copy .env from main repo (if present)
# --------------------------------------------------------------------------- #
if [[ -f "${MAIN_REPO}/.env" ]]; then
  cp "${MAIN_REPO}/.env" "${WORKTREE_DIR}/.env"
  echo "[ok] Copied .env"
else
  echo "[skip] No .env found in main repo"
fi

# --------------------------------------------------------------------------- #
# 2. Copy .claude/settings.local.json from main repo (if present)
# --------------------------------------------------------------------------- #
if [[ -f "${MAIN_REPO}/.claude/settings.local.json" ]]; then
  mkdir -p "${WORKTREE_DIR}/.claude"
  cp "${MAIN_REPO}/.claude/settings.local.json" "${WORKTREE_DIR}/.claude/settings.local.json"
  echo "[ok] Copied .claude/settings.local.json"
else
  echo "[skip] No .claude/settings.local.json found in main repo"
fi

# --------------------------------------------------------------------------- #
# 3. Install dependencies (npm ci for reproducible installs from lockfile)
# --------------------------------------------------------------------------- #
echo ""
echo "==> Installing npm dependencies ..."
cd "${WORKTREE_DIR}"
npm ci
echo "[ok] npm ci completed"

# --------------------------------------------------------------------------- #
# 4. Build the project
# --------------------------------------------------------------------------- #
echo ""
echo "==> Building TypeScript project ..."
npm run build
echo "[ok] Build completed"

echo ""
echo "==> Worktree is ready at ${WORKTREE_DIR}"
