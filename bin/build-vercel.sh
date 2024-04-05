#!/bin/bash

# check if the message indicates we should skip [skip-ci]
if grep -qi "\[skip[- ]ci\]" <<< "$VERCEL_GIT_COMMIT_MESSAGE" ; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
fi
