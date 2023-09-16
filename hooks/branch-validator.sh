#!/bin/sh

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ] || [ "$branch" = "develop" ]; then
  echo "You can't commit directly to main or develop branch"
  exit 1
fi