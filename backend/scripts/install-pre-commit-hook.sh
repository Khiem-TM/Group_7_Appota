#!/bin/sh
set -e

repo_root=$(git rev-parse --show-toplevel)
source_hook="$repo_root/backend/scripts/pre-commit"
target_hook="$repo_root/.git/hooks/pre-commit"

if [ ! -f "$source_hook" ]; then
	echo "source hook not found: $source_hook"
	exit 1
fi

cp "$source_hook" "$target_hook"
chmod +x "$target_hook"
echo "Installed pre-commit hook at $target_hook"
