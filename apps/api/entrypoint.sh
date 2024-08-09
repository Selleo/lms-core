#!/bin/sh
set -e

COMMAND="${1:-server}"

if [ $COMMAND = "server" ]; then
  echo "Starting server..."
  npm run start:prod
elif [ $COMMAND = "migrate" ]; then
  echo "Running migrations..."
  npm run db:migrate
elif [ $COMMAND = "seed" ]; then
  echo "Running seeds..."
  node /app/dist/bin/seed.js
else
  echo "Usage: entrypoint.sh [server|migrate]"
  exit 1
fi
