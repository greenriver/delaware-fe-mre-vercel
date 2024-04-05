#!/bin/bash
set -e

if [ "$(ls -A node_modules)" ]
then
  echo Not running npm install since node_modules has files
else
  echo Looks like your first time so installing node modules
  npm install
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
