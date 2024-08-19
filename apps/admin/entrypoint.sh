#!/bin/sh
set -e

COMMAND="${1:-server}"

if [ $COMMAND = "server" ]; then
  echo "Starting admin server..."
  npm run start
else
  echo "Usage: entrypoint.sh [server]"
  exit 1
fi
